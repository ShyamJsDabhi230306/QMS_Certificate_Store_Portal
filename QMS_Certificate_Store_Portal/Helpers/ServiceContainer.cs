using Airmax_Payroll_System.Helpers;
using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Repositories;
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




            // Services Layer for registration 
            services.AddScoped<UserService>();
            return services;
        }
    }
}
