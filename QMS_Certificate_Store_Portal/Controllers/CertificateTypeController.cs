using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Services;

namespace QMS_Certificate_Store_Portal.Controllers
{   [Authorize]
    [ApiController]
    [Route("api/master/[controller]")] // Matching your exact requirement>
    public class CertificateTypeController : ControllerBase
    {
        private readonly CertificateTypeService _service;
        public CertificateTypeController(CertificateTypeService service) => _service = service;

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetAllAsync();
            return Ok(new { success = true, data });
        }

        [HttpGet("get-by-id/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _service.GetByIdAsync(id);
            return Ok(new { success = true, data });
        }

        [HttpPost("save")]
        public async Task<IActionResult> Save(CertificateType model)
        {
            // Matching your exact CompanyController logic
            model.UserAction = User.FindFirst("UserFullName")?.Value ?? "System";
            var result = await _service.SaveAsync(model);
            return Ok(result);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // Handling delete with the same UserAction pattern
            var actionUser = User.FindFirst("UserFullName")?.Value ?? "System";
            var result = await _service.DeleteAsync(id, actionUser);
            return Ok(result);
        }
    }
}
