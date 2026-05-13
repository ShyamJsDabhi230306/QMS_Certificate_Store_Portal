using QMS_Certificate_Store_Portal.Models.Common;

namespace QMS_Certificate_Store_Portal.Models
{
    public class Designation : AuditFields
    {
        public int IDDesignation { get; set; }
        public string DesignationName { get; set; } = string.Empty;
    }
}
