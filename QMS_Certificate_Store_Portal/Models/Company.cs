using QMS_Certificate_Store_Portal.Models.Common;

namespace QMS_Certificate_Store_Portal.Models
{
    public class Company : AuditFields
    {
        public int IDCompany { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? ContactNo { get; set; }
        public string? Email { get; set; }
        public string? PanNo { get; set; }
        public string? GSTNo { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
}
