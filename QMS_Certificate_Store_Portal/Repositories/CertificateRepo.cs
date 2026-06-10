using Dapper;
using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using static Dapper.SqlMapper;

namespace QMS_Certificate_Store_Portal.Repositories
{
    public class CertificateRepo
    {
        private readonly IDapperHelper _dapper;
        public CertificateRepo(IDapperHelper dapper) => _dapper = dapper;

        // 1. Fetch all active certificates for the grid list
        //public async Task<IEnumerable<Certificate>> GetAllAsync(int companyId,int locationId)
        //{
        //    var parameters = new DynamicParameters();

        //    parameters.Add("@IDCompany", companyId);

        //    parameters.Add("@IDLocation", locationId);

        //    return await _dapper.QueryAsync<Certificate>(
        //        "usp_Transaction_Certificate_SelectAll",
        //        parameters
        //    );
        //}
        public async Task<IEnumerable<Certificate>>
    GetAllAsync(
        int companyId,
        int locationId
    )
        {
            var parameters = new DynamicParameters();

            parameters.Add(
                "@IDCompany",
                companyId
            );

            parameters.Add(
                "@IDLocation",
                locationId
            );

            var data =
                (
                    await _dapper.QueryAsync<Certificate>(
                        "usp_Transaction_Certificate_SelectAll",
                        parameters
                    )
                ).ToList();

            // Deserialize Reminder JSON
            foreach (var item in data)
            {
                if (
                    !string.IsNullOrWhiteSpace(
                        item.RemindersJson
                    )
                )
                {
                    item.Reminders =
                        System.Text.Json.JsonSerializer.Deserialize
                        <
                            List<CertificateReminder>
                        >
                        (
                            item.RemindersJson
                        )
                        ?? new List<CertificateReminder>();
                }
            }

            return data;
        }

        // 2. Fetch single certificate with its reminders using high-performance Multi-Result reading
        //public async Task<Certificate?> GetByIdAsync(int id)
        //{
        //    var parameters = new DynamicParameters();
        //    parameters.Add("@IDCertificate", id);

        //    var (reader, conn) = await _dapper.QueryMultipleAsync("usp_Transaction_Certificate_SelectById", parameters);
        //    using (conn)
        //    using (reader)
        //    {
        //        var certificate = await reader.ReadFirstOrDefaultAsync<Certificate>();
        //        if (certificate != null)
        //        {
        //            var reminders = await reader.ReadAsync<CertificateReminder>();
        //            certificate.Reminders = reminders.ToList();
        //        }
        //        return certificate;
        //    }
        //}


        public async Task<Certificate?> GetByIdAsync(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@IDCertificate", id);

            var (reader, conn) = await _dapper.QueryMultipleAsync("usp_Transaction_Certificate_SelectById", parameters);
            using (conn)
            using (reader)
            {
                var certificate = await reader.ReadFirstOrDefaultAsync<Certificate>();
                if (certificate != null)
                {
                    var reminders = (await reader.ReadAsync<CertificateReminder>()).ToList();

                    // Load custom contacts for each reminder
                    foreach (var reminder in reminders)
                    {
                        var customContacts = await _dapper.QueryAsync<ReminderCustomContact>(
                            "usp_Transaction_Reminder_Custom_Contact_GetByReminderId",
                            new { IDReminder = reminder.IDReminder }
                        );
                        reminder.CustomContacts = customContacts.ToList();
                    }

                    certificate.Reminders = reminders;
                }
                return certificate;
            }
        }

        // 3. Save (Insert/Update) Certificate with reminders passed as JSON
        // =============================================================
        // 3. Save (Insert/Update) Certificate with reminders and custom contacts
        // =============================================================
        public async Task<SaveResult> SaveAsync(Certificate model)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@IDCertificate", model.IDCertificate);
            parameters.Add("@CertificateName", model.CertificateName);
            parameters.Add("@CertificateNumber", model.CertificateNumber);
            parameters.Add("@IDCertificateType", model.IDCertificateType);
            parameters.Add("@IDOwner", model.IDOwner);
            parameters.Add("@IDDepartment", model.IDDepartment);
            parameters.Add("@IDCompany", model.IDCompany);
            parameters.Add("@IDLocation", model.IDLocation);
            parameters.Add("@IssueDate", model.IssueDate);
            parameters.Add("@ValidForYears", model.ValidForYears);
            parameters.Add("@ExpiryDate", model.ExpiryDate);
            parameters.Add("@RenewalCategory", model.RenewalCategory);
            parameters.Add("@Tags", model.Tags);
            parameters.Add("@SurveillanceAuditYears", model.SurveillanceAuditYears);
            parameters.Add("@SurveillanceDate", model.SurveillanceDate);
            parameters.Add("@FileName", model.FileName);
            parameters.Add("@FilePath", model.FilePath);
            parameters.Add("@Status", model.Status);
            parameters.Add("@Notes", model.Notes);
            parameters.Add("@Remarks", model.Remarks);
            parameters.Add("@ActionUser", model.UserAction);

