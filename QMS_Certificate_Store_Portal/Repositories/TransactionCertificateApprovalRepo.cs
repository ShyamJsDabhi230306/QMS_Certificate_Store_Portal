using Dapper;
using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;
using System.Data;

namespace QMS_Certificate_Store_Portal.Repositories
{
    public class TransactionCertificateApprovalRepo
    {
        private readonly IDapperHelper _dapper;
        public TransactionCertificateApprovalRepo(IDapperHelper dapper) => _dapper = dapper;

        // 1. Process approval (Approve / Reject button click)
        public async Task<SaveResult> ProcessAsync(TransactionCertificateApproval model)
        {
            var parameters = new DynamicParameters();

            parameters.Add("@IDCertificate", model.IDCertificate);
            parameters.Add("@ApprovedBy", model.ApprovedBy);
            parameters.Add("@ApprovalStatus", model.ApprovalStatus);
            parameters.Add("@ApprovalComment", model.ApprovalComment);
            parameters.Add("@ApprovalDate", model.ApprovalDate);
            parameters.Add("@ApprovalLevel", model.ApprovalLevel);
            parameters.Add("@Remarks", model.Remarks);

            return await _dapper.QueryFirstOrDefaultAsync<SaveResult>(
                "usp_Transaction_Certificate_Approval_Process",
                parameters
            );
        }

        // 2. Get all pending certificates
        public async Task<IEnumerable<TransactionCertificateApproval>> GetPendingAsync(
    int companyId,
    int locationId
)
        {
            var parameters = new DynamicParameters();

            parameters.Add("@IDCompany", companyId);

            parameters.Add("@IDLocation", locationId);

            return await _dapper.QueryAsync<TransactionCertificateApproval>(
                "usp_Transaction_Certificate_Approval_GetPending",
                parameters
            );
        }

        // 3. Change status (Reject → Approve or Approve → Reject)
        public async Task<SaveResult> ChangeStatusAsync(TransactionCertificateApproval model)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@IDCertificate", model.IDCertificate);
            parameters.Add("@ApprovedBy", model.ApprovedBy);
            parameters.Add("@ApprovalStatus", model.ApprovalStatus);
            parameters.Add("@ApprovalComment", model.ApprovalComment);
            parameters.Add("@ApprovalLevel", model.ApprovalLevel);
            parameters.Add("@Remarks", model.Remarks);
            //parameters.Add("@ActionUser", model.UserAction);

            return await _dapper.QueryFirstOrDefaultAsync<SaveResult>("usp_Transaction_Certificate_Approval_ChangeStatus", parameters);
        }
        public async Task<IEnumerable<TransactionCertificateApproval>>
    GetApprovalHistoryAsync(
        int companyId,
        int locationId
    )
        {
            var parameters = new DynamicParameters();

            parameters.Add("@IDCompany", companyId);

            parameters.Add("@IDLocation", locationId);

            return await _dapper.QueryAsync<TransactionCertificateApproval>(
                "usp_Transaction_Certificate_Approval_GetHistory",
                parameters
            );
        }
    }
}
