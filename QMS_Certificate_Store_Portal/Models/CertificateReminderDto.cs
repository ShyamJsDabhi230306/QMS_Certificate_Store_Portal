namespace QMS_Certificate_Store_Portal.Models
{
    public class CertificateReminderDto
    {
        public int IDReminder { get; set; }

        public int IDCertificate { get; set; }

        public int DaysBeforeSurveillance { get; set; }

        public string CertificateName { get; set; }

        public string CertificateNumber { get; set; }
        public string CertificateTypeName { get; set; }

        public DateTime? SurveillanceDate { get; set; }
        public DateTime? ExpiryDate { get; set; }

        public string E_By { get; set; }
    }
}
