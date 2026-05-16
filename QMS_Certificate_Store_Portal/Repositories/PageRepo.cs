using Dapper;
using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;

namespace QMS_Certificate_Store_Portal.Repositories
{
    public class PageRepo
    {
        private readonly IDapperHelper _dapper;
        public PageRepo(IDapperHelper dapper) => _dapper = dapper;

        public async Task<IEnumerable<MasterPage>> GetAllAsync()
        {
            try
            {
                return await _dapper.QueryAsync<MasterPage>("usp_Master_Page_SelectAll");
            }
            catch (Exception)
            {
                return Enumerable.Empty<MasterPage>();
            }
        }

        public async Task<MasterPage?> GetByIdAsync(int id)
        {
            try
            {
                var param = new DynamicParameters();
                param.Add("@IDPage", id);
                return await _dapper.QueryFirstOrDefaultAsync<MasterPage>("usp_Master_Page_SelectById", param);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<SaveResult> SaveAsync(MasterPage model)
        {
            try
            {
                var param = new DynamicParameters();
                param.Add("@IDPage", model.IDPage);
                param.Add("@PageName", model.PageName);
                param.Add("@IsActive", model.IsActive);
                param.Add("@Remarks", model.Remarks);
                param.Add("@ActionUser", model.UserAction);
                param.Add("@CreatedOn", model.CreatedOn);

                return await _dapper.QueryFirstOrDefaultAsync<SaveResult>("usp_Master_Page_Save", param)
                       ?? new SaveResult { Result = -1, Message = "Database error" };
            }
            catch (Exception ex)
            {
                return new SaveResult { Result = -1, Message = ex.Message };
            }
        }

        public async Task<SaveResult> DeleteAsync(int id, string deletedBy)
        {
            try
            {
                var param = new DynamicParameters();
                param.Add("@IDPage", id);
                param.Add("@D_By", deletedBy);

                return await _dapper.QueryFirstOrDefaultAsync<SaveResult>("usp_Master_Page_Delete", param)
                       ?? new SaveResult { Result = -1, Message = "Database error" };
            }
            catch (Exception ex)
            {
                return new SaveResult { Result = -1, Message = ex.Message };
            }
        }
    }
}
