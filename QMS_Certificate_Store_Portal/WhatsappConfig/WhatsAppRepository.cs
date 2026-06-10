using Dapper;
using Microsoft.Data.SqlClient;
using QMS_Certificate_Store_Portal.Models;
using System.Data;

namespace QMS_Certificate_Store_Portal.WhatsappConfig
{
    public class WhatsAppRepository : IWhatsAppRepository
    {
        private readonly IConfiguration _configuration;

        public WhatsAppRepository(
            IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<WhatsAppConfigDto>
            GetWhatsAppConfigAsync()
        {
            using var connection =
                new SqlConnection(
                    _configuration.GetConnectionString(
                        "DefaultConnection"));

            return await connection
                .QueryFirstOrDefaultAsync<WhatsAppConfigDto>(
                    "usp_Extra_WhatsAppConfig_Select",
                    commandType: CommandType.StoredProcedure);
        }
    }
}
