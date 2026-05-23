using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Services;

namespace QMS_Certificate_Store_Portal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/transaction/[controller]")]
    public class TransactionCertificateApprovalController : ControllerBase
    {
        private readonly TransactionCertificateApprovalService _service;
        public TransactionCertificateApprovalController(TransactionCertificateApprovalService service) => _service = service;

        // 1. Process approval (Approve / Reject button click)
        [HttpPost("process")]
        public async Task<IActionResult> Process(
     TransactionCertificateApproval model
 )
        {
            Console.WriteLine("IDCertificate");

            Console.WriteLine(model.IDCertificate);

            // =====================================
            // USER NAME
            // =====================================
            model.UserAction =
                User.FindFirst("UserFullName")?.Value
                ?? "System";

            // =====================================
            // APPROVED BY USER ID
            // =====================================
            model.ApprovedBy = Convert.ToInt32(
                User.FindFirst("IDUser")?.Value ?? "0"
            );

            // =====================================
            // APPROVAL DATE
            // =====================================
            model.ApprovalDate = DateTime.Now;

            // =====================================
            // PROCESS
            // =====================================
            var result =
                await _service.ProcessAsync(model);

            return Ok(result);
        }

        // 2. Get all pending certificates
        [HttpGet("pending")]
        public async Task<IActionResult> GetPending()
        {
            // =====================================
            // GET COMPANY & LOCATION FROM JWT
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
            var data = await _service.GetPendingAsync(
                companyId,
                locationId
            );

            return Ok(new
            {
                success = true,
                data
            });
        }

        // 3. Change status (Reject → Approve or Approve → Reject)
        [HttpPut("change-status")]
        public async Task<IActionResult> ChangeStatus(TransactionCertificateApproval model)
        {
            model.UserAction = User.FindFirst("UserFullName")?.Value ?? "System";

            // Add these two lines to populate the required fields:
            model.ApprovedBy = Convert.ToInt32(
     User.FindFirst("IDUser")?.Value ?? "0"
 );
            model.ApprovalDate = DateTime.Now;

            var result = await _service.ChangeStatusAsync(model);
            return Ok(result);
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetApprovalHistory()
        {
            try
            {
                // =====================================
                // GET COMPANY & LOCATION FROM JWT
                // =====================================
                var companyId = Convert.ToInt32(
                    User.FindFirst("IDCompany")?.Value ?? "0"
                );

                var locationId = Convert.ToInt32(
                    User.FindFirst("IDLocation")?.Value ?? "0"
                );

                // =====================================
                // GET HISTORY
                // =====================================
                var data = await _service.GetApprovalHistoryAsync(
                    companyId,
                    locationId
                );

                // =====================================
                // RESPONSE
                // =====================================
                return Ok(new
                {
                    success = true,
                    data
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

    }
}
