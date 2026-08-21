using QMS_Certificate_Store_Portal.Models.Common;

namespace QMS_Certificate_Store_Portal.Models
{
    public class MasterPage : AuditFields
    {
        public int IDPage { get; set; } // Consistent with IDCompany / IDUser
        public string PageName { get; set; } = string.Empty;
        public string PageCode { get; set; } = string.Empty;
    }
}
