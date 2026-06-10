using QMS_Certificate_Store_Portal.Repositories.Notification;

namespace QMS_Certificate_Store_Portal.Services
{
    public class CertificateReminderWorker : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IConfiguration _configuration;
        private readonly ILogger<CertificateReminderWorker> _logger;

        public CertificateReminderWorker(
            IServiceProvider serviceProvider,
            IConfiguration configuration,
            ILogger<CertificateReminderWorker> logger)
        {
            _serviceProvider = serviceProvider;
            _configuration = configuration;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(
            CancellationToken stoppingToken)
        {
            var enabled =
                _configuration.GetValue<bool>(
                    "CertificateReminderWorker:Enabled");

            var checkEverySeconds =
                _configuration.GetValue<int>(
                    "CertificateReminderWorker:CheckEverySeconds");

            if (checkEverySeconds <= 0)
                checkEverySeconds = 60;

            if (!enabled)
            {
                _logger.LogInformation(
                    "Certificate Reminder Worker Disabled.");

                return;
            }

            _logger.LogInformation(
                "Certificate Reminder Worker Started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope =
                        _serviceProvider.CreateScope();

                    var processor =
                        scope.ServiceProvider
                        .GetRequiredService<
                            ICertificateReminderProcessor>();

                    await processor
                        .ProcessDueRemindersAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(
                        ex,
                        "Certificate Reminder Worker Failed.");
                }

                await Task.Delay(
                    TimeSpan.FromSeconds(
                        checkEverySeconds),
                    stoppingToken);
            }
        }
    }
}