using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Services;

namespace QMS_Certificate_Store_Portal.Controllers
{
    [Route("api/master/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _service;
        public UserController(UserService service)
        {
            _service = service;
        }
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll(int idDept = 0, int idDesig = 0)
        {
            var data = await _service.GetAllAsync(idDept, idDesig);
            return Ok(new { success = true, message = "Data loaded", data });
        }
        [HttpGet("get-by-id/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _service.GetByIdAsync(id);
            if (data == null) return NotFound(new { success = false, message = "User not found" });
            return Ok(new { success = true, data });
        }
        [HttpPost("save")]
        public async Task<IActionResult> Save([FromBody] Users model)
        {
            // Set current user if not provided (you can get this from JWT later)
            if (string.IsNullOrEmpty(model.E_By)) model.E_By = "System";

            var result = await _service.SaveAsync(model);
            if (result.Result != 1) return BadRequest(new { success = false, message = result.Message });

            return Ok(new { success = true, message = result.Message, id = result.NewId });
        }
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id, string deletedBy = "System")
        {
            var result = await _service.DeleteAsync(id, deletedBy);
            if (result.Result != 1) return BadRequest(new { success = false, message = result.Message });

            return Ok(new { success = true, message = result.Message });
        }
    }
}
