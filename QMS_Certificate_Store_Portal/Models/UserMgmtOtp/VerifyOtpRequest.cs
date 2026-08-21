using System.Text.Json.Serialization;

namespace QMS_Certificate_Store_Portal.Models.UserMgmtOtp
{
    public sealed class VerifyOtpRequest
    {
        [JsonPropertyName("idUser")]
        public int IdUser { get; set; }

        [JsonPropertyName("otp")]
        public string Otp { get; set; } = string.Empty;

        [JsonPropertyName("employeeCode")]
        public string EmployeeCode { get; set; } = string.Empty;
    }
}
