using Events.Core.Models;
using Events.DataAccess;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class AuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<Loggin?> ValidateUser(string email, string password)
    {
        var user = await _context.Loggin.SingleOrDefaultAsync(l => l.email == email);
        if (user == null) return null;

        var passwordHasher = new PasswordHasher<Loggin>();
        return passwordHasher.VerifyHashedPassword(user, user.password, password) == PasswordVerificationResult.Success ? user : null;
    }

    public async Task<string?> ValidateRefreshToken(string token)
    {
        var storedToken = await _context.RefreshTokens.SingleOrDefaultAsync(r => r.Token == token);
        if (storedToken == null || storedToken.Expiration < DateTime.UtcNow || storedToken.IsRevoked)
        {
            return null;
        }

        storedToken.Token = GenerateRefreshToken();
        storedToken.Expiration = DateTime.UtcNow.AddDays(7);
        _context.RefreshTokens.Update(storedToken);
        await _context.SaveChangesAsync();

        return storedToken.Token;
    }

    public async Task SaveRefreshToken(string email, string refreshToken)
    {
        var token = new RefreshToken
        {
            Email = email,
            Token = refreshToken,
            Expiration = DateTime.UtcNow.AddDays(7),
            IsRevoked = false
        };
        _context.RefreshTokens.Add(token);
        await _context.SaveChangesAsync();
    }

    private string GenerateRefreshToken()
    {
        return Convert.ToBase64String(Guid.NewGuid().ToByteArray());
    }
}