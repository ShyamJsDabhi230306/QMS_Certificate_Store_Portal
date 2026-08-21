using Dapper;
using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;
using QMS_Certificate_Store_Portal.Models.UserMgmtOtp;
using System.Data;

namespace QMS_Certificate_Store_Portal.Repositories
{
    public class UserRepo
    {
        private readonly IDapperHelper _dapper;
        private readonly ILogger<UserRepo>? _logger;

        public UserRepo(IDapperHelper dapper, ILogger<UserRepo>? logger = null)
        {
            _dapper = dapper;
            _logger = logger;
        }

        public async Task<IEnumerable<Users>> GetAllAsync()
        {
            try
            {
                return await _dapper.QueryAsync<Users>("usp_Master_User_SelectAll", null);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error in UserRepo.GetAllAsync");
                return Enumerable.Empty<Users>();
            }
        }

        public async Task<Users?> GetByIdAsync(int idUser)
        {
            try
            {
                var param = new DynamicParameters();
                param.Add("@IDUser", idUser);
                return await _dapper.QueryFirstOrDefaultAsync<Users>("usp_Master_User_SelectById", param);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error in UserRepo.GetByIdAsync");
                return null;
            }
        }

        //public async Task<SaveResult> SaveAsync(Users model)
        //{
        //    try
        //    {
        //        var param = new DynamicParameters();
        //        param.Add("@IDUser", model.IDUser);
        //        param.Add("@UserFullName", model.UserFullName);
        //        param.Add("@Email", model.Email);
        //        param.Add("@IDDesignation", model.IDDesignation);
        //        // 👈 Replaced @IDDepartment with Company and Location
        //        param.Add("@IDCompany", model.IDCompany);
        //        param.Add("@IDLocation", model.IDLocation);
        //        param.Add("@userName", model.UserName);
        //        param.Add("@Password", model.Password);
        //        param.Add("@IsActive", model.IsActive);
        //        param.Add("@Phone", model.Phone);
        //        param.Add("@ActionUser", model.UserAction);

        //        var result = await _dapper.QueryFirstOrDefaultAsync<SaveResult>("usp_Master_User_Save", param)
        //    ?? SaveResult.Fail("Database error");

        //        if (result.Result > 0 && model.IDUser == 0)
        //        {
        //            var rightParam = new DynamicParameters();
        //            rightParam.Add("@IDUser", result.Result);
        //            rightParam.Add("@ActionUser", model.UserAction);

        //            await _dapper.ExecuteAsync("usp_Master_UserRight_InitializeForUser", rightParam);
        //        }

        //        return result;

        //    }
        //    catch (Exception ex)
        //    {
        //        return SaveResult.Fail(ex.Message);
        //    }
        //}

        public async Task<SaveResult> SaveAsync(Users model)
        {
            try
            {
                var param = new DynamicParameters();

                param.Add("@IDUser", model.IDUser);

                param.Add("@UserFullName", model.UserFullName);

                param.Add("@Email", model.Email);

                param.Add("@IDDesignation", model.IDDesignation);

                // Company & Location
                param.Add("@IDCompany", model.IDCompany);

                param.Add("@IDLocation", model.IDLocation);

                param.Add("@userName", model.UserName);

                param.Add("@Password", model.Password);

                param.Add("@IsActive", model.IsActive);

                param.Add("@Phone", model.Phone);

                param.Add("@ActionUser", model.UserAction);

                var result =
                    await _dapper.QueryFirstOrDefaultAsync<SaveResult>(
                        "usp_Master_User_Save",
                        param
                    )
                    ?? SaveResult.Fail("Database error");

                // ❌ REMOVE RIGHTS INITIALIZATION
                // Because now rights are DESIGNATION based
                // NOT USER based

                return result;
            }
            catch (Exception ex)
            {
                return SaveResult.Fail(ex.Message);
            }
        }
        public async Task<SaveResult> DeleteAsync(int idUser, string deletedBy)
        {
            try
            {
                var param = new DynamicParameters();
                param.Add("@IDUser", idUser);
                param.Add("@D_By", deletedBy);
                return await _dapper.QueryFirstOrDefaultAsync<SaveResult>("usp_Master_User_Delete", param)
                       ?? SaveResult.Fail("Database error");
            }
            catch (Exception ex)
            {
                return SaveResult.Fail(ex.Message);
            }
        }

        public async Task<Users?> LoginAsync(string userName, string password)
        {
            try
            {
                var param = new DynamicParameters();
                param.Add("@userName", userName);
                param.Add("@Password", password);

                // This calls the usp_Master_User_Login SP
                return await _dapper.QueryFirstOrDefaultAsync<Users>("usp_Master_User_Login", param);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error in UserRepo.LoginAsync");
                return null;
            }
        }

