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
        //public DateTime? CreatedOn { get; set; }
        public int? AiraCompanyId { get; set; }

        public string? CompanyCode { get; set; }

        public string? FactoryAddress { get; set; }

        public string? City { get; set; }

        public string? State { get; set; }

        public string? Country { get; set; }

        public string? Pincode { get; set; }

        public string? LogoFileName { get; set; }

        public string? LogoBase64 { get; set; }

        public DateTime? AiraLastSyncUtc { get; set; }

        public bool? IsAiraSynced { get; set; }
        public bool? IsActive { get; set; }

    }
}
