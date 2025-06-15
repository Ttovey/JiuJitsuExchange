using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WaiversController : ControllerBase
{
    private readonly AppDbContext _context;

    public WaiversController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> SignWaiver([FromBody] Waiver waiver)
    {
        // Check if user has already signed waiver for this gym
        var existingWaiver = await _context.Waivers
            .FirstOrDefaultAsync(w => w.UserId == waiver.UserId && w.GymId == waiver.GymId);

        if (existingWaiver != null)
        {
            return BadRequest("Waiver already signed for this gym");
        }

        waiver.SignedDate = DateTime.UtcNow;
        _context.Waivers.Add(waiver);
        await _context.SaveChangesAsync();
        
        return Ok(new { message = "Waiver signed successfully" });
    }

    [HttpGet("check")]
    public async Task<IActionResult> CheckWaiverSigned([FromQuery] int userId, [FromQuery] int gymId)
    {
        var waiver = await _context.Waivers
            .FirstOrDefaultAsync(w => w.UserId == userId && w.GymId == gymId);

        return Ok(new { signed = waiver != null });
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserWaivers(int userId)
    {
        var waivers = await _context.Waivers
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.SignedDate)
            .ToListAsync();

        return Ok(waivers);
    }

    [HttpGet("gym/{gymId}")]
    public async Task<IActionResult> GetGymWaivers(int gymId)
    {
        var waivers = await _context.Waivers
            .Where(w => w.GymId == gymId)
            .OrderByDescending(w => w.SignedDate)
            .ToListAsync();

        return Ok(waivers);
    }
} 