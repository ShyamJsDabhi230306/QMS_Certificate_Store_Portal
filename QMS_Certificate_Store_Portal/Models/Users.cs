using QMS_Certificate_Store_Portal.Models.Common;

namespace QMS_Certificate_Store_Portal.Models
{
    public class Users : AuditFields
    {
        public int IDUser { get; set; } // Match React 'idUser'
        public string? UserFullName { get; set; } // Match React 'userFullName'
        public string? UserName { get; set; } // Match React 'userName'
        public string? Password { get; set; } // Match React 'userPassword'
        public int? IDDepartment { get; set; } // Match React 'idDepartment'
        public int? IDDesignation { get; set; } // Match React 'idDesignation'
        public string? Email { get; set; }
        public string? Phone { get; set; }
        
        // Joined fields for the list view
        public string? DepartmentName { get; set; }
        public string? DesignationName { get; set; }
    }
}
