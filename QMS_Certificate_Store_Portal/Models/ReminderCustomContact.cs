namespace QMS_Certificate_Store_Portal.Models
{
    public class ReminderCustomContact
    {
        public int IDCustom { get; set; }   // primary key (you rarely need it)
        public int IDReminder { get; set; }   // links to the reminder
        public string FullName { get; set; }
        public string Contact { get; set; }   // phone / WhatsApp number
        public bool? IsActive { get; set; }
        // audit fields (optional)
        public DateTime? E_Date { get; set; }
        public string? E_By { get; set; }
        public DateTime? U_Date { get; set; }
        public string? U_By { get; set; }
        public bool? IsDelete { get; set; }
        public DateTime? D_Date { get; set; }
        public string? D_By { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
}
