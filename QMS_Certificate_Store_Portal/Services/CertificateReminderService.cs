using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;
using QMS_Certificate_Store_Portal.Repositories;
using static QMS_Certificate_Store_Portal.Models.Certificate;

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
        public async Task<IEnumerable<CertificateReminderNotification>>GetPendingRemindersAsync()
        {
            return await _repo .GetPendingRemindersAsync();
        }

        public async Task<IEnumerable<CertificateReminder>>GetByCertificateIdAsync(int idCertificate)
        {
            return await _repo.GetByCertificateIdAsync(idCertificate);
        }

        // Add only new reminders
        public async Task<SaveResult>AddAsync(SaveCertificateReminderRequest request, string actionUser)
        {
            return await _repo.AddAsync(
                request,
                actionUser
            );
        }
    }
}