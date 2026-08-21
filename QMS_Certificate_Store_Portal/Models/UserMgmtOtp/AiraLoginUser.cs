using System.Text.Json.Serialization;

namespace QMS_Certificate_Store_Portal.Models.UserMgmtOtp
{
    public sealed class AiraLoginUser
    {
        [JsonPropertyName("IDUser")]
        public int IdUser { get; set; }

        [JsonPropertyName("Name")]
        public string? Name { get; set; }

        [JsonPropertyName("IDProject")]
        public int IdProject { get; set; }

        [JsonPropertyName("ProjectName")]
        public string? ProjectName { get; set; }

        [JsonPropertyName("SecurityStamp")]
        public Guid SecurityStamp { get; set; }

        [JsonPropertyName("IDUserRole")]
        public int IdUserRole { get; set; }

        [JsonPropertyName("RoleName")]
        public string? RoleName { get; set; }
    }
}
