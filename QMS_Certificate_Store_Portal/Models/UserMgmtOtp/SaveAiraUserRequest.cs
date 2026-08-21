using System.Text.Json.Serialization;

namespace QMS_Certificate_Store_Portal.Models.UserMgmtOtp
{
    public class SaveAiraUserRequest
    {



        [JsonPropertyName("idUserManagement")]
        public int IDUserManagement { get; set; }

        [JsonPropertyName("idDesignation")]
        public int? IDDesignation { get; set; }

        [JsonPropertyName("idCompany")]
        public int? IDCompany { get; set; }

        [JsonPropertyName("idLocation")]
        public int? IDLocation { get; set; }

        [JsonPropertyName("email")]
        public string? Email { get; set; }
    }
}
