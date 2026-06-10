using QMS_Certificate_Store_Portal.Repositories.Notification;

namespace QMS_Certificate_Store_Portal.Repositories.Notification
{
    public class CertificateReminderProcessor : ICertificateReminderProcessor
    {
        private readonly ICertificateReminderRepository _reminderRepository;
        private readonly INotificationApiService _notificationApiService;

        public CertificateReminderProcessor(
            ICertificateReminderRepository reminderRepository,
            INotificationApiService notificationApiService)
        {
            _reminderRepository = reminderRepository;
            _notificationApiService = notificationApiService;
        }

        public async Task ProcessDueRemindersAsync()
        {
            var reminders =
                await _reminderRepository
                    .GetDueRemindersAsync();

            foreach (var reminder in reminders)
            {
                var recipients =
                    await _reminderRepository
                        .GetRecipientsAsync(
                            reminder.IDCertificate);

                var phones = recipients
                    .Where(x => !string.IsNullOrWhiteSpace(x.Phone))
                    .Select(x => x.Phone)
                    .Distinct()
                    .ToList();

                if (!phones.Any())
                    continue;

                string dateLabel =
        reminder.SurveillanceDate != null
            ? "Surveillance Date"
            : "Expiry Date";

                string actualDate =
                    reminder.SurveillanceDate != null
                        ? reminder.SurveillanceDate.Value.ToString("dd-MMM-yyyy")
                        : reminder.ExpiryDate.Value.ToString("dd-MMM-yyyy");


                await _notificationApiService.SendNotificationAsync(


                      subject: "🔔 Certificate Surveillance Alert",

                header: "🛡️ Compliance Certificate Expiring Soon",

                 message:

                
                     $@" 📜 Certificate Name : {reminder.CertificateName}
                    🔢 Certificate Number : {reminder.CertificateNumber}
                     
                     📂 Certificate Type : {reminder.CertificateTypeName}
                     
                     📅 {dateLabel} : {actualDate}
                     
                     ⏳ Days Remaining : {reminder.DaysBeforeSurveillance}
                     
  
                     
                     ⚠️ Action Required : Please review and complete the surveillance activity before the scheduled due date.
                     
                     ✅ Status : Surveillance Pending",

          footer:
              " Certificate Store | Compliance Monitoring System",

          userPhones: phones,

          category: "Certificate",

          subCategory:
            reminder.SurveillanceDate != null
        ? "Surveillance"
        : "Expiry"
                );
                if (reminder.IDReminder > 0)
                {
                    await _reminderRepository.MarkReminderSentAsync(
                        reminder.IDReminder);
                }

                // Next step:
                // Update ReminderSent = 1
                // Update ReminderSentDate = GETDATE()
            }
        }
    }
}