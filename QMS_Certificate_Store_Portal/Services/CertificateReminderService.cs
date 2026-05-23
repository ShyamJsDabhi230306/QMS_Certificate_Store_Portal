using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Repositories;

namespace QMS_Certificate_Store_Portal.Services
{
    public class CertificateReminderService
    {
        private readonly CertificateReminderRepo _repo;

        public CertificateReminderService(
            CertificateReminderRepo repo
        )
        {
            _repo = repo;
        }

        // =====================================
        // GET PENDING REMINDERS
        // =====================================
        public async Task<IEnumerable<CertificateReminderNotification>>
            GetPendingRemindersAsync()
        {
            return await _repo
                .GetPendingRemindersAsync();
        }
    }
}