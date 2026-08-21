using QMS_Certificate_Store_Portal.Models;

namespace QMS_Certificate_Store_Portal.Repositories.Notification
{
    public interface ICertificateReminderRepository
    {
        Task<List<CertificateReminderDto>>
            GetDueRemindersAsync();


        Task<List<NotificationRecipientDto>>
            GetRecipientsAsync(
                int idCertificate,
                int idReminder
            );

        Task MarkReminderSentAsync(int idReminder);
    }
}
