using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;
using QMS_Certificate_Store_Portal.Repositories;

namespace QMS_Certificate_Store_Portal.Services
{
    public class CompanyService
    {
        private readonly CompanyRepo _repo;
        public CompanyService(CompanyRepo repo) => _repo = repo;

        public Task<IEnumerable<Company>> GetAllAsync() => _repo.GetAllAsync();
        public Task<Company?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);
        public Task<SaveResult> SaveAsync(Company model) => _repo.SaveAsync(model);
        public Task<SaveResult> DeleteAsync(int id, string deletedBy) => _repo.DeleteAsync(id, deletedBy);
    }
}
