using QMS_Certificate_Store_Portal.Models;

namespace QMS_Certificate_Store_Portal.Repositories.Notification
{
    public interface ICertificateReminderProcessor
    {
        Task ProcessDueRemindersAsync();

        //    public interface ICertificateReminderProcessor
        //    {
        //        Task ProcessDueRemindersAsync();
        //        Task<List<NotificationRecipientDto>>
        //         GetRecipientsAsync(int idCertificate);
        //    }

        public interface ICertificateReminderProcessor
        {
            Task ProcessDueRemindersAsync();
        }
    }
}
