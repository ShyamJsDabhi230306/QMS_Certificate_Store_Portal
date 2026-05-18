using QMS_Certificate_Store_Portal.Models.Common;

namespace QMS_Certificate_Store_Portal.Models
{
    public class CertificateType : AuditFields
    {
        public int IDCertificateType { get; set; }
        public string CertificateTypeName { get; set; } = string.Empty;
    }
}
