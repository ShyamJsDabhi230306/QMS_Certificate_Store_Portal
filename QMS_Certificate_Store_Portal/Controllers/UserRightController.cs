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

        public UserRightController(UserRightService service)
        {
            _service = service;
        }

        #region GET RIGHTS BY DESIGNATION

        [HttpGet("get-by-designation/{idDesignation}")]

        public async Task<IActionResult>
            GetByDesignationId(int idDesignation)
        {
            var data =
                await _service.GetByDesignationIdAsync(
                    idDesignation
                );

            return Ok(new
            {
                success = true,
                data
            });
        }

        #endregion

        #region UPDATE SINGLE RIGHT

        [HttpPost("update")]

        public async Task<IActionResult>
            Update(MasterUserRight model)
        {
            var currentUserName =
                User.FindFirst("UserFullName")?.Value
                ?? "System";

            model.UserAction = currentUserName;

            var result =
                await _service.UpdateRightsAsync(model);

            return Ok(result);
        }

        #endregion

        #region BULK UPDATE

        [HttpPost("update-bulk")]

        public async Task<IActionResult>
            UpdateBulk(
                [FromBody]
                List<MasterUserRight> rights
            )
        {
            var currentUserName =
                User.FindFirst("UserFullName")?.Value
                ?? "System";

            var result =
                await _service.UpdateRightsBulkAsync(
                    rights,
                    currentUserName
                );

            return Ok(new
            {
                success = result.Result == 1,
                message = result.Message
            });
        }

        #endregion

        #region INITIALIZE DESIGNATION RIGHTS

        [HttpPost("initialize/{idDesignation}")]

        public async Task<IActionResult>
            Initialize(int idDesignation)
        {
            var actionUser =
                User.FindFirst("UserFullName")?.Value
                ?? "System";

            var result =
                await _service.InitializeForDesignationAsync(
                    idDesignation,
                    actionUser
                );

            return Ok(result);
        }

        #endregion


        [HttpGet("get-for-user/{idUser}")]
        public async Task<IActionResult> GetForUser(int idUser)
        {
            var data = await _service.GetForUserAsync(idUser);

            return Ok(new
            {
                success = true,
                data
            });
        }


        [HttpPost("save-for-user")]
        public async Task<IActionResult> SaveForUser(
                [FromBody] MasterUserRight model)
        {
            var actionUser =
                User.FindFirst("UserFullName")?.Value
                ?? "System";

            var result = await _service.SaveForUserAsync(
                model,
                actionUser);

            return Ok(new
            {
                success = result.Result == 1,
                message = result.Message
            });
        }






        [HttpPost("remove-user-override")]
        public async Task<IActionResult> RemoveUserOverride(
    [FromBody] MasterUserRight model)
        {
            if (model.IDUser <= 0)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Valid user is required."
                });
            }

            var actionUser =
                User.FindFirst("UserFullName")?.Value
                ?? "System";

            var result =
                await _service.RemoveUserOverrideAsync(
                    model.IDUser,
                    model.IDPage,
                    actionUser);

            return Ok(new
            {
                success = result.Result == 1,
                message = result.Message
            });
        }



       
    }


}