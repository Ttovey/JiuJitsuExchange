using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GymsController : ControllerBase
{
    private readonly AppDbContext _context;
    public GymsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateGym([FromBody] Gym gym)
    {
        _context.Gyms.Add(gym);
        await _context.SaveChangesAsync();
        return Ok(gym);
    }

    [HttpGet]
    public async Task<IActionResult> GetGyms()
    {
        var gyms = await _context.Gyms.ToListAsync();
        return Ok(gyms);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetGym(int id)
    {
        var gym = await _context.Gyms.FindAsync(id);
        if (gym == null)
            return NotFound();
        return Ok(gym);
    }
} 