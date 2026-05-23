using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Repositories;
using QMS_Certificate_Store_Portal.Models.Common;

namespace QMS_Certificate_Store_Portal.Services
{
    public class TransactionCertificateApprovalService
    {
        private readonly TransactionCertificateApprovalRepo _repo;
        public TransactionCertificateApprovalService(TransactionCertificateApprovalRepo repo) => _repo = repo;

        // 1. Process approval
        public async Task<SaveResult> ProcessAsync(TransactionCertificateApproval model)
        {
            return await _repo.ProcessAsync(model);
        }

        // 2. Get all pending certificates
        public async Task<IEnumerable<TransactionCertificateApproval>> GetPendingAsync(
     int companyId,
     int locationId
 )
        {
            return await _repo.GetPendingAsync(
                companyId,
                locationId
            );
        }

        // 3. Change status
        public async Task<SaveResult> ChangeStatusAsync(TransactionCertificateApproval model)
        {
            return await _repo.ChangeStatusAsync(model);
        }

        public async Task<IEnumerable<TransactionCertificateApproval>>
    GetApprovalHistoryAsync(
        int companyId,
        int locationId
    )
        {
            return await _repo.GetApprovalHistoryAsync(
                companyId,
                locationId
            );
        }
    }
}
