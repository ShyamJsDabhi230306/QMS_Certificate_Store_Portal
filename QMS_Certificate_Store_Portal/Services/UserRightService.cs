using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;
using QMS_Certificate_Store_Portal.Repositories;

namespace QMS_Certificate_Store_Portal.Services
{
    public class UserRightService
    {
        private readonly UserRightRepo _repo;
        public UserRightService(UserRightRepo repo) => _repo = repo;

        public Task<IEnumerable<MasterUserRight>> GetByUserIdAsync(int idUser) => _repo.GetByUserIdAsync(idUser);
        public Task<SaveResult> UpdateRightsAsync(MasterUserRight model) => _repo.UpdateRightsAsync(model);
        public Task<SaveResult> InitializeForUserAsync(int idUser, string actionUser) => _repo.InitializeForUserAsync(idUser, actionUser);
    }
}
