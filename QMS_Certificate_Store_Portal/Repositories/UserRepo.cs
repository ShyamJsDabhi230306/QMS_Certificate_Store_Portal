using QMS_Certificate_Store_Portal.Helpers;
using Dapper;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;
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

        public async Task<SaveResult> SaveAsync(Users model)
        {
            try
            {
                var param = new DynamicParameters();
                param.Add("@IDUser", model.IDUser);
                param.Add("@UserFullName", model.UserFullName);
                param.Add("@Email", model.Email);
                param.Add("@IDDesignation", model.IDDesignation);
                param.Add("@IDDepartment", model.IDDepartment);
                param.Add("@userName", model.userName);
                param.Add("@Password", model.Password);
                param.Add("@IsActive", model.IsActive);
                param.Add("@Phone", model.Phone);
                param.Add("@ActionUser", model.E_By); // Maps to @ActionUser in SP

                return await _dapper.QueryFirstOrDefaultAsync<SaveResult>("usp_Master_User_Save", param)
                       ?? SaveResult.Fail("Database error");
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

    }
}
