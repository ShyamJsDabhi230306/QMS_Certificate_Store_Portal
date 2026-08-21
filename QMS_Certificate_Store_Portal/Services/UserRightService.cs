using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;
using QMS_Certificate_Store_Portal.Repositories;

namespace QMS_Certificate_Store_Portal.Services
{
    public class UserRightService
    {
        private readonly UserRightRepo _repo;
        private readonly UserRepo _userRepo;

        public UserRightService(
            UserRightRepo repo,
            UserRepo userRepo)
        {
            _repo = repo;
            _userRepo = userRepo;
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


        public async Task<IEnumerable<MasterUserRight>>
    GetForUserAsync(int idUser)
        {
            return await _repo.GetForUserAsync(idUser);
        }

        public async Task<SaveResult>
     SaveForUserAsync(
         MasterUserRight model,
         string actionUser)
        {
            // Get selected user from database
            var user = await _userRepo.GetByIdAsync(model.IDUser);

            if (user == null)
            {
                return SaveResult.Fail(
                    "User not found."
                );
            }

            if (!user.IDDesignation.HasValue ||
                user.IDDesignation.Value <= 0)
            {
                return SaveResult.Fail(
                    "Designation is not assigned to this user."
                );
            }

            // IMPORTANT:
            // Always take designation from selected user
            model.IDDesignation =
                user.IDDesignation.Value;

            return await _repo.SaveForUserAsync(
                model,
                actionUser
            );
        }

        public async Task<SaveResult>
            RemoveUserOverrideAsync(
                int idUser,
                int idPage,
                string actionUser)
        {
            return await _repo.RemoveUserOverrideAsync(
                idUser,
                idPage,
                actionUser);
        }


       
    }
}