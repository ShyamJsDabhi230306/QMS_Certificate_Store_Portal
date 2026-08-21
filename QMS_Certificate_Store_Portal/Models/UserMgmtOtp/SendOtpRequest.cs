using System.Text.Json.Serialization;

namespace QMS_Certificate_Store_Portal.Models.UserMgmtOtp
{
    public sealed class SendOtpRequest
    {
        [JsonPropertyName("employeeCode")]
        public string EmployeeCode { get; set; } = string.Empty;

        [JsonPropertyName("password")]
        public string Password { get; set; } = string.Empty;
    }
}
