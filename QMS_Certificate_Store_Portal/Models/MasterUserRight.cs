using QMS_Certificate_Store_Portal.Models.Common;
using System.Text.Json.Serialization;

namespace QMS_Certificate_Store_Portal.Models
{
    public class MasterUserRight : AuditFields
    {
        public int IDRight { get; set; }
       [JsonPropertyName("idUser")] // <--- Add this
        public int IDUser { get; set; }
        [JsonPropertyName("idPage")] // <--- Add this
        public int IDPage { get; set; }
        public string PageName { get; set; } = string.Empty;
        [JsonPropertyName("canView")] // <--- Add this
        public bool CanView { get; set; }
        [JsonPropertyName("canCreate")] // <--- Add this
        public bool CanCreate { get; set; }
        [JsonPropertyName("canEdit")] // <--- Add this
        public bool CanEdit { get; set; }
        [JsonPropertyName("canDelete")] // <--- Add this
        public bool CanDelete { get; set; }
    }
}
