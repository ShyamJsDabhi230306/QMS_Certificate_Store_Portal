//using QMS_Certificate_Store_Portal.Models;
//using QMS_Certificate_Store_Portal.Models.Common;
//using QMS_Certificate_Store_Portal.Models.UserMgmtOtp;
//using QMS_Certificate_Store_Portal.Repositories;
//using QMS_Certificate_Store_Portal.Repositories.UserMgmt;

//namespace QMS_Certificate_Store_Portal.Services
//{
//    public class UserService
//    {
//        private readonly UserRepo _repo;
//        private readonly IAiraUserManagementClient _airaClient;

//        public UserService(
//     UserRepo repo,
//     IAiraUserManagementClient airaClient)
//        {
//            _repo = repo;
//            _airaClient = airaClient;
//        }
//        public async Task<IEnumerable<Users>> GetAllAsync()
//            => await _repo.GetAllAsync();

//        public async Task<Users?> GetByIdAsync(int id)
//            => await _repo.GetByIdAsync(id);

//        public async Task<SaveResult> SaveAsync(Users model)
//            => await _repo.SaveAsync(model);

//        public async Task<SaveResult> DeleteAsync(int id, string deletedBy)
//            => await _repo.DeleteAsync(id, deletedBy);

//        public async Task<Users?> LoginAsync(string userName, string password)
//    => await _repo.LoginAsync(userName, password);

//        public async Task<Users?> ProvisionFromAiraAsync(
//     AiraSyncUser syncUser,
//     Guid? securityStamp,
//     string? email)
//        {
//            return await _repo.ProvisionFromAiraAsync(
//                syncUser,
//                securityStamp,
//                email);
//        }



//        public async Task<IEnumerable<Users>>
//    GetForRightsAsync(string? search)
//        {
//            return await _repo.GetForRightsAsync(search);
//        }



//        public async Task<
//    AiraApiResponse<List<AiraSyncUser>>
//>
//GetAvailableAiraEmployeesAsync(
//    CancellationToken cancellationToken = default)
//        {
//            var airaResponse =
//                await _airaClient.GetAllUsersAsync(
//                    cancellationToken
//                );

//            if (!airaResponse.Success ||
//                airaResponse.Data == null)
//            {
//                return airaResponse;
//            }

//            var localUsers =
//                await _repo.GetAllAsync();

//            var existingAiraUserIds =
//                localUsers
//                    .Where(x => x.IDUserManagement.HasValue)
//                    .Select(x => x.IDUserManagement!.Value)
//                    .ToHashSet();

//            var availableEmployees =
//                airaResponse.Data
//                    .Where(x =>
//                        x.IdRole == 1 &&
//                        x.IsActive &&
//                        !existingAiraUserIds.Contains(x.IdUser))
//                    .ToList();

//            return new AiraApiResponse<List<AiraSyncUser>>
//            {
//                Success = true,
//                Message = "Available Aira employees loaded successfully.",
//                Data = availableEmployees
//            };
//        }



//        public async Task<SaveResult>
//    SaveSelectedAiraEmployeeAsync(
//        SaveAiraUserRequest request,
//        string actionUser,
//        CancellationToken cancellationToken = default)
//        {
//            var airaResponse =
//                await _airaClient.GetAllUsersAsync(
//                    cancellationToken);

//            if (!airaResponse.Success ||
//                airaResponse.Data == null)
//            {
//                return SaveResult.Fail(
//                    airaResponse.Message ??
//                    "Unable to load employees from Aira.");
//            }

//            var airaUser =
//                airaResponse.Data.FirstOrDefault(x =>
//                    x.IdUser == request.IDUserManagement);

//            if (airaUser == null)
//            {
//                return SaveResult.Fail(
//                    "Selected employee was not found in Aira.");
//            }

//            if (airaUser.IdRole != 1)
//            {
//                return SaveResult.Fail(
//                    "Only Aira MASTER_ADMIN employees can be added.");
//            }

//            if (!airaUser.IsActive)
//            {
//                return SaveResult.Fail(
//                    "Selected Aira employee is inactive.");
//            }

//            var existingUsers =
//                await _repo.GetAllAsync();

//            if (existingUsers.Any(x =>
//                x.IDUserManagement ==
//                request.IDUserManagement))
//            {
//                return SaveResult.Fail(
//                    "This employee already exists in QMS.");
//            }

//            var provisionedUser =
//                await _repo.ProvisionFromAiraAsync(
//                    airaUser,
//                    null,
//                    request.Email);

