using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using QMS_Certificate_Store_Portal.Services;

namespace QMS_Certificate_Store_Portal.Controllers
{
    [Route("api/transaction/[controller]")]
    [ApiController]
    [Authorize]
    public class CertificateReminderController
        : ControllerBase
    {
        private readonly CertificateReminderService
            _service;

        public CertificateReminderController(
            CertificateReminderService service
        )
        {
            _service = service;
        }

        // =====================================
        // GET PENDING REMINDERS
        // =====================================
        [HttpGet("pending-reminders")]
        public async Task<IActionResult>
            GetPendingReminders()
        {
            try
            {
                var data =
                    await _service
                        .GetPendingRemindersAsync();

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