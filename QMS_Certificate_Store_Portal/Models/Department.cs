using QMS_Certificate_Store_Portal.Models.Common;

namespace QMS_Certificate_Store_Portal.Models
{
    public class Department : AuditFields
    {
        public int IDDepartment { get; set; }
        public int IDLocation { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public string? LocationName { get; set; } // Joined field
    }
}