        public async Task<int> ExecuteUpdateAsync(string query, DynamicParameters parameters)
        {
            try
            {
                _logger?.LogInformation("[UserRepo.ExecuteUpdateAsync] Executing update query. Query={Query}", query);
                
                var result = await _dapper.ExecuteAsync(query, parameters);
                
                _logger?.LogInformation("[UserRepo.ExecuteUpdateAsync] Query executed. RowsAffected={RowsAffected}", result);
                
                return result;
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "[UserRepo.ExecuteUpdateAsync] Error executing update query");
                return 0;
            }
        }
        public async Task<Users?> GetByAiraIdAsync(int airaUserId)
        {
            try
            {
                _logger?.LogInformation("[UserRepo.GetByAiraIdAsync] Searching for user with IDUserManagement={AiraUserId}", airaUserId);

                var param = new DynamicParameters();
                param.Add("@IDUserManagement", airaUserId);

                var result = await _dapper.QueryFirstOrDefaultAsync<Users>(
                    "SELECT * FROM Users WHERE IDUserManagement = @IDUserManagement",
                    param,
                    commandType: System.Data.CommandType.Text
                );

                if (result != null)
                {
                    _logger?.LogInformation(
                        "[UserRepo.GetByAiraIdAsync] FOUND user - IDUser={IDUser}, IDUserManagement={IDUserManagement}, IDDesignation={IDDesignation}, UserName={UserName}",
                        result.IDUser,
                        result.IDUserManagement,
                        result.IDDesignation ?? 0,
                        result.UserName
                    );
                }
                else
                {
                    _logger?.LogWarning("[UserRepo.GetByAiraIdAsync] NO user found for IDUserManagement={AiraUserId}", airaUserId);
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "[UserRepo.GetByAiraIdAsync] Error querying user");
                return null;
            }
        }
        public async Task<Users?> ProvisionFromAiraAsync(
      AiraSyncUser syncUser,
      Guid? securityStamp,
      string? email,
      int? idCompany = null,
      string provisionSource = "LOGIN")
        {
            try
            {
                var parameters = new DynamicParameters();

                parameters.Add(
                    "@IDUserManagement",
                    syncUser.IdUser
                );

                parameters.Add(
                    "@AiraEmployeeCode",
                    syncUser.EmployeeCode.ToString()
                );

                parameters.Add(
                    "@AiraName",
                    syncUser.Name ?? string.Empty
                );

                parameters.Add(
                    "@AiraIsActive",
                    syncUser.IsActive
                );

                parameters.Add(
                    "@AiraContactNo",
                    syncUser.ContactNo
                );

                parameters.Add(
                    "@AiraImageFileURL",
                    syncUser.ImageFileURL
                );

                parameters.Add(
                    "@AiraRoleId",
                    syncUser.IdRole
                );

                parameters.Add(
                    "@AiraRoleName",
                    syncUser.UmRoleName
                );

                parameters.Add(
                    "@AiraSecurityStamp",
                    securityStamp
                );

                parameters.Add(
                    "@Email",
                    email
                );

                parameters.Add(
                    "@IDCompany",
                    idCompany
                );

                parameters.Add(
                    "@ProvisionSource",
                    provisionSource
                );

                return await _dapper.QueryFirstOrDefaultAsync<Users>(
                    "usp_User_Aira_Provision",
                    parameters
                );
            }
            catch (Exception ex)
            {
                _logger?.LogError(
                    ex,
                    "Error provisioning Aira user {AiraUserId}",
                    syncUser.IdUser
                );

                return null;
            }
        }



        public async Task<IEnumerable<Users>>
   GetForRightsAsync(string? search)
        {
            var param = new DynamicParameters();
            param.Add("@Search", search);

            return await _dapper.QueryAsync<Users>(
                "usp_Master_User_SelectForRights",
                param);
        }


        public async Task<SaveResult> AssignLocalFieldsAsync(
     int idUserManagement,
     int idDesignation,
     string actionUser)
        {
            try
            {
                var parameters = new DynamicParameters();

                parameters.Add(
                    "@IDUserManagement",
                    idUserManagement
                );

                parameters.Add(
                    "@IDDesignation",
                    idDesignation
                );

                parameters.Add(
                    "@ActionUser",
                    actionUser
                );

                return await _dapper.QueryFirstOrDefaultAsync<SaveResult>(
                    "usp_User_Aira_AssignLocalFields",
                    parameters
                ) ?? SaveResult.Fail(
                    "Database did not return a result."
                );
            }
            catch (Exception ex)
            {
                _logger?.LogError(
                    ex,
                    "Error assigning designation to Aira user {IDUserManagement}",
                    idUserManagement
                );

                return SaveResult.Fail(ex.Message);
            }
        }

    }
}
