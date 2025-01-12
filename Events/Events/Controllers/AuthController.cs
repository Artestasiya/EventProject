using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly JwtService _jwtService;

    public AuthController(AuthService authService, JwtService jwtService)
    {
        _authService = authService;
        _jwtService = jwtService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest model)
    {
        var user = await _authService.ValidateUser(model.Email, model.Password);
        if (user == null)
        {
            return Unauthorized("Invalid email or password.");
        }

        var jwtToken = _jwtService.GenerateJwtToken(user.email);
        var refreshToken = Convert.ToBase64String(Guid.NewGuid().ToByteArray());

        await _authService.SaveRefreshToken(user.email, refreshToken);

        return Ok(new { Token = jwtToken, RefreshToken = refreshToken });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] string refreshToken)
    {
        var email = await _authService.ValidateRefreshToken(refreshToken);
        if (email == null)
        {
            return Unauthorized("Invalid or expired refresh token.");
        }

        var newJwtToken = _jwtService.GenerateJwtToken(email);
        return Ok(new { Token = newJwtToken });
    }
}