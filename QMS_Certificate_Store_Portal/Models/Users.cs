using QMS_Certificate_Store_Portal.Models.Common;

namespace QMS_Certificate_Store_Portal.Models
{
    public class Users : AuditFields
    {
        public int IDUser { get; set; } // Match React 'idUser'
        public string? UserFullName { get; set; } // Match React 'userFullName'
        public string? UserName { get; set; } // Match React 'userName'
        public string? Password { get; set; } // Match React 'userPassword'
        //public int? IDDepartment { get; set; } // Match React 'idDepartment'
        public int? IDCompany { get; set; }     // matcht he idCompany
        public int? IDLocation { get; set; }    // match react idlocation
        public int? IDDesignation { get; set; } // Match React 'idDesignation'
        public string? Email { get; set; }
        public string? Phone { get; set; }
        
        // Joined fields for the list view
        //public string? DepartmentName { get; set; }
        public string? LocationName { get;set; }
        public string? CompanyName { get; set; }
        public string? DesignationName { get; set; }

        public bool IsSuperAdmin { get; set; }


        // this is the Aira user management fields, which are used to link the local user with the Aira user
        public int? IDUserManagement { get; set; }

        public Guid? AiraSecurityStamp { get; set; }

        public DateTime? AiraLastSyncUtc { get; set; }

        public string? AiraEmployeeCode { get; set; }

        public string? AiraName { get; set; }

        public string? AiraContactNo { get; set; }

        public string? AiraImageFileURL { get; set; }

        public int? AiraRoleId { get; set; }

        public string? AiraRoleName { get; set; }

        public bool? AiraIsActive { get; set; }

        public bool IsSync { get; set; }
    }

  
    public sealed class AssignDesignationRequest
    {
        public int IDUserManagement { get; set; }

        public int IDDesignation { get; set; }
    }
    

    public sealed class ImportAiraUsersRequest
    {
        public List<int> IDUserManagement { get; set; } = new();
    }
}
