using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models;

namespace QMS_Certificate_Store_Portal.Repositories
{
    public class CertificateReminderRepo
    {
        private readonly IDapperHelper _dapper;

        public CertificateReminderRepo(IDapperHelper dapper)
        {
            _dapper = dapper;
        }

        // =====================================
        // GET PENDING REMINDERS
        // =====================================
        public async Task<IEnumerable<CertificateReminderNotification>>
            GetPendingRemindersAsync()
        {
            return await _dapper
                .QueryAsync<CertificateReminderNotification>(
                    "usp_Transaction_Certificate_Reminder_GetPending"
                );
        }
    }
}