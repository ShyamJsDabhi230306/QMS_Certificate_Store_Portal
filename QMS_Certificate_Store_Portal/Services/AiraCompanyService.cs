using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Repositories;
using QMS_Certificate_Store_Portal.Repositories.UserMgmt;

namespace QMS_Certificate_Store_Portal.Services;

public sealed class AiraCompanyService
{
    private readonly IAiraUserManagementClient _airaClient;
    private readonly AiraCompanyRepo _airaCompanyRepo;
    private readonly ILogger<AiraCompanyService> _logger;
    private readonly CompanyService _companyService;
    //public AiraCompanyService(
    //    IAiraUserManagementClient airaClient,
    //    AiraCompanyRepo airaCompanyRepo,
    //    ILogger<AiraCompanyService> logger)
    //{
    //    _airaClient = airaClient;
    //    _airaCompanyRepo = airaCompanyRepo;
    //    _logger = logger;
    //}

    public AiraCompanyService(
    IAiraUserManagementClient airaClient,
    AiraCompanyRepo airaCompanyRepo,
    CompanyService companyService,
    ILogger<AiraCompanyService> logger)
    {
        _airaClient = airaClient;
        _airaCompanyRepo = airaCompanyRepo;
        _companyService = companyService;
        _logger = logger;
    }

    public async Task<List<AiraSyncCompany>> SyncAllAsync(
        CancellationToken cancellationToken = default)
    {
        var response =
            await _airaClient.GetAllCompaniesAsync(
                cancellationToken
            );

        if (!response.Success || response.Data == null)
        {
            throw new InvalidOperationException(
                response.Message ??
                "Unable to load companies from Aira."
            );
        }

        var savedCompanies = new List<AiraSyncCompany>();

        foreach (var company in response.Data)
        {
            if (company.IDCompany <= 0 ||
                string.IsNullOrWhiteSpace(company.CompanyName))
            {
                _logger.LogWarning(
                    "Skipped invalid Aira company record."
                );

                continue;
            }

            var savedCompany =
                await _airaCompanyRepo.UpsertAsync(
                    company
                );

            if (savedCompany != null)
            {
                savedCompanies.Add(savedCompany);
            }
        }

        return savedCompanies;
    }

    public async Task<IEnumerable<AiraSyncCompany>>
    GetAllAsync()
    {
        return await _airaCompanyRepo.GetAllAsync();
    }


    // This method retrieves a single company by its ID. It throws an exception if the ID is invalid or if the company is not found or inactive.
    public async Task<AiraSyncCompany>
    SelectOneAsync(int idCompany)
    {
        if (idCompany <= 0)
        {
            throw new ArgumentException(
                "A valid company ID is required."
            );
        }

        var selectedCompany =
            await _airaCompanyRepo.SelectOneAsync(
                idCompany
            );

        if (selectedCompany == null)
        {
            throw new InvalidOperationException(
                "Company was not found or is inactive."
            );
        }

        return selectedCompany;
    }

    public async Task<List<AiraSyncCompany>> GetLiveCompaniesAsync(
    CancellationToken cancellationToken = default)
    {
        var response = await _airaClient.GetAllCompaniesAsync(
            cancellationToken);

        if (!response.Success || response.Data == null)
        {
            throw new InvalidOperationException(
                response.Message ?? "Unable to load companies from Aira.");
        }

        return response.Data
            .Where(x =>
                x.IDCompany > 0 &&
                !string.IsNullOrWhiteSpace(x.CompanyName) &&
                x.IsActive)
            .ToList();
    }


    public async Task<Company> SyncSelectedCompanyAsync(
    int idCompany,
    string actionUser,
    CancellationToken cancellationToken = default)
{
    var airaCompanies = await GetLiveCompaniesAsync(cancellationToken);

    var selected = airaCompanies.FirstOrDefault(
        x => x.IDCompany == idCompany);

    if (selected == null)
    {
        throw new InvalidOperationException(
            "Selected company was not found in Aira.");
    }

    var existingCompanies =
        await _companyService.GetAllAsync();

    var existingCompany = existingCompanies.FirstOrDefault(
        x => string.Equals(
            x.CompanyName,
            selected.CompanyName,
            StringComparison.OrdinalIgnoreCase));

        var qmsCompany = new Company
        {
            IDCompany = existingCompany?.IDCompany ?? 0,

            // Existing QMS fields
            CompanyName = selected.CompanyName ?? string.Empty,
            Address = selected.OfficeAddress ?? selected.FactoryAddress,
            ContactNo = selected.ContactNo,
            Email = null,
            PanNo = selected.PAN,
            GSTNo = selected.GSTIN,
            CreatedOn = existingCompany?.CreatedOn ?? DateTime.Now,
            Remarks = "Synced from Aira",
            IsActive = selected.IsActive,
            UserAction = actionUser,

            // Aira fields
            AiraCompanyId = selected.IDCompany,
            CompanyCode = selected.CompanyCode,
            FactoryAddress = selected.FactoryAddress,
            City = selected.City,
            State = selected.State,
            Country = selected.Country,
            Pincode = selected.Pincode,
            LogoFileName = selected.LogoFileName,
            LogoBase64 = selected.LogoBase64,
            AiraLastSyncUtc = DateTime.UtcNow,
            IsAiraSynced = true
        };

        var result = await _companyService.SaveAsync(qmsCompany);

    if (result == null || result.Result <= 0)
    {
        throw new InvalidOperationException(
            result?.Message ?? "Unable to save company in QMS.");
    }

    return qmsCompany;
}
}