            // Serialize the reminders list into a JSON string for the Stored Procedure
            var options = new System.Text.Json.JsonSerializerOptions
            {
                PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase
            };
            var remindersJson = System.Text.Json.JsonSerializer.Serialize(model.Reminders, options);
            parameters.Add("@RemindersJson", remindersJson);

            // Save certificate and reminders via SP
            var result = await _dapper.QueryFirstOrDefaultAsync<SaveResult>("usp_Transaction_Certificate_Save", parameters);

            // Save custom contacts if certificate save succeeded
            if (result != null && result.IsSuccess)
            {
                int certId = result.Result > 0 ? result.Result : model.IDCertificate;

                // Fetch updated reminders from DB to obtain their generated IDReminder keys
                var dbReminders = await _dapper.QueryAsync<CertificateReminder>(
                    "SELECT IDReminder, DaysBeforeSurveillance FROM dbo.Transaction_Certificate_Reminder WHERE IDCertificate = @IDCertificate AND (IsDelete = 0 OR IsDelete IS NULL)",
                    new { IDCertificate = certId },
                    CommandType.Text
                );

                // 📝 WRITE A DEBUG FILE TO THE DISK
                try
                {
                    string logContent = $"Time: {System.DateTime.Now}\n" +
                                        $"certId: {certId}\n" +
                                        $"dbReminders Count: {dbReminders?.Count() ?? 0}\n" +
                                        $"model.CustomContacts Count: {model.CustomContacts?.Count ?? 0}\n" +
                                        $"model.CustomContacts JSON: {System.Text.Json.JsonSerializer.Serialize(model.CustomContacts)}\n";
                    System.IO.File.WriteAllText(@"c:\Users\Admin\source\repos\QMS_Certificate_Store_Portal\debug_log.txt", logContent);
                }
                catch (Exception) { /* ignore */ }

                // 1. Delete old custom contacts for all reminders of this certificate (soft delete)
                foreach (var reminder in dbReminders)
                {
                    await _dapper.ExecuteAsync(
                        "UPDATE dbo.Transaction_Reminder_Custom_Contact SET IsDelete = 1, D_Date = GETDATE(), D_By = @ActionUser WHERE IDReminder = @IDReminder",
                        new { IDReminder = reminder.IDReminder, ActionUser = model.UserAction },
                        CommandType.Text
                    );
                }

                // 2. Insert new custom contacts for all active reminders of this certificate
                if (model.CustomContacts != null && model.CustomContacts.Any())
                {
                    foreach (var reminder in dbReminders)
                    {
                        foreach (var contact in model.CustomContacts)
                        {
                            var contactParams = new DynamicParameters();
                            contactParams.Add("@IDCustom", 0);
                            contactParams.Add("@IDReminder", reminder.IDReminder);
                            contactParams.Add("@FullName", contact.FullName);
                            contactParams.Add("@Contact", contact.Contact);
                            contactParams.Add("@IsActive", contact.IsActive ?? true);
                            contactParams.Add("@ActionUser", model.UserAction);

                            await _dapper.ExecuteAsync(
                                "usp_Transaction_Reminder_Custom_Contact_Save",
                                contactParams
                            );
                        }
                    }
                }
            }

            return result;
        }



        // 4. Soft-delete certificate and linked reminders
        public async Task<SaveResult> DeleteAsync(int id, string user)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@IDCertificate", id);
            parameters.Add("@ActionUser", user);

