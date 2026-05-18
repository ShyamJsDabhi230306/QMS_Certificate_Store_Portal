using QMS_Certificate_Store_Portal.Models.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace QMS_Certificate_Store_Portal.Models
{
    public class Certificate : AuditFields
    {
        public int IDCertificate { get; set; }

        [Required]
        public string CertificateName { get; set; } = string.Empty;

        [Required]
        public string CertificateNumber { get; set; } = string.Empty;

        [Required]
        public int IDCertificateType { get; set; }

        // Lookup name joined from Stored Procedure
        public string? CertificateTypeName { get; set; }

        public int? IDOwner { get; set; }

        // Lookup name joined from Stored Procedure
        public string? OwnerName { get; set; }

        public int? IDDepartment { get; set; }

        // Lookup name joined from Stored Procedure
        public string? DepartmentName { get; set; }

        [Required]
        public DateTime IssueDate { get; set; }

        public int? ValidForYears { get; set; }

        [Required]
        public DateTime ExpiryDate { get; set; }

        public string? RenewalCategory { get; set; } = string.Empty;

        public string? Tags { get; set; }

        public string? FileName { get; set; }
        public string? FilePath { get; set; }

        public string Status { get; set; } = "Draft";

        public string? Notes { get; set; }

        // Dynamic Child reminders
        public List<CertificateReminder> Reminders { get; set; } = new List<CertificateReminder>();

        // Used to pass serialized list of reminders to the Stored Procedure
        public string? RemindersJson { get; set; }
    }

    public class CertificateReminder
    {
        public int IDReminder { get; set; }
        public int IDCertificate { get; set; }
        public int DaysBeforeExpiry { get; set; }
        public string Channel { get; set; } = string.Empty;
    }
}
