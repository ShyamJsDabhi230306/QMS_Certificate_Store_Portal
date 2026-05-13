using Dapper;
using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;

namespace QMS_Certificate_Store_Portal.Repositories
{
    public class LocationRepo
    {
        private readonly IDapperHelper _dapper;
        public LocationRepo(IDapperHelper dapper) => _dapper = dapper;

        public async Task<IEnumerable<Location>> GetAllAsync()
        {
            try { return await _dapper.QueryAsync<Location>("usp_Master_Location_SelectAll"); }
            catch { return Enumerable.Empty<Location>(); }
        }
        public async Task<Location?> GetByIdAsync(int id)
        {
            try
            {
                var param = new DynamicParameters();
                param.Add("@IDLocation", id);
                return await _dapper.QueryFirstOrDefaultAsync<Location>("usp_Master_Location_SelectById", param);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<SaveResult> SaveAsync(Location model)
        {
            try {
                var param = new DynamicParameters();
                param.Add("@IDLocation", model.IDLocation);
                param.Add("@IDCompany", model.IDCompany);
                param.Add("@LocationName", model.LocationName);
                param.Add("@Remarks", model.Remarks);
                param.Add("@IsActive", model.IsActive);
                param.Add("@ActionUser", model.UserAction);

                return await _dapper.QueryFirstOrDefaultAsync<SaveResult>("usp_Master_Location_Save", param)
                       ?? new SaveResult { Result = -1, Message = "Database error" };
            }
            catch (Exception ex) { return new SaveResult { Result = -1, Message = ex.Message }; }
        }

        public async Task<SaveResult> DeleteAsync(int id, string deletedBy)
        {
            try {
                var param = new DynamicParameters();
                param.Add("@IDLocation", id);
                param.Add("@D_By", deletedBy);
                return await _dapper.QueryFirstOrDefaultAsync<SaveResult>("usp_Master_Location_Delete", param)
                       ?? new SaveResult { Result = -1, Message = "Database error" };
            }
            catch (Exception ex) { return new SaveResult { Result = -1, Message = ex.Message }; }
        }
    }
}
