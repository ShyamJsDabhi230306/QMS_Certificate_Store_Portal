using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;
using QMS_Certificate_Store_Portal.Repositories;

namespace QMS_Certificate_Store_Portal.Services
{
    public class DesignationService
    {
        private readonly DesignationRepo _repo;
        public DesignationService(DesignationRepo repo) => _repo = repo;

        public Task<IEnumerable<Designation>> GetAllAsync() => _repo.GetAllAsync();
        public Task<Designation?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);
        public Task<SaveResult> SaveAsync(Designation model) => _repo.SaveAsync(model);
        public Task<SaveResult> DeleteAsync(int id, string deletedBy) => _repo.DeleteAsync(id, deletedBy);
    }
}
