namespace QMS_Certificate_Store_Portal.Repositories.Notification
{
    public class CertificateReminderJob
    {
        private readonly ICertificateReminderProcessor _processor;

        public CertificateReminderJob(
            ICertificateReminderProcessor processor)
        {
            _processor = processor;
        }

        public async Task Execute()
        {
            Console.WriteLine("Hangfire Job Started");
            await _processor.ProcessDueRemindersAsync();
            Console.WriteLine("Hangfire Job Completed");
        }
        
    }
}
