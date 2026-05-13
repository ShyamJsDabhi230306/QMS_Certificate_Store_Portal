using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;
using QMS_Certificate_Store_Portal.Repositories;

namespace QMS_Certificate_Store_Portal.Services
{
    public class DepartmentService
    {
        private readonly DepartmentRepo _repo;
        public DepartmentService(DepartmentRepo repo) => _repo = repo;

        public Task<IEnumerable<Department>> GetAllAsync() => _repo.GetAllAsync();
        public Task<Department?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);
        public Task<SaveResult> SaveAsync(Department model) => _repo.SaveAsync(model);
        public Task<SaveResult> DeleteAsync(int id, string deletedBy) => _repo.DeleteAsync(id, deletedBy);
    }
}
