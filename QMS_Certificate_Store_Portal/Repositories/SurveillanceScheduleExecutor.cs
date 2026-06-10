//using System;
//using System.Threading.Tasks;
//using Microsoft.Extensions.Logging;
//using ReportSchedulerApi.Repositories.Interfaces;
//using QMS_Certificate_Store_Portal.Services;

//namespace QMS_Certificate_Store_Portal.Repositories
//{
//    /// <summary>
//    /// Called by ReportScheduleWorker – runs every day (or whatever you configure
//    /// in SchedulerWorker:CheckEverySeconds) and triggers the surveillance flow.
//    /// </summary>
//    public class SurveillanceScheduleExecutor : IScheduleExecutorRepository
//    {
//        private readonly ISurveillanceNotificationService _svc;
//        private readonly ILogger<SurveillanceScheduleExecutor> _logger;

//        public SurveillanceScheduleExecutor(
//            ISurveillanceNotificationService svc,
//            ILogger<SurveillanceScheduleExecutor> logger)
//        {
//            _svc = svc;
//            _logger = logger;
//        }

//        // The interface only requires ExecuteDueSchedulesAsync – we reuse it.
//        public async Task ExecuteDueSchedulesAsync()
//        {
//            _logger.LogInformation("Running surveillance schedule …");
//            await _svc.ExecuteAsync();
//        }
//    }
//}
