using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Services;
using static QMS_Certificate_Store_Portal.Models.Certificate;

namespace QMS_Certificate_Store_Portal.Controllers
{
    [Route("api/transaction/[controller]")]
    [ApiController]
    [Authorize]
    public class CertificateReminderController : ControllerBase
    {
        private readonly CertificateReminderService _service;

        public CertificateReminderController(
            CertificateReminderService service)
        {
            _service = service;
        }

        // GET:
        // /api/transaction/CertificateReminder/pending-reminders
        [HttpGet("pending-reminders")]
        public async Task<IActionResult> GetPendingReminders()
        {
            try
            {
                var data = await _service.GetPendingRemindersAsync();

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

        // GET:
        // /api/transaction/CertificateReminder/by-certificate/1
        [HttpGet("by-certificate/{idCertificate:int}")]
        public async Task<IActionResult> GetByCertificate(
            int idCertificate)
        {
            try
            {
                var data =
                    await _service.GetByCertificateIdAsync(
                        idCertificate
                    );

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

        // POST:
        // /api/transaction/CertificateReminder/save
        [HttpPost("save")]
        public async Task<IActionResult> Add(
            [FromBody] SaveCertificateReminderRequest request)
        {
            try
            {
                if (request == null || request.IDCertificate <= 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Valid certificate ID is required."
                    });
                }

                var actionUser =
                    User.FindFirst("UserFullName")?.Value
                    ?? User.Identity?.Name
                    ?? "System";

                var result =
                    await _service.AddAsync(
                        request,
                        actionUser
                    );

                return Ok(new
                {
                    success = result.Result >= 0,
                    message = result.Message,
                    data = result
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