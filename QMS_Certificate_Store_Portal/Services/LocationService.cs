using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;
using QMS_Certificate_Store_Portal.Repositories;

namespace QMS_Certificate_Store_Portal.Services
{
    public class LocationService
    {
        private readonly LocationRepo _repo;
        public LocationService(LocationRepo repo) => _repo = repo;
        public Task<Location?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);
        public Task<IEnumerable<Location>> GetAllAsync() => _repo.GetAllAsync();
        public Task<SaveResult> SaveAsync(Location model) => _repo.SaveAsync(model);
        public Task<SaveResult> DeleteAsync(int id, string deletedBy) => _repo.DeleteAsync(id, deletedBy);
    }
}
