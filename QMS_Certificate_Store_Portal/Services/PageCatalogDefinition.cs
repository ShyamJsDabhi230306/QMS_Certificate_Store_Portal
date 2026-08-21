namespace QMS_Certificate_Store_Portal.Services
{
    public sealed record PageCatalogItem(
     string PageCode,
     string PageName,
     string? Remarks = null
        );

    public static class PageCatalogDefinition
    {
        public static IReadOnlyList<PageCatalogItem> Items { get; } =
            new List<PageCatalogItem>
            {
            new("COMPANY", "Company"),
            new("LOCATION", "Location"),
            new("DEPARTMENT", "Department"),
            new("DESIGNATION", "Designation"),
            new("USER", "User"),
            new("DASHBOARD", "Dashboard"),
            new("USER_RIGHTS", "UserRight"),
            new("PAGE_MASTER", "Page"),
            new("CERTIFICATE_TYPE", "Certificate Type"),
            new("CERTIFICATE", "Certificate"),
            new("APPROVAL", "Approval"),
            new("REMINDER_CENTER", "Reminder Center")
            };
    }


}
