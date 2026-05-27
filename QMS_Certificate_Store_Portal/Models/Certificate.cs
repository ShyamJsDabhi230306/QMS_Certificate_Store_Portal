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
        public int? IDCompany { get; set; }

        public int? IDLocation { get; set; }
        // Lookup name joined from Stored Procedure
        public string? DepartmentName { get; set; }

        [Required]
        public DateTime IssueDate { get; set; }

        public int? ValidForYears { get; set; }

        [Required]
        public DateTime ExpiryDate { get; set; }

        public string? RenewalCategory { get; set; } = string.Empty;

        public string? Tags { get; set; }
        public int? SurveillanceAuditYears { get; set; }
        public DateTime? SurveillanceDate { get; set; }

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
        //public int DaysBeforeExpiry { get; set; }
        public DateTime CreatedOn { get; set; }
        public int DaysBeforeSurveillance { get; set; }
        public string Channel { get; set; } = string.Empty;
    }
}



















// --- DASHBOARD MODELS ---
public class DashboardStats
{
    public DashboardSummary Summary { get; set; } = new DashboardSummary();
    public List<MonthlyExpiry> ExpiriesNext12Months { get; set; } = new List<MonthlyExpiry>();
    public List<CertificateByType> CertificatesByType { get; set; } = new List<CertificateByType>();
    public List<RecentCertificate> RecentlyAdded { get; set; } = new List<RecentCertificate>();
}

public class DashboardSummary
{
    public int TotalCertificates { get; set; }
    public int ValidCertificates { get; set; }
    public int ExpiringIn60Days { get; set; }
    public int ExpiredCertificates { get; set; }
}

public class MonthlyExpiry
{
    public string MonthName { get; set; } = string.Empty;
    public int MonthNumber { get; set; }
    public int YearNumber { get; set; }
    public int Count { get; set; }
}

public class CertificateByType
{
    public string TypeName { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class RecentCertificate
{
    public int IDCertificate { get; set; }
    public string CertificateName { get; set; } = string.Empty;
    public string CertificateNumber { get; set; } = string.Empty;
    public string CertificateTypeName { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime SurveillanceDate { get; set; }
}
