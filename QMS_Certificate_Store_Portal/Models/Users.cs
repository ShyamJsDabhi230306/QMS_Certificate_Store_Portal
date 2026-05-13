using QMS_Certificate_Store_Portal.Models.Common;

namespace QMS_Certificate_Store_Portal.Models
{
    public class Users : AuditFields
    {
        public int idUser { get; set; } // Match React 'idUser'
        public string? userFullName { get; set; } // Match React 'userFullName'
        public string? userName { get; set; } // Match React 'userName'
        public string? userPassword { get; set; } // Match React 'userPassword'
        public int? idDepartment { get; set; } // Match React 'idDepartment'
        public int? idDesignation { get; set; } // Match React 'idDesignation'
        public string? email { get; set; }
        public string? phone { get; set; }
        
        // Joined fields for the list view
        public string? departmentName { get; set; }
        public string? designationName { get; set; }
    }
}
