using Dapper;
using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;

namespace QMS_Certificate_Store_Portal.Repositories
{
    public class UserRightRepo
    {
        private readonly IDapperHelper _dapper;
        public UserRightRepo(IDapperHelper dapper) => _dapper = dapper;

        public async Task<IEnumerable<MasterUserRight>> GetByUserIdAsync(int idUser)
        {
            try
            {
                var param = new DynamicParameters();
                param.Add("@IDUser", idUser);
                return await _dapper.QueryAsync<MasterUserRight>("usp_Master_UserRight_SelectByUserId", param);
            }
            catch (Exception)
            {
                return Enumerable.Empty<MasterUserRight>();
            }
        }

        public async Task<SaveResult> UpdateRightsAsync(MasterUserRight model)
        {
            try
            {
                var param = new DynamicParameters();
                param.Add("@IDUser", model.IDUser);
                param.Add("@IDPage", model.IDPage);
                param.Add("@CanView", model.CanView);
                param.Add("@CanCreate", model.CanCreate);
                param.Add("@CanEdit", model.CanEdit);
                param.Add("@CanDelete", model.CanDelete);
                param.Add("@ActionUser", model.UserAction);
                param.Add("@Remarks", model.Remarks);

                return await _dapper.QueryFirstOrDefaultAsync<SaveResult>("usp_Master_UserRight_Update", param)
                       ?? new SaveResult { Result = -1, Message = "Database error" };


            }
            catch (Exception ex)
            {
                return new SaveResult { Result = -1, Message = ex.Message };
            }
        }

        public async Task<SaveResult> InitializeForUserAsync(int idUser, string actionUser)
        {
            try
            {
                var param = new DynamicParameters();
                param.Add("@IDUser", idUser);
                param.Add("@ActionUser", actionUser);
                return await _dapper.QueryFirstOrDefaultAsync<SaveResult>("usp_Master_UserRight_InitializeForUser", param)
                       ?? new SaveResult { Result = -1, Message = "Database error" };
            }
            catch (Exception ex)
            {
                return new SaveResult { Result = -1, Message = ex.Message };
            }
        }
    }
}