//            if (provisionedUser == null ||
//                provisionedUser.IDUser <= 0)
//            {
//                return SaveResult.Fail(
//                    "Failed to create local QMS user.");
//            }

//            return await _repo.AssignLocalFieldsAsync(
//                request.IDUserManagement,
//                request.IDDesignation,
//                request.IDCompany,
//                request.IDLocation,
//                request.Email,
//                actionUser);
//        }



//    }
//}


using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;
using QMS_Certificate_Store_Portal.Models.UserMgmtOtp;
using QMS_Certificate_Store_Portal.Repositories;
using QMS_Certificate_Store_Portal.Repositories.UserMgmt;

namespace QMS_Certificate_Store_Portal.Services;

public class UserService
{
    private readonly UserRepo _repo;
    private readonly CompanyRepo _companyRepo;
    private readonly IAiraUserManagementClient _airaClient;
    private readonly ILogger<UserRepo>? _logger;
    public UserService(
        UserRepo repo,
        CompanyRepo companyRepo,
        IAiraUserManagementClient airaClient,         ILogger<UserRepo>? logger)
    {
        _repo = repo;
        _companyRepo = companyRepo;
        _airaClient = airaClient;
        _logger = logger;
    }

    public async Task<IEnumerable<Users>> GetAllAsync()
        => await _repo.GetAllAsync();

    public async Task<Users?> GetByIdAsync(int id)
        => await _repo.GetByIdAsync(id);

    public async Task<SaveResult> SaveAsync(Users model)
        => await _repo.SaveAsync(model);

    public async Task<SaveResult> DeleteAsync(
        int id,
        string deletedBy)
        => await _repo.DeleteAsync(id, deletedBy);

    public async Task<Users?> LoginAsync(
        string userName,
        string password)
        => await _repo.LoginAsync(userName, password);

    public async Task<IEnumerable<Users>> GetForRightsAsync(
        string? search)
        => await _repo.GetForRightsAsync(search);

    private async Task<int?> GetSelectedCompanyIdAsync()
    {
        var companies = await _companyRepo.GetAllAsync();

        var selectedCompany = companies.FirstOrDefault(company =>
            company.IsAiraSynced == true &&
            company.IsActive == true
        );

        return selectedCompany?.IDCompany;
    }

    public async Task<
        AiraApiResponse<List<AiraSyncUser>>
    > GetAvailableAiraEmployeesAsync(
        CancellationToken cancellationToken = default)
    {
        var airaResponse =
            await _airaClient.GetAllUsersAsync(
                cancellationToken
            );

        if (!airaResponse.Success ||
            airaResponse.Data == null)
        {
            return airaResponse;
        }

        var localUsers = await _repo.GetAllAsync();

        var existingAiraUserIds = localUsers
            .Where(user => user.IDUserManagement.HasValue)
            .Select(user => user.IDUserManagement!.Value)
            .ToHashSet();

        var availableEmployees = airaResponse.Data
            .Where(user =>
                user.IsActive &&
                !existingAiraUserIds.Contains(user.IdUser))
            .ToList();

        return new AiraApiResponse<List<AiraSyncUser>>
        {
            Success = true,
            Message = "Available Aira employees loaded successfully.",
            Data = availableEmployees
        };
    }

    public async Task<SaveResult> SaveSelectedAiraEmployeeAsync(
        SaveAiraUserRequest request,
        string actionUser,
        CancellationToken cancellationToken = default)
    {
        var companyId = await GetSelectedCompanyIdAsync();

        if (!companyId.HasValue)
        {
            return SaveResult.Fail(
                "Please synchronize one QMS company before importing users."
            );
        }

        var airaResponse =
            await _airaClient.GetAllUsersAsync(
                cancellationToken
            );

        if (!airaResponse.Success ||
            airaResponse.Data == null)
        {
            return SaveResult.Fail(
                airaResponse.Message ??
                "Unable to load users from Aira."
            );
        }

        var airaUser = airaResponse.Data.FirstOrDefault(user =>
            user.IdUser == request.IDUserManagement
        );

        if (airaUser == null)
        {
            return SaveResult.Fail(
                "Selected employee was not found in Aira."
            );
        }

        if (!airaUser.IsActive)
        {
            return SaveResult.Fail(
                "Selected Aira employee is inactive."
            );
        }

        var localUsers = await _repo.GetAllAsync();

        if (localUsers.Any(user =>
            user.IDUserManagement == request.IDUserManagement))
        {
            return SaveResult.Fail(
                "This employee already exists in QMS."
            );
        }

        var importedUser =
            await _repo.ProvisionFromAiraAsync(
                airaUser,
                null,
                request.Email,
                companyId.Value,
                "IMPORT"
            );

        if (importedUser == null ||
            importedUser.IDUser <= 0)
        {
            return SaveResult.Fail(
                "User could not be imported into QMS."
            );
        }

        return SaveResult.Success(
            "User imported successfully. Assign a designation to activate access."
        );
    }

