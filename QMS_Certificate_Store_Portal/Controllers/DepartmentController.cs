using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Services;

namespace QMS_Certificate_Store_Portal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/master/[controller]")]
    public class DepartmentController : ControllerBase
    {
        private readonly DepartmentService _service;
        public DepartmentController(DepartmentService service) => _service = service;

        //[HttpGet("get-all")]
        //public async Task<IActionResult> GetAll()
        //{
        //    var data = await _service.GetAllAsync();
        //    return Ok(new { success = true, data });
        //}

        // Controller

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            var isSuperAdmin = Convert.ToBoolean(
                User.FindFirst("IsSuperAdmin")?.Value ?? "false"
            );

            // =====================================
            // SUPER ADMIN
            // =====================================
            if (isSuperAdmin)
            {
                var allData = await _service.GetAllAsync();

                return Ok(new
                {
                    success = true,
                    data = allData
                });
            }

            // =====================================
            // NORMAL USER
            // =====================================
            var companyId = Convert.ToInt32(
                User.FindFirst("IDCompany")?.Value ?? "0"
            );

            var locationId = Convert.ToInt32(
                User.FindFirst("IDLocation")?.Value ?? "0"
            );

            var data = await _service.GetAllAsync(
                companyId,
                locationId
            );

            return Ok(new
            {
                success = true,
                data
            });
        }
        [HttpGet("get-by-id/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _service.GetByIdAsync(id);
            return Ok(new { success = true, data });
        }

        [HttpPost("save")]
        public async Task<IActionResult> Save(Department model)
        {
            model.UserAction = User.FindFirst("UserFullName")?.Value ?? "System";
            var result = await _service.SaveAsync(model);
            return Ok(result);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var currentUserName = User.FindFirst("UserFullName")?.Value ?? "System";
            var result = await _service.DeleteAsync(id, currentUserName);
            return Ok(result);
        }
    }
}
