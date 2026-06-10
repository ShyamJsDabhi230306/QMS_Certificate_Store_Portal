namespace QMS_Certificate_Store_Portal.Models
{
    public class NotificationRecipientDto
    {
        public int IDUser { get; set; }

        public string UserFullName { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string RoleType { get; set; }
    }
}
