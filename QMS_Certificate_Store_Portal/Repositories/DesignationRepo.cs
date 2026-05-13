using Dapper;
using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;

namespace QMS_Certificate_Store_Portal.Repositories
{
    public class DesignationRepo
    {
        private readonly IDapperHelper _dapper;
        public DesignationRepo(IDapperHelper dapper) => _dapper = dapper;

        public async Task<IEnumerable<Designation>> GetAllAsync()
        {
            try { return await _dapper.QueryAsync<Designation>("usp_Master_Designation_SelectAll"); }
            catch { return Enumerable.Empty<Designation>(); }
        }

        public async Task<Designation?> GetByIdAsync(int id)
        {
            try {
                var param = new DynamicParameters();
                param.Add("@IDDesignation", id);
                return await _dapper.QueryFirstOrDefaultAsync<Designation>("usp_Master_Designation_SelectById", param);
            }
            catch { return null; }
        }

        public async Task<SaveResult> SaveAsync(Designation model)
        {
            try {
                var param = new DynamicParameters();
                param.Add("@IDDesignation", model.IDDesignation);
                param.Add("@DesignationName", model.DesignationName);
                param.Add("@CreatedOn", model.CreatedOn);
                param.Add("@Remarks", model.Remarks);
                param.Add("@IsActive", model.IsActive);
                param.Add("@ActionUser", model.UserAction);

                return await _dapper.QueryFirstOrDefaultAsync<SaveResult>("usp_Master_Designation_Save", param)
                       ?? new SaveResult { Result = -1, Message = "Database error" };
            }
            catch (Exception ex) { return new SaveResult { Result = -1, Message = ex.Message }; }
        }

        public async Task<SaveResult> DeleteAsync(int id, string deletedBy)
        {
            try {
                var param = new DynamicParameters();
                param.Add("@IDDesignation", id);
                param.Add("@D_By", deletedBy);
                return await _dapper.QueryFirstOrDefaultAsync<SaveResult>("usp_Master_Designation_Delete", param)
                       ?? new SaveResult { Result = -1, Message = "Database error" };
            }
            catch (Exception ex) { return new SaveResult { Result = -1, Message = ex.Message }; }
        }
    }
}
