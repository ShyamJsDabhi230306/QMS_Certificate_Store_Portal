using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models.Configuration;
using QMS_Certificate_Store_Portal.Models.UserMgmtOtp;
using QMS_Certificate_Store_Portal.Repositories.UserMgmt;
using QMS_Certificate_Store_Portal.Services;
using QMS_Certificate_Store_Portal.Services.Aira;

namespace QMS_Certificate_Store_Portal.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly IAiraUserManagementClient _airaClient;
    private readonly UserManagementOptions _userManagementOptions;
    private readonly UserService _userService;
    private readonly JwtHelper _jwtHelper;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IAiraUserManagementClient airaClient,
        IOptions<UserManagementOptions> userManagementOptions,
        UserService userService,
        JwtHelper jwtHelper,
        ILogger<AuthController> logger)
    {
        _airaClient = airaClient;
        _userManagementOptions = userManagementOptions.Value;
        _userService = userService;
        _jwtHelper = jwtHelper;
        _logger = logger;
    }

    [HttpPost("otp/send")]
    public async Task<IActionResult> SendOtp(
        [FromBody] SendOtpRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.EmployeeCode))
        {
            return Ok(new
            {
                success = false,
                message = "Employee code is required."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            return Ok(new
            {
                success = false,
                message = "Password is required."
            });
        }

        var airaRequest = new AiraOtpSendRequest
        {
            Login = request.EmployeeCode.Trim(),
            Password = request.Password,
            ProjectUrl = _userManagementOptions.ProjectUrl
        };

        var airaResponse = await _airaClient.SendOtpAsync(
            airaRequest,
            cancellationToken);

        return Ok(new
        {
            success = airaResponse.Success,
            message = airaResponse.Message,
            data = airaResponse.Data
        });
    }

    //[HttpPost("otp/verify")]
    //public async Task<IActionResult> VerifyOtp(
    //[FromBody] VerifyOtpRequest request,
    //CancellationToken cancellationToken)
    //  {
    //    if (request.IdUser <= 0)
    //    {
    //        return Ok(new
    //        {
    //            success = false,
    //            message = "Invalid user reference."
    //        });
    //    }

    //    if (string.IsNullOrWhiteSpace(request.Otp))
    //    {
    //        return Ok(new
    //        {
    //            success = false,
    //            message = "OTP is required."
    //        });
    //    }

    //    if (string.IsNullOrWhiteSpace(request.EmployeeCode))
    //    {
    //        return Ok(new
    //        {
    //            success = false,
    //            message = "Employee code is required."
    //        });
    //    }

    //    // 1. Verify OTP with Aira
    //    var airaVerifyRequest = new AiraOtpVerifyRequest
    //    {
    //        IdUser = request.IdUser,
    //        Otp = request.Otp.Trim(),
    //        ProjectUrl = _userManagementOptions.ProjectUrl
    //    };

    //    var airaResponse = await _airaClient.VerifyOtpAsync(
    //        airaVerifyRequest,
    //        cancellationToken);

    //    if (!airaResponse.Success || airaResponse.Data == null)
    //    {
    //        return Ok(new
    //        {
    //            success = false,
    //            message = airaResponse.Message
    //                ?? "OTP verification failed."
    //        });
    //    }

    //    var airaLoginUser = airaResponse.Data;

    //    // 2. Get complete user data and Aira role
    //    var syncResponse =
    //        await _airaClient.GetUserByEmployeeCodeAsync(
    //            request.EmployeeCode.Trim(),
    //            cancellationToken);

    //    if (!syncResponse.Success)
    //    {
    //        return Ok(new
    //        {
    //            success = false,
    //            stage = "sync-users",
    //            message = syncResponse.Message
    //                ?? "Aira sync-users request failed.",
    //            data = syncResponse.Data
    //        });
    //    }

    //    if (syncResponse.Data == null ||
    //        syncResponse.Data.Count == 0)
    //    {
    //        return Ok(new
    //        {
    //            success = false,
    //            stage = "sync-users",
    //            message =
    //                "Aira sync-users returned no users for this employee code.",
    //            employeeCode = request.EmployeeCode,
    //            projectUrl = _userManagementOptions.ProjectUrl
    //        });
    //    }

    //    // 3. Match the sync user with the verified Aira user
    //    var airaSyncUser = syncResponse.Data
    //        .FirstOrDefault(x =>
    //            x.IdUser == airaLoginUser.IdUser);

    //    if (airaSyncUser == null)
    //    {
    //        return Ok(new
    //        {
    //            success = false,
    //            message = "Verified user was not found in Aira user data."
    //        });
    //    }

    //    if (!airaSyncUser.IsActive)
    //    {
    //        return Ok(new
    //        {
    //            success = false,
    //            message = "This Aira user is inactive."
    //        });
    //    }


    //    var existingUser = await _userService.GetByAiraIdAsync(airaSyncUser.IdUser);

    //    // NEW users allowed only if SuperAdmin
    //    if (existingUser == null && airaSyncUser.IdRole != 1)
    //    {
    //        return Ok(new
    //        {
    //            success = false,
    //            message = "You have not been assigned required permissions by the administrator. Please contact your admin."
    //        });
    //    }

    //    // EXISTING USER without designation - DENIED
    //    if (existingUser != null && (!existingUser.IDDesignation.HasValue || existingUser.IDDesignation <= 0))
    //    {
    //        return Ok(new
    //        {
    //            success = false,
    //            message = "You have not been assigned required permissions by the administrator. Please contact your admin."
    //        });
    //    }

    //    // Store the admin-assigned designation BEFORE sync
    //    var adminAssignedDesignationId = existingUser?.IDDesignation;

    //    // 4. Only sync if checks pass
    //    var localUser = await _userService.ProvisionFromAiraAsync(
    //        airaSyncUser,
    //        airaLoginUser.SecurityStamp,
    //        null);

    //    // IMPORTANT: Restore admin-assigned designation if it was cleared by ProvisionFromAiraAsync
    //    if (adminAssignedDesignationId.HasValue && adminAssignedDesignationId > 0)
    //    {
    //        localUser.IDDesignation = adminAssignedDesignationId;
    //    }

    //    if (localUser == null ||
    //        localUser.IDUser <= 0)
    //    {
    //        return Ok(new
    //        {
    //            success = false,
    //            message = "User could not be synchronized into QMS."
    //        });
    //    }

    //    // After line: var localUser = await _userService.ProvisionFromAiraAsync(...)

    //    // Changed from DesignationName to IDDesignation
    //    if ((!localUser.IDDesignation.HasValue || localUser.IDDesignation <= 0) && !localUser.IsSuperAdmin)
    //    {
    //        return Ok(new
    //        {
    //            success = false,
    //            message = "You have not been assigned required permissions by the administrator. Please contact your admin."
    //        });
    //    }
    //    // 5. Create QMS JWT.
    //    // A newly synchronized non-admin may not have a designation yet.
    //    // It must still be allowed to log in so the administrator can assign one.
    //    var role = localUser.DesignationName
    //        ?? airaSyncUser.UmRoleName
    //        ?? "User";

    //    var token = _jwtHelper.GenerateToken(
    //        userId: localUser.IDUser,
    //        userName: localUser.UserName
    //            ?? airaSyncUser.EmployeeCode.ToString(),
    //        fullName: localUser.UserFullName
    //            ?? airaSyncUser.Name
    //            ?? "QMS User",
    //        role: role,
    //        idCompany: localUser.IDCompany ?? 0,
    //        idLocation: localUser.IDLocation ?? 0,
    //        isSuperAdmin: localUser.IsSuperAdmin,
    //        airaUserId: airaSyncUser.IdUser,
    //        airaSecurityStamp: airaLoginUser.SecurityStamp);

    //    return Ok(new
    //    {
    //        success = true,
    //        message = "Login successful",
    //        token,
    //        user = new
    //        {
    //            localUser.IDUser,
    //            localUser.UserFullName,
    //            localUser.UserName,
    //            localUser.Email,
    //            localUser.IDCompany,
    //            localUser.CompanyName,
    //            localUser.IDLocation,
    //            localUser.LocationName,
    //            localUser.IDDesignation,
    //            localUser.DesignationName,
    //            localUser.IsSuperAdmin,

    //            localUser.IDUserManagement,
    //            localUser.AiraEmployeeCode,
    //            localUser.AiraName,
    //            localUser.AiraContactNo,
    //            localUser.AiraImageFileURL,
    //            localUser.AiraRoleId,
    //            localUser.AiraRoleName,
    //            localUser.AiraIsActive,
    //            localUser.IsSync
    //        }
    //    });
    //}

    [HttpPost("otp/verify")]
    public async Task<IActionResult> VerifyOtp(
    [FromBody] VerifyOtpRequest request,
    CancellationToken cancellationToken)
    {
        if (request.IdUser <= 0)
        {
            return Ok(new
            {
                success = false,
                message = "Invalid user reference."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Otp))
        {
            return Ok(new
            {
                success = false,
                message = "OTP is required."
            });
        }

        if (string.IsNullOrWhiteSpace(request.EmployeeCode))
        {
            return Ok(new
            {
                success = false,
                message = "Employee code is required."
            });
        }

        // 1. Verify OTP with Aira
        var airaVerifyRequest = new AiraOtpVerifyRequest
        {
            IdUser = request.IdUser,
            Otp = request.Otp.Trim(),
            ProjectUrl = _userManagementOptions.ProjectUrl
        };

        var airaResponse = await _airaClient.VerifyOtpAsync(
            airaVerifyRequest,
            cancellationToken);

        if (!airaResponse.Success || airaResponse.Data == null)
        {
            return Ok(new
            {
                success = false,
                message = airaResponse.Message ?? "OTP verification failed."
            });
        }

        var airaLoginUser = airaResponse.Data;

        // 2. Get complete user data and Aira role
        var syncResponse = await _airaClient.GetUserByEmployeeCodeAsync(
            request.EmployeeCode.Trim(),
            cancellationToken);

        if (!syncResponse.Success)
        {
            return Ok(new
            {
                success = false,
                stage = "sync-users",
                message = syncResponse.Message ?? "Aira sync-users request failed.",
                data = syncResponse.Data
            });
        }

        if (syncResponse.Data == null || syncResponse.Data.Count == 0)
        {
            return Ok(new
            {
                success = false,
                stage = "sync-users",
                message = "Aira sync-users returned no users for this employee code.",
                employeeCode = request.EmployeeCode,
                projectUrl = _userManagementOptions.ProjectUrl
            });
        }

        // 3. Match the sync user with the verified Aira user
        var airaSyncUser = syncResponse.Data
            .FirstOrDefault(x => x.IdUser == airaLoginUser.IdUser);

        if (airaSyncUser == null)
        {
            return Ok(new
            {
                success = false,
                message = "Verified user was not found in Aira user data."
            });
        }

        if (!airaSyncUser.IsActive)
        {
            return Ok(new
            {
                success = false,
                message = "This Aira user is inactive."
            });
        }

        // 3.5 Check if user exists and has designation
        var existingUser = await _userService.GetByAiraIdAsync(airaSyncUser.IdUser);
        
        _logger.LogInformation(
            "[VerifyOtp] After GetByAiraIdAsync - AiraUserId={AiraUserId}, Found={UserFound}, IDUser={IDUser}, IDDesignation={IDDesignation}",
            airaSyncUser.IdUser,
            existingUser != null,
            existingUser?.IDUser ?? 0,
            existingUser?.IDDesignation ?? 0
        );

        // NEW users allowed only if SuperAdmin (IdRole = 1)
        if (existingUser == null && airaSyncUser.IdRole != 1)
        {
            return Ok(new
            {
                success = false,
                message = "You have not been assigned required permissions by the administrator. Please contact your admin."
            });
        }
        // Aira role is used only to determine whether the person
        // can become the FIRST QMS Super Admin.
        bool isAiraMasterAdmin =
            airaSyncUser.IdRole == 1 ||
            string.Equals(
                airaSyncUser.UmRoleName,
                "MASTER_ADMIN",
                StringComparison.OrdinalIgnoreCase
            );

        // Unknown normal users cannot create themselves through login.
        if (existingUser == null && !isAiraMasterAdmin)
        {
            return Ok(new
            {
                success = false,
                message =
                    "You have not been imported into QMS. Please contact your administrator."
            });
        }

        // For an existing user, use LOCAL QMS permissions.
        // Aira MASTER_ADMIN must not bypass local synchronization.
        if (existingUser != null &&
            !existingUser.IsSuperAdmin &&
            (
                !existingUser.IsSync ||
                !existingUser.IDDesignation.HasValue ||
                existingUser.IDDesignation.Value <= 0
            ))
        {
            _logger.LogWarning(
                "[VerifyOtp] Access denied. IDUser={IDUser}, IsSync={IsSync}, IDDesignation={IDDesignation}",
                existingUser.IDUser,
                existingUser.IsSync,
                existingUser.IDDesignation
            );

            return Ok(new
            {
                success = false,
                message =
                    "Your QMS access has not been activated. Please contact your administrator."
            });
        }

        // Preserve the designation assigned by the QMS administrator.
        var adminAssignedDesignationId = existingUser?.IDDesignation;

     

        // 4. Sync user from Aira
        var localUser = await _userService.ProvisionFromAiraAsync(
            airaSyncUser,
            airaLoginUser.SecurityStamp,
            null);

        if (localUser == null || localUser.IDUser <= 0)
        {
            return Ok(new
            {
                success = false,
                message =
                    "You have not been imported into QMS. Please contact your administrator."
            });
        }
        // CRITICAL: Restore and PERSIST admin-assigned designation
        if (adminAssignedDesignationId.HasValue && adminAssignedDesignationId > 0)
        {
            _logger.LogInformation(
                "[VerifyOtp] Restoring admin designation - IDUser={IDUser}, AdminAssignedDesignation={AdminDesignation}",
                localUser.IDUser,
                adminAssignedDesignationId.Value
            );
            
            // Update database to restore the designation
            var updateResult = await _userService.UpdateUserDesignationAsync(
                localUser.IDUser,
                adminAssignedDesignationId.Value
            );
            
            _logger.LogInformation(
                "[VerifyOtp] UpdateUserDesignationAsync result - IDUser={IDUser}, Success={Success}",
                localUser.IDUser,
                updateResult
            );

            // Update the in-memory object
            localUser.IDDesignation = adminAssignedDesignationId;
        }
        else
        {
            _logger.LogInformation(
                "[VerifyOtp] No admin designation to restore - adminAssignedDesignationId={AdminDesignation}",
                adminAssignedDesignationId?.ToString() ?? "null"
            );
        }



        // Final authorization check before creating the JWT.
        if (!localUser.IsSuperAdmin &&
            (
                !localUser.IsSync ||
                !localUser.IDDesignation.HasValue ||
                localUser.IDDesignation.Value <= 0
            ))
        {
            return Ok(new
            {
                success = false,
                message =
                    "Your QMS access has not been activated. Please contact your administrator."
            });
        }
        // 5. Create QMS JWT
        var role = localUser.DesignationName
            ?? airaSyncUser.UmRoleName
            ?? "User";

        var token = _jwtHelper.GenerateToken(
            userId: localUser.IDUser,
            userName: localUser.UserName ?? airaSyncUser.EmployeeCode.ToString(),
            fullName: localUser.UserFullName ?? airaSyncUser.Name ?? "QMS User",
            role: role,
            idCompany: localUser.IDCompany ?? 0,
            idLocation: localUser.IDLocation ?? 0,
            isSuperAdmin: localUser.IsSuperAdmin,
            airaUserId: airaSyncUser.IdUser,
            airaSecurityStamp: airaLoginUser.SecurityStamp);

        _logger.LogInformation(
            "[VerifyOtp] Login successful for user {UserName} - IDUser={IDUser}, IDDesignation={IDDesignation}, DesignationName={DesignationName}",
            localUser.UserName,
            localUser.IDUser,
            localUser.IDDesignation ?? 0,
            localUser.DesignationName ?? "NULL"
        );
        
        return Ok(new
        {
            success = true,
            message = "Login successful",
            token,
            user = new
            {
                localUser.IDUser,
                localUser.UserFullName,
                localUser.UserName,
                localUser.Email,
                localUser.IDCompany,
                localUser.CompanyName,
                localUser.IDLocation,
                localUser.LocationName,
                localUser.IDDesignation,
                localUser.DesignationName,
                localUser.IsSuperAdmin,
                localUser.IDUserManagement,
                localUser.AiraEmployeeCode,
                localUser.AiraName,
                localUser.AiraContactNo,
                localUser.AiraImageFileURL,
                localUser.AiraRoleId,
                localUser.AiraRoleName,
                localUser.AiraIsActive,
                localUser.IsSync
            }
        });
    }
}
