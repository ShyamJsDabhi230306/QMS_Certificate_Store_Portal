using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Services;

namespace QMS_Certificate_Store_Portal.Controllers;

[Authorize]
[ApiController]
[Route("api/master/aira-company")]
public sealed class AiraCompanyController : ControllerBase
{
    private readonly AiraCompanyService _service;

    public AiraCompanyController(
        AiraCompanyService service)
    {
        _service = service;
    }

    [HttpGet("get-all")]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var companies = await _service.GetAllAsync();

            return Ok(new
            {
                success = true,
                message = "Aira companies loaded successfully.",
                data = companies
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = ex.Message,
                detail = ex.InnerException?.Message
            });
        }
    }

    [HttpPost("sync")]
    public async Task<IActionResult> SyncCompanies(
        CancellationToken cancellationToken)
    {
        try
        {
            var companies =
                await _service.SyncAllAsync(
                    cancellationToken
                );

            return Ok(new
            {
                success = true,
                message = "Companies synchronized successfully.",
                count = companies.Count,
                data = companies
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                success = false,
                message = ex.Message,
                data = Array.Empty<object>()
            });
        }
    }

    // This endpoint is used to select a company by its ID. It returns the selected company details if found.
    [HttpGet("aira-list")]
    public async Task<IActionResult> GetAiraCompanies(
        CancellationToken cancellationToken)
    {
        try
        {
            var companies =
                await _service.GetLiveCompaniesAsync(
                    cancellationToken);

            return Ok(new
            {
                success = true,
                message = "Companies loaded from Aira successfully.",
                data = companies
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = ex.Message,
                data = Array.Empty<object>()
            });
        }
    }

    [HttpPost("sync-selected")]
    public async Task<IActionResult> SyncSelectedCompany(
    [FromBody] SyncAiraCompanyRequest request,
    CancellationToken cancellationToken)
    {
        try
        {
            var actionUser =
                User.FindFirst("UserFullName")?.Value
                ?? "SYSTEM";

            var company =
                await _service.SyncSelectedCompanyAsync(
                    request.IDCompany,
                    actionUser,
                    cancellationToken);

            return Ok(new
            {
                success = true,
                message = "Selected company saved in QMS successfully.",
                data = company
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                success = false,
                message = ex.Message,
                data = (object?)null
            });
        }
    }
}