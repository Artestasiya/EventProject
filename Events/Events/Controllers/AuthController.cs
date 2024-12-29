using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Events.Core.Models;
using Events.DataAccess;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Identity;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest model)
    {
        var loggin = await _context.Loggin.SingleOrDefaultAsync(l => l.email == model.Email);

        var passwordHasher = new PasswordHasher<Loggin>();
        if (loggin == null || passwordHasher.VerifyHashedPassword(loggin, loggin.password, model.Password) != PasswordVerificationResult.Success)
        {
            return Unauthorized("Invalid email or password.");
        }


        // Generate JWT token
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, loggin.email),
                // Вы можете добавить больше данных, если требуется
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return Ok(new { Token = tokenHandler.WriteToken(token) });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] string refreshToken)
    {
        var storedToken = await _context.RefreshTokens.SingleOrDefaultAsync(r => r.Token == refreshToken);

        if (storedToken == null || storedToken.Expiration < DateTime.UtcNow || storedToken.IsRevoked)
        {
            return Unauthorized("Invalid or expired refresh token.");
        }

        // Генерация нового токена
        var email = storedToken.Email;
        var jwtToken = GenerateJwtToken(email);

        // Обновление Refresh токена
        storedToken.Token = GenerateRefreshToken();
        storedToken.Expiration = DateTime.UtcNow.AddDays(7);
        _context.RefreshTokens.Update(storedToken);
        await _context.SaveChangesAsync();

        return Ok(new { Token = jwtToken, RefreshToken = storedToken.Token });
    }

    private string GenerateJwtToken(string email)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, email) }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        return Convert.ToBase64String(Guid.NewGuid().ToByteArray());
    }

}
