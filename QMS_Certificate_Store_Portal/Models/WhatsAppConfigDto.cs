namespace QMS_Certificate_Store_Portal.Models
{
    public class WhatsAppConfigDto
    {
        public int IDWhatsAppConfig { get; set; }

        public string Provider { get; set; }

        public string BaseUrl { get; set; }

        public string Token { get; set; }

        public string SenderName { get; set; }

        public string TemplateToken { get; set; }

        public string TemplateNamespace { get; set; }

        public bool IsActive { get; set; }
    }
}
