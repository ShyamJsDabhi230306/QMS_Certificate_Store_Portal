namespace QMS_Certificate_Store_Portal.Models.Common
{
    public class AuditFields
    {
        public string? Remarks { get; set; }

        public bool? IsActive { get; set; }

        public DateTime? E_Date { get; set; }

        public string? E_By { get; set; }

        public DateTime? U_Date { get; set; }

        public string? U_By { get; set; }

        public bool? IsDelete { get; set; }

        public DateTime? D_Date { get; set; }

        public string? D_By { get; set; }
    }
}
