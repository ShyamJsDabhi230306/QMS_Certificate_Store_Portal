using Dapper;
using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;
using System.Data;

namespace QMS_Certificate_Store_Portal.Repositories
{
    public class DepartmentRepo
    {
        private readonly IDapperHelper _dapper;
        public DepartmentRepo(IDapperHelper dapper) => _dapper = dapper;

        //public async Task<IEnumerable<Department>> GetAllAsync()
        //{
        //    try { return await _dapper.QueryAsync<Department>("usp_Master_Department_SelectAll"); }
        //    catch { return Enumerable.Empty<Department>(); }
        //}
        // Repository
        public async Task<IEnumerable<Department>> GetAllAsync()
        {
            return await _dapper.QueryAsync<Department>(
                "usp_Master_Department_SelectAll_Admin"
            );
        }
        public async Task<IEnumerable<Department>> GetAllAsync(int companyId, int locationId)
        {
            var parameters = new DynamicParameters();

            parameters.Add("@IDCompany", companyId);

            parameters.Add("@IDLocation", locationId);

            return await _dapper.QueryAsync<Department>(
                "usp_Master_Department_SelectAll",
                parameters
            );
        }

      

        public async Task<Department?> GetByIdAsync(int id)
        {
            try {
                var param = new DynamicParameters();
                param.Add("@IDDepartment", id);
                return await _dapper.QueryFirstOrDefaultAsync<Department>("usp_Master_Department_SelectById", param);
            }
            catch { return null; }
        }

        public async Task<SaveResult> SaveAsync(Department model)
        {
            try {
                var param = new DynamicParameters();
                param.Add("@IDDepartment", model.IDDepartment);
                param.Add("@IDLocation", model.IDLocation);
                param.Add("@DepartmentName", model.DepartmentName);
                param.Add("@CreatedOn", model.CreatedOn);
                param.Add("@Remarks", model.Remarks);
                param.Add("@IsActive", model.IsActive);
                param.Add("@ActionUser", model.UserAction);

                return await _dapper.QueryFirstOrDefaultAsync<SaveResult>("usp_Master_Department_Save", param)
                       ?? new SaveResult { Result = -1, Message = "Database error" };
            }
            catch (Exception ex) { return new SaveResult { Result = -1, Message = ex.Message }; }
        }

        public async Task<SaveResult> DeleteAsync(int id, string deletedBy)
        {
            try {
                var param = new DynamicParameters();
                param.Add("@IDDepartment", id);
                param.Add("@D_By", deletedBy);
                return await _dapper.QueryFirstOrDefaultAsync<SaveResult>("usp_Master_Department_Delete", param)
                       ?? new SaveResult { Result = -1, Message = "Database error" };
            }
            catch (Exception ex) { return new SaveResult { Result = -1, Message = ex.Message }; }
        }
    }
}
