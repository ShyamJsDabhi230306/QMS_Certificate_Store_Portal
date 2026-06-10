using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Repositories;
using QMS_Certificate_Store_Portal.Repositories.Notification;
using QMS_Certificate_Store_Portal.Services;


namespace QMS_Certificate_Store_Portal.Helpers
{
    public static class ServiceContainer
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // main part for registration 
            services.AddScoped<IDapperHelper, DapperHelper>();
            services.AddScoped<JwtHelper>();



            // repository Layer for registration
            services.AddScoped<UserRepo>();
            services.AddScoped<CompanyRepo>();
            services.AddScoped<LocationRepo>();
            services.AddScoped<DepartmentRepo>();
            services.AddScoped<DesignationRepo>();
            services.AddScoped<PageRepo>();
            services.AddScoped<UserRightRepo>();
            services.AddScoped<CertificateTypeRepo>();
            
            // transactional repository Layer for registration
            services.AddScoped<CertificateRepo>();
            services.AddScoped<TransactionCertificateApprovalRepo>();
            services.AddScoped<CertificateReminderRepo>();
            // Master Services Layer for registration 
            services.AddScoped<UserService>();
            services.AddScoped<CompanyService>();
            services.AddScoped<LocationService>();
            services.AddScoped<DepartmentService>();
            services.AddScoped<DesignationService>();
            services.AddScoped<PageService>();
            services.AddScoped<UserRightService>();
            services.AddScoped<CertificateTypeService>();

            // transactional Services Layer for registration
            services.AddScoped<CertificateService>();
            services.AddScoped<TransactionCertificateApprovalService>();
            services.AddScoped<CertificateReminderService>();
            //services.AddScoped<INotificationRepository,NotificationRepository>();



            return services;
        }
    }
}
