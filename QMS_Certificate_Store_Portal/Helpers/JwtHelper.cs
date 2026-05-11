using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DRSPortal.Helpers
{
    public class JwtHelper
    {
        private readonly IConfiguration _config;

        public JwtHelper(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(
            int userId,
            string userName,
            string fullName,
            string role,
            int idCompany,
            int idLocation,
            int idDepartment)
        {
            var key = Encoding.UTF8.GetBytes(
                _config["Jwt:Key"] ?? throw new Exception("JWT key missing"));

            var creds = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256);

            double.TryParse(_config["Jwt:ExpiresHours"], out double hours);
            if (hours <= 0) hours = 12;

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, userId.ToString()),
                new(ClaimTypes.Name, userName),
                new("FullName", fullName),
                new(ClaimTypes.Role, role),
                new("IDCompany", idCompany.ToString()),
                new("IDLocation", idLocation.ToString()),
                new("IDDepartment", idDepartment.ToString()),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(hours),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
