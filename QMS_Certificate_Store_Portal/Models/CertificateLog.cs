namespace QMS_Certificate_Store_Portal.Models
{
    public class CertificateLog
    {
     
            public int IDLog { get; set; }

            public int? IDCertificate { get; set; }
            public int? IDUser { get; set; }
            public int? IDDesignation { get; set; }
            public int? IDCertificateType { get; set; }

        public string? CertificateNumber { get; set; }

        public string? CertificateName { get; set; }

        public string? CertificateTypeName { get; set; }

        public string? UserFullName { get; set; }

        public string? DesignationName { get; set; }

        public DateTime? LogDate { get; set; }
            public TimeSpan? LogTime { get; set; }
        
    }
}
