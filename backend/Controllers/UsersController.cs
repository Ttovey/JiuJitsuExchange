using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;
    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
    {   
        // log username and email
        Console.WriteLine("Registering user...");
        Console.WriteLine($"Username: {dto.Username}, Email: {dto.Email}");
        
        if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
            return BadRequest(new { message = "Username already exists" });

        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest(new { message = "Email already exists" });

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = HashPassword(dto.Password),
            Type = dto.Type
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok(new { message = "User created" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);
        if (user == null || user.PasswordHash != HashPassword(dto.Password))
            return Unauthorized(new { message = "Invalid username or password" });
        return Ok(new { message = "Login successful" });
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);
        if (user == null || user.PasswordHash != HashPassword(dto.OldPassword))
            return Unauthorized(new { message = "Invalid password" });

        user.PasswordHash = HashPassword(dto.NewPassword);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Password changed successfully" });
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser([FromQuery] string username)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null)
            return NotFound(new { message = "User not found" });
        return Ok(new { user.Username, user.Email, user.Type });
    }

    // Hash the password using SHA256
    // TO-DO: Use a more secure hashing algorithm
    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }
}

public class UserRegisterDto
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
}

public class UserLoginDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class ChangePasswordDto
{
    public string Username { get; set; } = string.Empty;
    public string OldPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
} 