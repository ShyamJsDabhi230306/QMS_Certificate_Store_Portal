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
        // c:\Users\Admin\source\repos\QMS_Certificate_Store_Portal\QMS_Certificate_Store_Portal\Controllers\UserController.cs

        [HttpPost("save")]
        public async Task<IActionResult> Save([FromBody] Users model)
        {
            model.UserAction = User.FindFirst("UserFullName")?.Value ?? "System";
            var result = await _service.SaveAsync(model);

            if (result.Result != 1) return BadRequest(new { success = false, message = result.Message });

            // 🟢 Fix: Add 'result' property to match frontend expectation
            return Ok(new
            {
                success = true,
                result = result.Result, // Add this!
                message = result.Message,
                id = result.NewId
            });
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
         {
            var currentUserName = User.FindFirst("UserFullName")?.Value ?? "System";
            var result = await _service.DeleteAsync(id, currentUserName);
           return Ok(result);
         }
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _service.LoginAsync(
                request.userName,
                request.Password
            );
            if (user == null || user.IDUser <= 0)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid username or password"
                });
            }
            var token = _jwtHelper.GenerateToken(
                user.IDUser,
                user.UserName ?? "",
                user.UserFullName ?? "",
                "User",
                user.IDCompany ?? 0,
                user.IDLocation ?? 0,
                user.IsSuperAdmin
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
                    user.UserName,
                    user.Email,
                    user.IDCompany,
                    user.CompanyName,
                    user.IDLocation,
                    user.LocationName,
                    user.IDDesignation,
                    user.DesignationName,
                    // 👇 THIS IS THE CRUCIAL LINE WE ADDED 👇
                    user.IsSuperAdmin
                }
            });
        }
    }
}

