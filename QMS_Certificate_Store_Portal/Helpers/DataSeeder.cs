using Dapper;
using QMS_Certificate_Store_Portal.Helpers;

namespace QMS_Certificate_Store_Portal.Helpers
{
    public static class DataSeeder
    {
        public static async Task SeedAdminUser(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var dapper = scope.ServiceProvider.GetRequiredService<IDapperHelper>();

            // Call the SP using Dapper
            await dapper.ExecuteAsync("usp_System_Initialize_Admin", null);
        }
    }
}
