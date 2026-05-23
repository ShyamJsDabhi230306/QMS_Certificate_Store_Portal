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

        public CertificateController(CertificateService service, IWebHostEnvironment env)
        {
            _service = service;
            _env = env;
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



    }
}
