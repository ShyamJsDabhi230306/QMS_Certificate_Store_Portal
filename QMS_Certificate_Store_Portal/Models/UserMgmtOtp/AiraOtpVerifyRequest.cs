using System.Text.Json.Serialization;

namespace QMS_Certificate_Store_Portal.Models.UserMgmtOtp
{
    public sealed class AiraOtpVerifyRequest
    {
        [JsonPropertyName("idUser")]
        public int IdUser { get; set; }

        [JsonPropertyName("otp")]
        public string Otp { get; set; } = string.Empty;

        [JsonPropertyName("projectURL")]
        public string ProjectUrl { get; set; } = string.Empty;
    }
}
