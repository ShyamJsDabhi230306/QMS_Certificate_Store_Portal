using System.Text.Json.Serialization;

namespace QMS_Certificate_Store_Portal.Models.UserMgmtOtp
{
    public sealed class AiraSyncUser
    {
        [JsonPropertyName("idUser")]
        public int IdUser { get; set; }

        [JsonPropertyName("employeeCode")]
        public int EmployeeCode { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("contactNo")]
        public string? ContactNo { get; set; }

        [JsonPropertyName("imageFileURL")]
        public string? ImageFileURL { get; set; }

        [JsonPropertyName("idRole")]
        public int? IdRole { get; set; }

        [JsonPropertyName("umRoleName")]
        public string? UmRoleName { get; set; }

        [JsonPropertyName("isActive")]
        public bool IsActive { get; set; }
    }
}
