using Dapper;
using QMS_Certificate_Store_Portal.Helpers;
using QMS_Certificate_Store_Portal.Models;
using QMS_Certificate_Store_Portal.Models.Common;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace QMS_Certificate_Store_Portal.Repositories
{
    public class CertificateRepo
    {
        private readonly IDapperHelper _dapper;
        public CertificateRepo(IDapperHelper dapper) => _dapper = dapper;

        // 1. Fetch all active certificates for the grid list
        public async Task<IEnumerable<Certificate>> GetAllAsync()
        {
            return await _dapper.QueryAsync<Certificate>("usp_Transaction_Certificate_SelectAll", null);
        }

        // 2. Fetch single certificate with its reminders using high-performance Multi-Result reading
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
                    var reminders = await reader.ReadAsync<CertificateReminder>();
                    certificate.Reminders = reminders.ToList();
                }
                return certificate;
            }
        }

        // 3. Save (Insert/Update) Certificate with reminders passed as JSON
        public async Task<SaveResult> SaveAsync(Certificate model)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@IDCertificate", model.IDCertificate);
            parameters.Add("@CertificateName", model.CertificateName);
            parameters.Add("@CertificateNumber", model.CertificateNumber);
            parameters.Add("@IDCertificateType", model.IDCertificateType);
            parameters.Add("@IDOwner", model.IDOwner);
            parameters.Add("@IDDepartment", model.IDDepartment);
            parameters.Add("@IssueDate", model.IssueDate);
            parameters.Add("@ValidForYears", model.ValidForYears);
            parameters.Add("@ExpiryDate", model.ExpiryDate);
            parameters.Add("@RenewalCategory", model.RenewalCategory);
            parameters.Add("@Tags", model.Tags);
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
            parameters.Add("@RemindersJson", remindersJson); // <-- 

            return await _dapper.QueryFirstOrDefaultAsync<SaveResult>("usp_Transaction_Certificate_Save", parameters);
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
        public async Task<DashboardStats> GetDashboardStatsAsync()
        {
            var stats = new DashboardStats();

            var (reader, conn) = await _dapper.QueryMultipleAsync("usp_Dashboard_GetStats", null);
            using (conn)
            using (reader)
            {
                stats.Summary = await reader.ReadFirstOrDefaultAsync<DashboardSummary>() ?? new DashboardSummary();
                stats.ExpiriesNext12Months = (await reader.ReadAsync<MonthlyExpiry>()).ToList();
                stats.CertificatesByType = (await reader.ReadAsync<CertificateByType>()).ToList();
                stats.RecentlyAdded = (await reader.ReadAsync<RecentCertificate>()).ToList();
            }

            return stats;
        }

    }
}
