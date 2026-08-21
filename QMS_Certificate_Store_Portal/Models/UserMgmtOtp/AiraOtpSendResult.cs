using System.Text.Json.Serialization;

namespace QMS_Certificate_Store_Portal.Models.UserMgmtOtp
{
    public sealed class AiraOtpSendResult
    {
        [JsonPropertyName("idUser")]
        public int IdUser { get; set; }

        [JsonPropertyName("maskedMobile")]
        public string? MaskedMobile { get; set; }
    }
}
