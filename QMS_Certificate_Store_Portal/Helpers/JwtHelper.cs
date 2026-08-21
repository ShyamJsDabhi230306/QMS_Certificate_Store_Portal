//using Microsoft.IdentityModel.Tokens;
//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;
//using System.Text;

//namespace QMS_Certificate_Store_Portal.Helpers
//{
//    public class JwtHelper
//    {
//        private readonly IConfiguration _config;

//        public JwtHelper(IConfiguration config)
//        {
//            _config = config;
//        }

//        public string GenerateToken(
//            int userId,
//            string userName,
//            string fullName,
//            string role,
//            int idCompany,
//            int idLocation,
//            //int idDepartment,
//            bool isSuperAdmin)
//        {
//            var key = Encoding.UTF8.GetBytes(
//                _config["Jwt:Key"] ?? throw new Exception("JWT key missing"));

//            var creds = new SigningCredentials(
//                new SymmetricSecurityKey(key),
//                SecurityAlgorithms.HmacSha256);

//            double.TryParse(_config["Jwt:ExpiresHours"], out double hours);
//            if (hours <= 0) hours = 12;

//            var claims = new List<Claim>
//            {
//                new(ClaimTypes.NameIdentifier, userId.ToString()),
//                new(ClaimTypes.Name, userName),
//                new(ClaimTypes.Role, role),
//                new("UserFullName", fullName),
//                new("IDCompany", idCompany.ToString()),
//                new("IDLocation", idLocation.ToString()),
//                //new("IDDepartment", idDepartment.ToString()),
//                new("IsSuperAdmin", isSuperAdmin.ToString()),
//                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
//            };

//            var token = new JwtSecurityToken(
//                issuer: _config["Jwt:Issuer"],
//                audience: _config["Jwt:Audience"],
//                claims: claims,
//                expires: DateTime.UtcNow.AddHours(hours),
//                signingCredentials: creds
//            );

//            return new JwtSecurityTokenHandler().WriteToken(token);
//        }
//    }
//}


using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace QMS_Certificate_Store_Portal.Helpers;

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
        bool isSuperAdmin,
        int? airaUserId = null,
        Guid? airaSecurityStamp = null)
    {
        var jwtKey = _config["Jwt:Key"]
            ?? throw new Exception("JWT key missing");

        var key = Encoding.UTF8.GetBytes(jwtKey);

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256);

        double.TryParse(
            _config["Jwt:ExpiresHours"],
            out var hours);

        if (hours <= 0)
        {
            hours = 12;
        }

        var claims = new List<Claim>
        {
            new(
                ClaimTypes.NameIdentifier,
                userId.ToString()),

            new(
                ClaimTypes.Name,
                userName),

            new(
                ClaimTypes.Role,
                role),

            new(
                "UserFullName",
                fullName),

            new(
                "IDCompany",
                idCompany.ToString()),

            new(
                "IDLocation",
                idLocation.ToString()),

            new(
                "IsSuperAdmin",
                isSuperAdmin.ToString()),

            new(
                JwtRegisteredClaimNames.Jti,
                Guid.NewGuid().ToString())
        };

        if (airaUserId.HasValue)
        {
            claims.Add(
                new Claim(
                    "umid",
                    airaUserId.Value.ToString()));
        }

        if (airaSecurityStamp.HasValue)
        {
            claims.Add(
                new Claim(
                    "ums",
                    airaSecurityStamp.Value.ToString()));
        }

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(hours),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}