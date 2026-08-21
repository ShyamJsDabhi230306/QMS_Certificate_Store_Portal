using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.UserMgmtOtp;
using QMS_Certificate_Store_Portal.Services;
using System.Data;
using System.Security.Claims;

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

        [HttpGet("get-for-rights")]
        public async Task<IActionResult> GetForRights(
   [FromQuery] string? search)
        {
            var data = await _service.GetForRightsAsync(search);

            return Ok(new
            {
                success = true,
                data
            });
        }


        [HttpGet("aira-employees")]
        public async Task<IActionResult> GetAiraEmployees(
     CancellationToken cancellationToken)
        {
            if (!IsQmsAdministrator())
            {
                return Forbid();
            }

            var result =
                await _service.GetAvailableAiraEmployeesAsync(
                    cancellationToken
                );

            return Ok(new
            {
                success = result.Success,
                message = result.Message,
                data = result.Data
            });
        }
        [HttpPost("import-bulk")]
        public async Task<IActionResult> ImportBulk(
    [FromBody] ImportAiraUsersRequest request,
    CancellationToken cancellationToken)
        {
            if (!IsQmsAdministrator())
            {
                return Forbid();
            }

            if (request.IDUserManagement == null ||
                request.IDUserManagement.Count == 0)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Select at least one Aira employee."
                });
            }

            var actionUser =
                User.FindFirst("UserFullName")?.Value
                ?? "System";

            var result =
                await _service.ImportUsersAsync(
                    request.IDUserManagement,
                    actionUser,
                    cancellationToken
                );

            return Ok(new
            {
                success = result.Result == 1,
                result = result.Result,
                message = result.Message
            });
        }
        [HttpPost("assign-designation")]
        public async Task<IActionResult> AssignDesignation(
    [FromBody] AssignDesignationRequest request)
        {
            if (!IsQmsAdministrator())
            {
                return Forbid();
            }

            if (request.IDUserManagement <= 0)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Aira user ID is required."
                });
            }

            if (request.IDDesignation <= 0)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Designation is required."
                });
            }

            var actionUser =
                User.FindFirst("UserFullName")?.Value
                ?? "System";

            var result =
                await _service.AssignDesignationAsync(
                    request,
                    actionUser
                );

            return Ok(new
            {
                success = result.Result == 1,
                result = result.Result,
                message = result.Message
            });
        }
        [HttpPost("save-from-aira")]
        public async Task<IActionResult> SaveFromAira(
            [FromBody] SaveAiraUserRequest request,
            CancellationToken cancellationToken)
        {
            if (!IsQmsAdministrator())
            {
                return Forbid();
            }

            if (request.IDUserManagement <= 0)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Aira user ID is required."
                });
            }

            var actionUser =
                User.FindFirst("UserFullName")?.Value
                ?? "System";

            var result =
                await _service.SaveSelectedAiraEmployeeAsync(
                    request,
                    actionUser,
                    cancellationToken
                );

            return Ok(new
            {
                success = result.Result == 1,
                result = result.Result,
                message = result.Message
            });
        }


        private bool IsQmsAdministrator()
        {
            var isSuperAdmin =
                bool.TryParse(
                    User.FindFirst("IsSuperAdmin")?.Value,
                    out var parsedSuperAdmin
                ) && parsedSuperAdmin;

            var role =
                User.FindFirst(ClaimTypes.Role)?.Value
                ?? User.FindFirst("role")?.Value
                ?? User.FindFirst("Role")?.Value;

            var isAdmin =
                string.Equals(
                    role,
                    "Admin",
                    StringComparison.OrdinalIgnoreCase
                )
                ||
                string.Equals(
                    role,
                    "MASTER_ADMIN",
                    StringComparison.OrdinalIgnoreCase
                );

            return isSuperAdmin || isAdmin;
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
                user.DesignationName ?? "User",
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

