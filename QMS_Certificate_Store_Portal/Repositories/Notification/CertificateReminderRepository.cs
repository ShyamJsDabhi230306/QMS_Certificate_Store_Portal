using Dapper;
using Microsoft.Data.SqlClient;
using QMS_Certificate_Store_Portal.Models;
using System.Data;

namespace QMS_Certificate_Store_Portal.Repositories.Notification
{
    public class CertificateReminderRepository
        : ICertificateReminderRepository
    {
        private readonly IConfiguration _configuration;

        public CertificateReminderRepository(
            IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<List<CertificateReminderDto>>
     GetDueRemindersAsync()
        {
            using var connection =
                new SqlConnection(
                    _configuration.GetConnectionString(
                        "DefaultConnection"));

            var result =
                await connection.QueryAsync<
                    CertificateReminderDto>(
                    "usp_Transaction_Certificate_GetDueReminders",
                    commandType:
                    CommandType.StoredProcedure);

            return result.ToList();
        }

        public async Task<List<NotificationRecipientDto>>
            GetRecipientsAsync(int idCertificate)
            {
            using var connection =
                new SqlConnection(
                    _configuration.GetConnectionString(
                        "DefaultConnection"));

            var result =
                await connection.QueryAsync<
                    NotificationRecipientDto>(
                    "usp_Transaction_Certificate_Reminder_GetRecipients",
                    new
                    {
                        IDCertificate = idCertificate
                    },
                    commandType:
                    CommandType.StoredProcedure);

            return result.ToList();
        }


        public async Task MarkReminderSentAsync(int idReminder)
        {
            using var connection =
                new SqlConnection(
                    _configuration.GetConnectionString(
                        "DefaultConnection"));

            await connection.ExecuteAsync(
                "usp_Transaction_Certificate_Reminder_MarkSent",
                new
                {
                    IDReminder = idReminder
                },
                commandType: CommandType.StoredProcedure);
        }
    }
}
