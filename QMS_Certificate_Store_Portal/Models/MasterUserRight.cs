using QMS_Certificate_Store_Portal.Models.Common;
using System.Text.Json.Serialization;

namespace QMS_Certificate_Store_Portal.Models
{
    public class MasterUserRight : AuditFields
    {
        public int IDRight { get; set; }

        // USER / DESIGNATION

        [JsonPropertyName("idUser")]
        public int IDUser { get; set; }

        [JsonPropertyName("idDesignation")]
        public int IDDesignation { get; set; }

        // PAGE

        [JsonPropertyName("idPage")]
        public int IDPage { get; set; }

        [JsonPropertyName("pageName")]
        public string PageName { get; set; } = string.Empty;

        [JsonPropertyName("pageCode")]
        public string PageCode { get; set; } = string.Empty;

        // RIGHTS

        [JsonPropertyName("canView")]
        public bool CanView { get; set; }

        [JsonPropertyName("canCreate")]
        public bool CanCreate { get; set; }

        [JsonPropertyName("canEdit")]
        public bool CanEdit { get; set; }

        [JsonPropertyName("canDelete")]
        public bool CanDelete { get; set; }

        [JsonPropertyName("hasUserOverride")]
        public bool HasUserOverride { get; set; }
    }
}