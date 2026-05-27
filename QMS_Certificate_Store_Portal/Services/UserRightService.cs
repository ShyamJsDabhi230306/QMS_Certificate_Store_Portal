using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;
using QMS_Certificate_Store_Portal.Repositories;

namespace QMS_Certificate_Store_Portal.Services
{
    public class UserRightService
    {
        private readonly UserRightRepo _repo;

        public UserRightService(UserRightRepo repo)
        {
            _repo = repo;
        }

        #region GET BY DESIGNATION

        public async Task<IEnumerable<MasterUserRight>>
            GetByDesignationIdAsync(int idDesignation)
        {
            return await _repo.GetByDesignationIdAsync(idDesignation);
        }

        #endregion

        #region SINGLE UPDATE

        public async Task<SaveResult>
            UpdateRightsAsync(MasterUserRight model)
        {
            return await _repo.UpdateRightsAsync(model);
        }

        #endregion

        #region BULK UPDATE

        public async Task<SaveResult>
            UpdateRightsBulkAsync(
                IEnumerable<MasterUserRight> rights,
                string actionUser
            )
        {
            return await _repo.UpdateRightsBulkAsync(
                rights,
                actionUser
            );
        }

        #endregion

        #region INITIALIZE DESIGNATION

        public async Task<SaveResult>
            InitializeForDesignationAsync(
                int idDesignation,
                string actionUser
            )
        {
            return await _repo.InitializeForDesignationAsync(
                idDesignation,
                actionUser
            );
        }

        #endregion
    }
}