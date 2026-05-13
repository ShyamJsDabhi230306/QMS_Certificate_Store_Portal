using QMS_Certificate_Store_Portal.Models.Common;

namespace QMS_Certificate_Store_Portal.Models
{
    public class Location : AuditFields
    {
        public int IDLocation { get; set; }
        public int IDCompany { get; set; }
        public string LocationName { get; set; } = string.Empty;
        
        // Joined field for display
        public string? CompanyName { get; set; }
    }
}
