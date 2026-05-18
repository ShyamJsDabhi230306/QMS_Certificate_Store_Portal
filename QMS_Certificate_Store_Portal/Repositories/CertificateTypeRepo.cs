using Dapper;
using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;
using System.Data;

namespace QMS_Certificate_Store_Portal.Repositories
{
    public class CertificateTypeRepo
    {
        private readonly IDapperHelper _db;
        public CertificateTypeRepo(IDapperHelper db) => _db = db;

        public async Task<IEnumerable<CertificateType>> GetAllAsync()
        {
            return await _db.QueryAsync<CertificateType>("usp_Master_CertificateType_SelectAll", null);
        }

        public async Task<CertificateType> GetByIdAsync(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@IDCertificateType", id);
            return await _db.QueryFirstOrDefaultAsync<CertificateType>("usp_Master_CertificateType_SelectById", parameters);
        }

        public async Task<SaveResult> SaveAsync(CertificateType model)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@IDCertificateType", model.IDCertificateType);
            parameters.Add("@CertificateTypeName", model.CertificateTypeName);
            parameters.Add("@IsActive", model.IsActive);
            parameters.Add("@Remarks", model.Remarks);
            parameters.Add("@ActionUser", model.UserAction);

            return await _db.QueryFirstOrDefaultAsync<SaveResult>("usp_Master_CertificateType_Save", parameters);
        }

        public async Task<SaveResult> DeleteAsync(int id, string user)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@IDCertificateType", id);
            parameters.Add("@ActionUser", user);

            return await _db.QueryFirstOrDefaultAsync<SaveResult>("usp_Master_CertificateType_Delete", parameters);
        }
    }
}
