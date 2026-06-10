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
        public async Task<IEnumerable<Certificate>> GetAllAsync(int companyId,int locationId)
        {
            return await _repo.GetAllAsync(companyId,locationId);
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
        public async Task<DashboardStats> GetDashboardStatsAsync(int companyId,
    int locationId)
        {
            return await _repo.GetDashboardStatsAsync( companyId,
     locationId);
        }

        // =====================================
        // GET PENDING REMINDERS
        // =====================================
        public async Task<IEnumerable<CertificateReminderNotification>> GetPendingRemindersAsync()
        {
            return await _repo.GetPendingRemindersAsync();
        }
        // =====================================
        // GET CUSTOM CONTACTS BY REMINDER ID
        // =====================================
        public async Task<IEnumerable<ReminderCustomContact>> GetCustomContactsAsync(int reminderId)
        {
            return await _repo.GetCustomContactsByReminderAsync(reminderId);
        }
        // =====================================
        // SAVE CUSTOM CONTACT (INSERT / UPDATE)
        // =====================================
        public async Task<int> SaveCustomContactAsync(ReminderCustomContact contact)
        {
            return await _repo.SaveCustomContactAsync(contact);
        }
        // =====================================
        // SOFT DELETE CUSTOM CONTACT
        // =====================================
        public async Task DeleteCustomContactAsync(int idCustom, string actionUser)
        {
            await _repo.DeleteCustomContactAsync(idCustom, actionUser);
        }

        public async Task<dynamic> SaveCertificateLog(CertificateLog model)
        {
            return await _repo.SaveCertificateLog(model);
        }

        public async Task<IEnumerable<CertificateLog>> GetCertificateLogs()
        {
            return await _repo.GetCertificateLogs();
        }
    }
}
