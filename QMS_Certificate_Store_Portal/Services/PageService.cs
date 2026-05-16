using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;
using QMS_Certificate_Store_Portal.Repositories;

namespace QMS_Certificate_Store_Portal.Services
{
    public class PageService
    {
        private readonly PageRepo _repo;
        public PageService(PageRepo repo) => _repo = repo;

        public Task<IEnumerable<MasterPage>> GetAllAsync() => _repo.GetAllAsync();
        public Task<MasterPage?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);
        public Task<SaveResult> SaveAsync(MasterPage model) => _repo.SaveAsync(model);
        public Task<SaveResult> DeleteAsync(int id, string deletedBy) => _repo.DeleteAsync(id, deletedBy);
    }
}
