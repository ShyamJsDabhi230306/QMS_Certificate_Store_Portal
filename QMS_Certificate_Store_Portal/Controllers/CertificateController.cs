using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Services;
using System;
using System.IO;
using System.Threading.Tasks;

namespace QMS_Certificate_Store_Portal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/transaction/[controller]")]
    public class CertificateController : ControllerBase
    {
        private readonly CertificateService _service;
        private readonly IWebHostEnvironment _env;
        private readonly WhatsAppService _whatsAppService; // 👈 


        public CertificateController(CertificateService service, IWebHostEnvironment env, WhatsAppService whatsAppService)
        {
            _service = service;
            _env = env;
            _whatsAppService = whatsAppService; // 👈
            
        }

        // 1. Get the list of all Certificates
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            // =====================================
            // GET USER COMPANY & LOCATION
            // =====================================
            var companyId = Convert.ToInt32(
                User.FindFirst("IDCompany")?.Value ?? "0"
            );

            var locationId = Convert.ToInt32(
                User.FindFirst("IDLocation")?.Value ?? "0"
            );

            // =====================================
            // GET DATA
            // =====================================
            var data = await _service.GetAllAsync(companyId,locationId);

            return Ok(new
            {
                success = true,
                data
            });
        }

        // 2. Get details of a single Certificate
        [HttpGet("get-by-id/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _service.GetByIdAsync(id);
            return Ok(new { success = true, data });
        }

        // 3. Save (Insert or Update) Certificate
        [HttpPost("save")]
        public async Task<IActionResult> Save(Certificate model)
        {
            model.UserAction = User.FindFirst("UserFullName")?.Value ?? "System";
            var result = await _service.SaveAsync(model);
            return Ok(result);
        }

        // 4. Soft-delete Certificate
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var actionUser = User.FindFirst("UserFullName")?.Value ?? "System";
            var result = await _service.DeleteAsync(id, actionUser);
            return Ok(result);
        }

        // 5. File Upload Handler (Saves files in wwwroot/uploads/certificates)
        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            try
            {
                // Smart fallback: Create wwwroot folder in project directory if missing
                var webRootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var uploadsFolder = Path.Combine(webRootPath, "uploads", "certificates");

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }


                // Generate a unique filename using a Timestamp to prevent collisions
                var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                // Relative URL path to save in DB
                var relativePath = $"/uploads/certificates/{uniqueFileName}";

                return Ok(new
                {
                    success = true,
                    fileName = file.FileName,
                    filePath = relativePath
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // 6. File Download Endpoint - streams file through API so CORS works
        [HttpGet("download")]
        [AllowAnonymous]
        public IActionResult DownloadFile([FromQuery] string path)
        {
            if (string.IsNullOrEmpty(path))
                return BadRequest("No file path provided.");

            try
            {
                var webRootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                // Strip the leading slash and combine with wwwroot
                var relativePath = path.TrimStart('/');
                var fullPath = Path.Combine(webRootPath, relativePath.Replace('/', Path.DirectorySeparatorChar));

                if (!System.IO.File.Exists(fullPath))
                    return NotFound("File not found on server.");

                var fileName = System.IO.Path.GetFileName(fullPath);
                var contentType = "application/octet-stream";

                // Detect content type by extension
                var ext = Path.GetExtension(fileName).ToLowerInvariant();
                contentType = ext switch
                {
                    ".pdf" => "application/pdf",
                    ".jpg" or ".jpeg" => "image/jpeg",
                    ".png" => "image/png",
                    ".doc" => "application/msword",
                    ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    _ => "application/octet-stream"
                };

                var fileBytes = System.IO.File.ReadAllBytes(fullPath);
                return File(fileBytes, contentType, fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error reading file: {ex.Message}");
            }
        }

        // Dashboard Stats Endpoint
        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var companyId = Convert.ToInt32(
          User.FindFirst("IDCompany")?.Value ?? "0"
            );

                var locationId = Convert.ToInt32(
                    User.FindFirst("IDLocation")?.Value ?? "0"
                );

                // =====================================
                // GET DASHBOARD DATA
                // =====================================
                var data = await _service.GetDashboardStatsAsync(
                    companyId,
                    locationId
                );

                // =====================================
                // SUCCESS RESPONSE
                // =====================================
                return Ok(new
                {
                    success = true,
                    data
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }


        // 7. Export all Certificates to Excel
        [HttpGet("export")]
        public async Task<IActionResult> ExportToExcel()
        {

            var isSuperAdmin = Convert.ToBoolean(User.FindFirst("IsSuperAdmin")?.Value ?? "false");
            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value ?? "";
            bool isAllowed = isSuperAdmin ||
                             role.Equals("Admin", StringComparison.OrdinalIgnoreCase) ||
                             role.Equals("Approver", StringComparison.OrdinalIgnoreCase);
            if (!isAllowed)
            {
                return Forbid("You do not have permission to export certificate data.");
            }
            try
            {
                // Retrieve current user company & location
                var companyId = Convert.ToInt32(User.FindFirst("IDCompany")?.Value ?? "0");
                var locationId = Convert.ToInt32(User.FindFirst("IDLocation")?.Value ?? "0");

                // Get certificate data
                var data = await _service.GetAllAsync(companyId, locationId);

                using (var workbook = new XLWorkbook())
                {
                    var worksheet = workbook.Worksheets.Add("Certificates");

                    // Set headers
                    worksheet.Cell(1, 1).Value = "Certificate";
                    worksheet.Cell(1, 2).Value = "Certificate No";
                    worksheet.Cell(1, 3).Value = "Type";
                    worksheet.Cell(1, 4).Value = "Issue Date";
                    worksheet.Cell(1, 5).Value = "Expiry Date";
                    worksheet.Cell(1, 6).Value = "Surveillance Date";
                    worksheet.Cell(1, 7).Value = "Days Left";

                    // Apply Header styling
                    var headerRange = worksheet.Range("A1:G1");
                    headerRange.Style.Font.Bold = true;
                    headerRange.Style.Fill.BackgroundColor = XLColor.LightGray;

                    int row = 2;
                    foreach (var cert in data)
                    {
                        worksheet.Cell(row, 1).Value = cert.CertificateName;
                        worksheet.Cell(row, 2).Value = cert.CertificateNumber;
                        worksheet.Cell(row, 3).Value = cert.CertificateTypeName ?? "–";
                        worksheet.Cell(row, 4).Value = cert.IssueDate.ToString("dd-MM-yyyy");
                        worksheet.Cell(row, 5).Value = cert.ExpiryDate?.ToString("dd-MM-yyyy");

                        worksheet.Cell(row, 6).Value = cert.SurveillanceDate.HasValue
                            ? cert.SurveillanceDate.Value.ToString("dd-MM-yyyy")
                            : "–";

                        // Calculate Days Left (based on Surveillance Date, matching UI logic)
                        if (cert.SurveillanceDate.HasValue)
                        {
                            int daysLeft = (cert.SurveillanceDate.Value.Date - DateTime.Today).Days;
                            worksheet.Cell(row, 7).Value = daysLeft;
                        }
                        else
                        {
                            worksheet.Cell(row, 7).Value = "–";
                        }

                        row++;
                    }

                    // Auto-adjust columns width to fit content
                    worksheet.Columns().AdjustToContents();

                    using (var stream = new MemoryStream())
                    {
                        workbook.SaveAs(stream);
                        var content = stream.ToArray();
                        return File(
                            content,
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            "Certificates_Export.xlsx"
                        );
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error while exporting: {ex.Message}");
            }
        }


        // 8. Send test WhatsApp message
        [HttpPost("send-test-whatsapp")]
        public async Task<IActionResult> SendTestWhatsApp([FromBody] WhatsAppTestRequest request)
        {
            if (string.IsNullOrEmpty(request.PhoneNumber))
                return BadRequest(new { success = false, message = "Phone number is required." });

            var result = await _whatsAppService.SendTemplateNotificationAsync(request.PhoneNumber);
            if (result)
            {
                return Ok(new { success = true, message = "WhatsApp notification sent successfully!" });
            }
            else
            {
                return StatusCode(500, new { success = false, message = "Failed to send WhatsApp notification. Check server logs." });
            }
        }

        // DTO model for the request body
        public class WhatsAppTestRequest
        {
            public string PhoneNumber { get; set; }
        }

        // =====================================
        // GET PENDING REMINDERS
        // =====================================
        [HttpGet("pending-reminders")]
        public async Task<IActionResult> GetPendingReminders()
        {
            try
            {
                var data = await _service.GetPendingRemindersAsync();
                return Ok(new { success = true, data });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
        // =====================================
        // GET CUSTOM CONTACTS BY REMINDER ID
        // =====================================
        [HttpGet("custom-contacts/{reminderId}")]
        public async Task<IActionResult> GetCustomContacts(int reminderId)
        {
            try
            {
                var data = await _service.GetCustomContactsAsync(reminderId);
                return Ok(new { success = true, data });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
        // =====================================
        // SAVE CUSTOM CONTACT
        // =====================================
        [HttpPost("save-custom-contact")]
        public async Task<IActionResult> SaveCustomContact(ReminderCustomContact model)
        {
            try
            {
                var actionUser = User.FindFirst("UserFullName")?.Value ?? "System";
                if (model.IDCustom > 0)
                {
                    model.U_By = actionUser;
                }
                else
                {
                    model.E_By = actionUser;
                }
                var resultId = await _service.SaveCustomContactAsync(model);
                return Ok(new { success = true, data = resultId, message = "Custom contact saved successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
        // =====================================
        // DELETE CUSTOM CONTACT
        // =====================================
        [HttpDelete("delete-custom-contact/{idCustom}")]
        public async Task<IActionResult> DeleteCustomContact(int idCustom)
        {
            try
            {
                var actionUser = User.FindFirst("UserFullName")?.Value ?? "System";
                await _service.DeleteCustomContactAsync(idCustom, actionUser);
                return Ok(new { success = true, message = "Custom contact deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }


        [HttpPost("save-log")]
        public async Task<IActionResult> SaveLog([FromBody] CertificateLog model)
        {
            try
            {
                var result = await _service.SaveCertificateLog(model);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("logs")]
        public async Task<IActionResult> GetLogs()
        {
            var isSuperAdmin =
       Convert.ToBoolean(
           User.FindFirst("IsSuperAdmin")?.Value ?? "false"
       );

            var role =
                User.FindFirst(
                    System.Security.Claims.ClaimTypes.Role
                )?.Value ?? "";

            bool isAllowed =
                isSuperAdmin ||
                role.Equals(
                    "Admin",
                    StringComparison.OrdinalIgnoreCase
                ) ||
                role.Equals(
                    "Approver",
                    StringComparison.OrdinalIgnoreCase
                );

            if (!isAllowed)
            {
                return Forbid(
                    "You do not have permission to view certificate logs."
                );
            }
            try
            {
                var result = await _service.GetCertificateLogs();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
