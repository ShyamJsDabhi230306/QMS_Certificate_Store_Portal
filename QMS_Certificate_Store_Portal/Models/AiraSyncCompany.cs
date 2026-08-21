using System.Text.Json.Serialization;

namespace QMS_Certificate_Store_Portal.Models
{
    public class AiraSyncCompany
    {

        [JsonPropertyName("idCompany")]
        public int IDCompany { get; set; }

        [JsonPropertyName("companyCode")]
        public string? CompanyCode { get; set; }

        [JsonPropertyName("companyName")]
        public string? CompanyName { get; set; }

        [JsonPropertyName("gstin")]
        public string? GSTIN { get; set; }

        [JsonPropertyName("pan")]
        public string? PAN { get; set; }

        [JsonPropertyName("officeAddress")]
        public string? OfficeAddress { get; set; }

        [JsonPropertyName("factoryAddress")]
        public string? FactoryAddress { get; set; }

        [JsonPropertyName("city")]
        public string? City { get; set; }

        [JsonPropertyName("state")]
        public string? State { get; set; }

        [JsonPropertyName("country")]
        public string? Country { get; set; }

        [JsonPropertyName("pincode")]
        public string? Pincode { get; set; }

        [JsonPropertyName("contactNo")]
        public string? ContactNo { get; set; }

        [JsonPropertyName("logoFileName")]
        public string? LogoFileName { get; set; }

        [JsonPropertyName("logoBase64")]
        public string? LogoBase64 { get; set; }

        [JsonPropertyName("isActive")]
        public bool IsActive { get; set; }


        public bool IsSelected { get; set; }
    }

    public sealed class SyncAiraCompanyRequest
    {
        public int IDCompany { get; set; }
    }
}
