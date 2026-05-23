using System;
using QMS_Certificate_Store_Portal.Models.Common;

namespace QMS_Certificate_Store_Portal.Models
{
    /// <summary>
    /// Represents a row in dbo.Trasaction_Certificate_Approval.
    /// </summary>
    public class TransactionCertificateApproval : AuditFields
    {
        public int IDTrasaction_Certificate_Approval { get; set; }   // PK
        public int IDCertificate { get; set; }                     // FK → Certificate
        public int ApprovedBy { get; set; }
        public string ApprovalStatus { get; set; } = string.Empty;   // Approved / Rejected / Pending
        public string? ApprovalComment { get; set; }
        public DateTime ApprovalDate { get; set; }
        public int ApprovalLevel { get; set; }
        // Navigation property (optional – makes EF Core happy)
        public Certificate? Certificate { get; set; }
        // --- LOOKUP & JOINED FIELDS (Mapped by Dapper) ---
        public string? CertificateName { get; set; }
        public string? CertificateNumber { get; set; }
        public string? CertificateTypeName { get; set; }
        public string? OwnerName { get; set; }
        public string? DepartmentName { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public DateTime? IssueDate { get; set; }
        public string? FileName { get; set; }
        public string? FilePath { get; set; }
        public string? Notes { get; set; }
    }
}
