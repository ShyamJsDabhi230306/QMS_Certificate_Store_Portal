using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;
using QMS_Certificate_Store_Portal.Repositories;

namespace QMS_Certificate_Store_Portal.Services
{
    public class UserService
    {
        private readonly UserRepo _repo;

        public UserService(UserRepo repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Users>> GetAllAsync(int idDept = 0, int idDesig = 0)
            => await _repo.GetAllAsync(idDept, idDesig);

        public async Task<Users?> GetByIdAsync(int id)
            => await _repo.GetByIdAsync(id);

        public async Task<SaveResult> SaveAsync(Users model)
            => await _repo.SaveAsync(model);

        public async Task<SaveResult> DeleteAsync(int id, string deletedBy)
            => await _repo.DeleteAsync(id, deletedBy);
    }
}
