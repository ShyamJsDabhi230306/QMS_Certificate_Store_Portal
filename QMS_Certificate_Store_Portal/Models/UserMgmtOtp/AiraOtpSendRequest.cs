using System.Text.Json.Serialization;

namespace QMS_Certificate_Store_Portal.Models.UserMgmtOtp
{
    public sealed class AiraOtpSendRequest
    {
        [JsonPropertyName("login")]
        public string Login { get; set; } = string.Empty;

        [JsonPropertyName("password")]
        public string Password { get; set; } = string.Empty;

        [JsonPropertyName("projectURL")]
        public string ProjectUrl { get; set; } = string.Empty;
    }
}
