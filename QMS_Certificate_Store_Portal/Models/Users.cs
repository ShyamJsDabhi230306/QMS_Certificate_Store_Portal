using QMS_Certificate_Store_Portal.Models.Common;

namespace QMS_Certificate_Store_Portal.Models
{
    public class Users: AuditFields
    {
        public int IDUser { get; set; }
        public string? UserFullName { get; set; }
        public string? Email { get; set; }
        public int? IDDesignation { get; set; }
        public int? IDDepartment { get; set; }
        public string? userName { get; set; }
        public string? Password { get; set; }
        public string? Phone { get; set; }
        public DateTime? Login_At { get; set; }
        public string? DepartmentName { get; set; }
        public string? DesignationName { get; set; }
    }
}
