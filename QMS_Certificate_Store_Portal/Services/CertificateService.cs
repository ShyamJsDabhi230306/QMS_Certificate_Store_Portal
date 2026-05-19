using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Repositories;
using QMS_Certificate_Store_Portal.Models.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace QMS_Certificate_Store_Portal.Services
{
    public class CertificateService
    {
        private readonly CertificateRepo _repo;
        public CertificateService(CertificateRepo repo) => _repo = repo;

        // 1. Fetch all active certificates
        public async Task<IEnumerable<Certificate>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }

        // 2. Fetch single certificate by ID
        public async Task<Certificate?> GetByIdAsync(int id)
        {
            return await _repo.GetByIdAsync(id);
        }

        // 3. Save (Insert/Update) Certificate with reminders
        public async Task<SaveResult> SaveAsync(Certificate model)
        {
            return await _repo.SaveAsync(model);
        }

        // 4. Soft-delete certificate
        public async Task<SaveResult> DeleteAsync(int id, string user)
        {
            return await _repo.DeleteAsync(id, user);
        }



        // Dashboard Stats
        public async Task<DashboardStats> GetDashboardStatsAsync()
        {
            return await _repo.GetDashboardStatsAsync();
        }

    }
}
