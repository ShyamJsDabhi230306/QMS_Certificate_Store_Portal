using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

using Dapper;

using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;

namespace QMS_Certificate_Store_Portal.Repositories
{
    public class UserRightRepo
    {
        private readonly IDapperHelper _dapper;

        public UserRightRepo(IDapperHelper dapper)
        {
            _dapper = dapper;
        }

        #region GET BY DESIGNATION

        public async Task<IEnumerable<MasterUserRight>>
            GetByDesignationIdAsync(int idDesignation)
        {
            try
            {
                var param = new DynamicParameters();

                param.Add(
                    "@IDDesignation",
                    idDesignation,
                    DbType.Int32
                );

                var data =
                    await _dapper.QueryAsync<MasterUserRight>(
                        "usp_Master_UserRight_SelectByDesignation",
                        param
                    );

                return data;
            }
            catch (Exception)
            {
                return Enumerable.Empty<MasterUserRight>();
            }
        }

        #endregion

        #region SINGLE UPDATE

        public async Task<SaveResult>
            UpdateRightsAsync(MasterUserRight model)
        {
            try
            {
                var param = new DynamicParameters();

                param.Add(
                    "@IDDesignation",
                    model.IDDesignation
                );

                param.Add(
                    "@IDPage",
                    model.IDPage
                );

                param.Add(
                    "@CanView",
                    model.CanView
                );

                param.Add(
                    "@CanCreate",
                    model.CanCreate
                );

                param.Add(
                    "@CanEdit",
                    model.CanEdit
                );

                param.Add(
                    "@CanDelete",
                    model.CanDelete
                );

                param.Add(
                    "@ActionUser",
                    model.UserAction ?? string.Empty
                );

                param.Add(
                    "@Remarks",
                    model.Remarks ?? string.Empty
                );

                var result =
                    await _dapper.QueryFirstOrDefaultAsync<SaveResult>(
                        "usp_Master_UserRight_Update",
                        param
                    );

                return result
                    ?? new SaveResult
                    {
                        Result = -1,
                        Message = "Database Error"
                    };
            }
            catch (Exception ex)
            {
                return new SaveResult
                {
                    Result = -1,
                    Message = ex.Message
                };
            }
        }

        #endregion

        #region BULK UPDATE

        public async Task<SaveResult>
            UpdateRightsBulkAsync(
                IEnumerable<MasterUserRight> rights,
                string actionUser
            )
        {
            try
            {
                foreach (var right in rights)
                {
                    right.UserAction = actionUser;

                    await UpdateRightsAsync(right);
                }

                return new SaveResult
                {
                    Result = 1,
                    Message = "Rights Updated Successfully"
                };
            }
            catch (Exception ex)
            {
                return new SaveResult
                {
                    Result = -1,
                    Message = ex.Message
                };
            }
        }

        #endregion

        #region INITIALIZE RIGHTS

        public async Task<SaveResult>
            InitializeForDesignationAsync(
                int idDesignation,
                string actionUser
            )
        {
            try
            {
                var param = new DynamicParameters();

                param.Add(
                    "@IDDesignation",
                    idDesignation,
                    DbType.Int32
                );

                param.Add(
                    "@ActionUser",
                    actionUser ?? string.Empty,
                    DbType.String
                );

                var result =
                    await _dapper.QueryFirstOrDefaultAsync<SaveResult>(
                        "usp_Master_UserRight_InitializeForNewDesignation",
                        param
                    );

                return result
                    ?? new SaveResult
                    {
                        Result = -1,
                        Message = "Database Error"
                    };
            }
            catch (Exception ex)
            {
                return new SaveResult
                {
                    Result = -1,
                    Message = ex.Message
                };
            }
        }

        #endregion



        public async Task<IEnumerable<MasterUserRight>>
    GetForUserAsync(int idUser)
        {
            var param = new DynamicParameters();
            param.Add("@IDUser", idUser, DbType.Int32);

            return await _dapper.QueryAsync<MasterUserRight>(
                "usp_Master_UserRight_SelectForUser",
                param);
        }

        public async Task<SaveResult>
            SaveForUserAsync(
                MasterUserRight model,
                string actionUser)
        {
            var param = new DynamicParameters();

            param.Add("@IDUser", model.IDUser);
            param.Add("@IDPage", model.IDPage);
            param.Add("@IDDesignation", model.IDDesignation);
            param.Add("@CanView", model.CanView);
            param.Add("@CanCreate", model.CanCreate);
            param.Add("@CanEdit", model.CanEdit);
            param.Add("@CanDelete", model.CanDelete);
            param.Add("@ActionUser", actionUser);
            param.Add("@Remarks", model.Remarks);

            return await _dapper.QueryFirstOrDefaultAsync<SaveResult>(
                "usp_Master_UserRight_SaveForUser",
                param
            ) ?? SaveResult.Fail("Database error.");
        }

        public async Task<SaveResult>
            RemoveUserOverrideAsync(
                int idUser,
                int idPage,
                string actionUser)
        {
            var param = new DynamicParameters();

            param.Add("@IDUser", idUser);
            param.Add("@IDPage", idPage);
            param.Add("@ActionUser", actionUser);

            return await _dapper.QueryFirstOrDefaultAsync<SaveResult>(
                "usp_Master_UserRight_RemoveUserOverride",
                param
            ) ?? SaveResult.Fail("Database error.");
        }


       

    }
}