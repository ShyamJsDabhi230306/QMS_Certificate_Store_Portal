using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;
using System.Text.Json;
using static QMS_Certificate_Store_Portal.Models.Certificate;

namespace QMS_Certificate_Store_Portal.Repositories
{
    public class CertificateReminderRepo
    {
        private readonly IDapperHelper _dapper;

        public CertificateReminderRepo(IDapperHelper dapper)
        {
            _dapper = dapper;
        }

        // =====================================
        // GET PENDING REMINDERS
        // =====================================
        public async Task<IEnumerable<CertificateReminderNotification>>
            GetPendingRemindersAsync()
        {
            return await _dapper
                .QueryAsync<CertificateReminderNotification>(
                    "usp_Transaction_Certificate_Reminder_GetPending"
                );
        }


        // Existing pending reminders


        // Load reminders for one certificate
        public async Task<IEnumerable<CertificateReminder>>
     GetByCertificateIdAsync(int idCertificate)
        {
            var multipleResult =
                await _dapper.QueryMultipleAsync(
                    "usp_Transaction_Certificate_Reminder_GetByCertificate",
                    new
                    {
                        IDCertificate = idCertificate
                    }
                );

            try
            {
                var reminders =
                    (await multipleResult.Reader
                        .ReadAsync<CertificateReminder>())
                    .ToList();

                var contacts =
                    (await multipleResult.Reader
                        .ReadAsync<ReminderCustomContact>())
                    .ToList();

                foreach (var reminder in reminders)
                {
                    reminder.CustomContacts = contacts
                        .Where(contact =>
                            contact.IDReminder ==
                            reminder.IDReminder)
                        .ToList();
                }

                return reminders;
            }
            finally
            {
                multipleResult.Reader.Dispose();
                await multipleResult.Conn.DisposeAsync();
            }
        }
        // Add only new reminders; existing reminders are never deleted
        public async Task<SaveResult>
    AddAsync(
        SaveCertificateReminderRequest request,
        string actionUser
    )
        {
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var remindersJson = JsonSerializer.Serialize(
                request.Reminders ??
                new List<CertificateReminder>(),
                options
            );

            var deletedReminderIdsJson =
                JsonSerializer.Serialize(
                    request.DeletedReminderIds ??
                    new List<int>(),
                    options
                );

            var deletedContactIdsJson =
                JsonSerializer.Serialize(
                    request.DeletedContactIds ??
                    new List<int>(),
                    options
                );

            return await _dapper.QueryFirstOrDefaultAsync<SaveResult>(
                "usp_Transaction_Certificate_Reminder_SaveList",
                new
                {
                    IDCertificate = request.IDCertificate,
                    RemindersJson = remindersJson,
                    DeletedReminderIdsJson =
                        deletedReminderIdsJson,
                    DeletedContactIdsJson =
                        deletedContactIdsJson,
                    ActionUser = actionUser
                }
            ) ?? new SaveResult
            {
                Result = -1,
                Message =
                    "No response received from database."
            };
        }
    }
}