    public async Task<SaveResult> ImportUsersAsync(
        IEnumerable<int> airaUserIds,
        string actionUser,
        CancellationToken cancellationToken = default)
    {
        var ids = airaUserIds
            .Where(id => id > 0)
            .Distinct()
            .ToList();

        if (ids.Count == 0)
        {
            return SaveResult.Fail(
                "Select at least one Aira employee."
            );
        }

        var successCount = 0;
        var failedCount = 0;

        foreach (var idUserManagement in ids)
        {
            var result =
                await SaveSelectedAiraEmployeeAsync(
                    new SaveAiraUserRequest
                    {
                        IDUserManagement = idUserManagement
                    },
                    actionUser,
                    cancellationToken
                );

            if (result.Result == 1)
            {
                successCount++;
            }
            else
            {
                failedCount++;
            }
        }

        if (successCount == 0)
        {
            return SaveResult.Fail(
                "No users were imported."
            );
        }

        return SaveResult.Success(
            $"{successCount} user(s) imported successfully. " +
            $"{failedCount} user(s) were skipped."
        );
    }

    public async Task<Users?> ProvisionAfterAiraLoginAsync(
        string employeeCode,
        CancellationToken cancellationToken = default)
    {
        var companyId = await GetSelectedCompanyIdAsync();

        if (!companyId.HasValue)
        {
            return null;
        }

        var response =
            await _airaClient.GetUserByEmployeeCodeAsync(
                employeeCode,
                cancellationToken
            );

        if (!response.Success ||
            response.Data == null ||
            response.Data.Count == 0)
        {
            return null;
        }

        var airaUser = response.Data.FirstOrDefault();

        if (airaUser == null ||
            !airaUser.IsActive)
        {
            return null;
        }

        return await _repo.ProvisionFromAiraAsync(
            airaUser,
            null,
            null,
            companyId.Value,
            "LOGIN"
        );
    }


    
    public async Task<Users?> GetByAiraIdAsync(int airaUserId)
    {
        try
        {
            return await _repo.GetByAiraIdAsync(airaUserId);
        }
        catch (Exception ex)
        {
            _logger?.LogError(ex, "Error in UserService.GetByAiraIdAsync");
            return null;
        }
    }

    public async Task<bool> UpdateUserDesignationAsync(
     int idUser,
     int idDesignation)
    {
        try
        {
            _logger?.LogInformation(
                "[UserService.UpdateUserDesignationAsync] START - IDUser={IDUser}, NewIDDesignation={NewIDDesignation}",
                idUser,
                idDesignation
            );

            var query = @"
            UPDATE Users 
            SET IDDesignation = @IDDesignation
            WHERE IDUser = @IDUser";

            var parameters = new Dapper.DynamicParameters();
            parameters.Add("@IDUser", idUser);
            parameters.Add("@IDDesignation", idDesignation);

            var result = await _repo.ExecuteUpdateAsync(query, parameters);
            
            _logger?.LogInformation(
                "[UserService.UpdateUserDesignationAsync] RESULT - IDUser={IDUser}, RowsAffected={RowsAffected}, Success={Success}",
                idUser,
                result,
                result > 0
            );
            
            return result > 0;
        }
        catch (Exception ex)
        {
            _logger?.LogError(ex, "[UserService.UpdateUserDesignationAsync] ERROR for user {IDUser}", idUser);
            return false;
        }
    }

    public async Task<Users?> ProvisionFromAiraAsync(
    AiraSyncUser syncUser,
    Guid? securityStamp,
    string? email)
    {
        var companyId = await GetSelectedCompanyIdAsync();


        return await _repo.ProvisionFromAiraAsync(
            syncUser,
            securityStamp,
            email,
            companyId,
            "LOGIN"
        );
    }
    public async Task<SaveResult> AssignDesignationAsync(
        AssignDesignationRequest request,
        string actionUser)
    {
        if (request.IDUserManagement <= 0)
        {
            return SaveResult.Fail(
                "Aira user ID is required."
            );
        }

        if (request.IDDesignation <= 0)
        {
            return SaveResult.Fail(
                "Designation is required."
            );
        }

        var result =
            await _repo.AssignLocalFieldsAsync(
                request.IDUserManagement,
                request.IDDesignation,
                actionUser
            );

        return result;
    }
}