using System.Security.Claims;

namespace Airmax_Payroll_System.Helpers
{
    public static class ClaimsExtensions
    {
        // 🏢 Shortcut for getting Company ID
        public static int GetIDCompany(this ClaimsPrincipal user) =>
            int.Parse(user.FindFirst("IDCompany")?.Value ?? "0");
        // 📍 Shortcut for getting Location ID
        public static int GetIDLocation(this ClaimsPrincipal user) =>
            int.Parse(user.FindFirst("IDLocation")?.Value ?? "0");
        // 📂 Shortcut for getting Department ID
        public static int GetIDDepartment(this ClaimsPrincipal user) =>
            int.Parse(user.FindFirst("IDDepartment")?.Value ?? "0");
        // 🛂 Check if the current user is an Admin
        public static bool IsAdmin(this ClaimsPrincipal user) =>
            (user.FindFirstValue(ClaimTypes.Role) ?? "").Equals("Admin", StringComparison.OrdinalIgnoreCase);

        public static int GetIDDivision(this ClaimsPrincipal user) =>
    int.Parse(user.FindFirst("IDDivision")?.Value ?? "0");
    }
}
