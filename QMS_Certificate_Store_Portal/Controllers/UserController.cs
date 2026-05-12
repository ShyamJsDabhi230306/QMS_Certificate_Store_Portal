using QMS_Certificate_Store_Portal.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Services;
using System.Data;
using Microsoft.AspNetCore.Authorization;

namespace QMS_Certificate_Store_Portal.Controllers
{
    [Authorize]
    [Route("api/master/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _service; 
        private readonly JwtHelper _jwtHelper;
        public UserController(UserService service, JwtHelper jwtHelper)
        {
            _service = service;
            _jwtHelper = jwtHelper;
        }
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetAllAsync();
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
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _service.LoginAsync(request.userName, request.Password);
            if (user == null || user.IDUser <= 0)
            {
                return Unauthorized(new { success = false, message = "Invalid username or password" });
            }
            // Generate JWT Token (Mapping fields from the user record)
            var token = _jwtHelper.GenerateToken(
                user.IDUser,
                user.userName ?? "",
                user.UserFullName ?? "",
                "User", //Default Role
        
                0, 0, //Placeholders for Company / Location if needed later
        user.IDDepartment ?? 0
    );
            return Ok(new
            {
                success = true,
                message = "Login successful",
                token,
                user = new
                {
                    user.IDUser,
                    user.UserFullName,
                    user.userName,
                    user.Email,
                    user.DepartmentName,
                    user.DesignationName
                }
            });
        }
    }
}
