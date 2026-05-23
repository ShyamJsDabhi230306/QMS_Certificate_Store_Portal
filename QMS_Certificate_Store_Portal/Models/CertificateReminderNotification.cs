namespace QMS_Certificate_Store_Portal.Models
{
    public class CertificateReminderNotification
    {
        // =====================================
        // REMINDER
        // =====================================
        public int IDReminder { get; set; }

        public int IDCertificate { get; set; }

        public int DaysBeforeExpiry { get; set; }

        public string Channel { get; set; }

        public bool ReminderSent { get; set; }

        public DateTime? ReminderSentDate { get; set; }

        // =====================================
        // CERTIFICATE
        // =====================================
        public string CertificateName { get; set; }

        public string CertificateNumber { get; set; }

        public DateTime ExpiryDate { get; set; }

        public string Status { get; set; }

        // =====================================
        // OWNER
        // =====================================
        public int IDUser { get; set; }

        public string UserFullName { get; set; }

        public string Email { get; set; }

        // =====================================
        // TYPE
        // =====================================
        public string CertificateTypeName { get; set; }

        // =====================================
        // COMPANY
        // =====================================
        public int IDCompany { get; set; }

        public string CompanyName { get; set; }

        // =====================================
        // LOCATION
        // =====================================
        public int IDLocation { get; set; }

        public string LocationName { get; set; }

        // =====================================
        // REMINDER INFO
        // =====================================
        public DateTime ReminderTriggerDate { get; set; }

        public int DaysLeft { get; set; }
    }
}