            return await _dapper.QueryFirstOrDefaultAsync<SaveResult>("usp_Transaction_Certificate_Delete", parameters);
        }






        // Dashboard Stats
        public async Task<DashboardStats> GetDashboardStatsAsync(
             int companyId,
            int locationId
            )
         {
            var stats = new DashboardStats();

            // =====================================
            // PARAMETERS
            // =====================================
            var parameters = new DynamicParameters();

            parameters.Add("@IDCompany", companyId);

            parameters.Add("@IDLocation", locationId);

            // =====================================
            // EXECUTE SP
            // =====================================
            var (reader, conn) = await _dapper.QueryMultipleAsync(
                "usp_Dashboard_GetStats",
                parameters
            );

            using (conn)
            using (reader)
            {
                // =====================================
                // SUMMARY
                // =====================================
                stats.Summary =
                    await reader.ReadFirstOrDefaultAsync<DashboardSummary>()
                    ?? new DashboardSummary();

                // =====================================
                // MONTHLY EXPIRIES
                // =====================================
                stats.ExpiriesNext12Months =
                    (await reader.ReadAsync<MonthlyExpiry>())
                    .ToList();

                // =====================================
                // CERTIFICATES BY TYPE
                // =====================================
                stats.CertificatesByType =
                    (await reader.ReadAsync<CertificateByType>())
                    .ToList();

                // =====================================
                // RECENTLY ADDED
                // =====================================
                stats.RecentlyAdded =
                    (await reader.ReadAsync<RecentCertificate>())
                    .ToList();
            }

            return stats;
        }


        // =====================================
        // GET PENDING REMINDERS
        // =====================================
        public async Task<IEnumerable<CertificateReminderNotification>> GetPendingRemindersAsync()
        {
            return await _dapper.QueryAsync<CertificateReminderNotification>(
                "usp_Transaction_Certificate_Reminder_GetPending"
            );
        }
        // =====================================
        // GET CUSTOM CONTACTS BY REMINDER ID
        // =====================================
        public async Task<IEnumerable<ReminderCustomContact>> GetCustomContactsByReminderAsync(int reminderId)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@IDReminder", reminderId);
            return await _dapper.QueryAsync<ReminderCustomContact>(
                "usp_Transaction_Reminder_Custom_Contact_GetByReminderId",
                parameters
            );
        }
        // =====================================
        // SAVE CUSTOM CONTACT (INSERT / UPDATE)
        // =====================================
        public async Task<int> SaveCustomContactAsync(ReminderCustomContact contact)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@IDCustom", contact.IDCustom);
            parameters.Add("@IDReminder", contact.IDReminder);
            parameters.Add("@FullName", contact.FullName);
            parameters.Add("@Contact", contact.Contact);
            parameters.Add("@IsActive", contact.IsActive ?? true);
            parameters.Add("@ActionUser", contact.IDCustom > 0 ? contact.U_By : contact.E_By);
            return await _dapper.QuerySingleAsync<int>(
                "usp_Transaction_Reminder_Custom_Contact_Save",
                parameters
            );
        }
        // =====================================
        // SOFT DELETE CUSTOM CONTACT
        // =====================================
        public async Task DeleteCustomContactAsync(int idCustom, string actionUser)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@IDCustom", idCustom);
            parameters.Add("@ActionUser", actionUser);
            await _dapper.ExecuteAsync(
                "usp_Transaction_Reminder_Custom_Contact_Delete",
                parameters
            );
        }


        // In CertificateRepo.cs (add near the bottom)
        public async Task<IEnumerable<Certificate>> GetAllDeletedAsync()
        {
            var sql = @"SELECT * FROM Certificate WHERE IsDelete = 1 AND DaysBeforeSurveillance > 0";
            return await _dapper.QueryAsync<Certificate>(sql, null);
        }

        // In UserRepo.cs (add)
        public async Task<IEnumerable<Users>> GetByChannelAsync(string channel)
        {
            var sql = @"SELECT * FROM Users WHERE Channel = @Channel";
            var p = new DynamicParameters();
            p.Add("@Channel", channel);
            return await _dapper.QueryAsync<Users>(sql, p);
        }

        public async Task<int> SaveCertificateLog(CertificateLog model)
        {
            var parameters = new DynamicParameters();

            parameters.Add("@IDCertificate", model.IDCertificate);
            parameters.Add("@IDUser", model.IDUser);
            parameters.Add("@IDDesignation", model.IDDesignation);
            parameters.Add("@IDCertificateType", model.IDCertificateType);

            var result = await _dapper.ExecuteAsync(
                "usp_Transaction_Certificate_Log_Save",
                parameters);

            return result;
        }
        public async Task<IEnumerable<CertificateLog>> GetCertificateLogs()
        {
            var result = await _dapper.QueryAsync<CertificateLog>(
                "usp_Transaction_Certificate_Log_SelectAll");

            return result;
        }
    }

}

