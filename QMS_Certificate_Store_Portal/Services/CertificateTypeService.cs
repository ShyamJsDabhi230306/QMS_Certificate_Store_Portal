using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Repositories;
using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models.Common;

namespace QMS_Certificate_Store_Portal.Services
{
    public class CertificateTypeService
    {
        private readonly CertificateTypeRepo _repo;
        public CertificateTypeService(CertificateTypeRepo repo) => _repo = repo;

        public async Task<IEnumerable<CertificateType>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }

        public async Task<CertificateType> GetByIdAsync(int id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task<SaveResult> SaveAsync(CertificateType model)
        {
            return await _repo.SaveAsync(model);
        }

        public async Task<SaveResult> DeleteAsync(int id, string user)
        {
            return await _repo.DeleteAsync(id, user);
        }
    }
}
