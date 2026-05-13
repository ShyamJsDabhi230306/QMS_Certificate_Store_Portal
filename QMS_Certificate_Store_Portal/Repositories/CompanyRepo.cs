using Dapper;
using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;

namespace QMS_Certificate_Store_Portal.Repositories
{
    public class CompanyRepo
    {
        private readonly IDapperHelper _dapper;
        public CompanyRepo(IDapperHelper dapper) => _dapper = dapper;

        public async Task<IEnumerable<Company>> GetAllAsync()
        {
            try
            {
                return await _dapper.QueryAsync<Company>("usp_Master_Company_SelectAll");
            }
            catch (Exception)
            {
                return Enumerable.Empty<Company>();
            }
        }

        public async Task<Company?> GetByIdAsync(int id)
        {
            try
            {
                var param = new DynamicParameters();
                param.Add("@IDCompany", id);
                return await _dapper.QueryFirstOrDefaultAsync<Company>("usp_Master_Company_SelectById", param);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<SaveResult> SaveAsync(Company model)
        {
            try
            {
                var param = new DynamicParameters();
                param.Add("@IDCompany", model.IDCompany);
                param.Add("@CompanyName", model.CompanyName);
                param.Add("@Address", model.Address);
                param.Add("@ContactNo", model.ContactNo);
                param.Add("@Email", model.Email);
                param.Add("@PanNo", model.PanNo);
                param.Add("@GSTNo", model.GSTNo);
                param.Add("@CreatedOn", model.CreatedOn);
                param.Add("@Remarks", model.Remarks);
                param.Add("@IsActive", model.IsActive);
                param.Add("@ActionUser", model.UserAction); // 👈 Maps to @ActionUser in your SP

                return await _dapper.QueryFirstOrDefaultAsync<SaveResult>("usp_Master_Company_Save", param) 
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
                param.Add("@IDCompany", id);
                param.Add("@D_By", deletedBy);

                return await _dapper.QueryFirstOrDefaultAsync<SaveResult>("usp_Master_Company_Delete", param)
                       ?? new SaveResult { Result = -1, Message = "Database error" };
            }
            catch (Exception ex)
            {
                return new SaveResult { Result = -1, Message = ex.Message };
            }
        }
    }
}
