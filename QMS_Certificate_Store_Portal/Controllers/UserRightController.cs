using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Services;

namespace QMS_Certificate_Store_Portal.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/master/[controller]")]
    public class UserRightController : ControllerBase
    {
        private readonly UserRightService _service;
        public UserRightController(UserRightService service) => _service = service;

        [HttpGet("get-by-user/{idUser}")]
        public async Task<IActionResult> GetByUserId(int idUser)
        {
            var data = await _service.GetByUserIdAsync(idUser);
            return Ok(new { success = true, data });
        }

       [HttpPost("update-bulk")]
        public async Task<IActionResult> UpdateBulk(List<MasterUserRight> rights)
        {
        var currentUserName = User.FindFirst("UserFullName")?.Value ?? "System";
        foreach (var right in rights)
        {
            right.UserAction = currentUserName;
            await _service.UpdateRightsAsync(right); // This calls your existing SP for each row
        }
        return Ok(new { success = true, message = "All rights updated successfully" });
        }


        [HttpPost("initialize/{idUser}")]
        public async Task<IActionResult> Initialize(int idUser)
        {
            var actionUser = User.FindFirst("UserFullName")?.Value ?? "System";
            var result = await _service.InitializeForUserAsync(idUser, actionUser);
            return Ok(result);
        }
    }
}
