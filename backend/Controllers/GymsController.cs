using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using System.Text.Json;
using System.Collections.Generic;

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
    public async Task<IActionResult> GetGyms([FromQuery] int? ownerUserId)
    {
        var query = _context.Gyms.AsQueryable();
        if (ownerUserId.HasValue)
        {
            query = query.Where(g => g.OwnerUserId == ownerUserId.Value);
        }
        var gyms = await query.ToListAsync();
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

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateGym(int id, [FromQuery] int userId, [FromBody] Gym updatedGym)
    {
        var gym = await _context.Gyms.FindAsync(id);
        if (gym == null)
        {
            return NotFound();
        }

        if (gym.OwnerUserId != userId)
        {
            Console.WriteLine(gym.OwnerUserId);
            Console.WriteLine(userId);
            return StatusCode(403, "You are not the owner of this gym");
        }

        gym.Name = updatedGym.Name;
        gym.Address = updatedGym.Address;
        gym.Description = updatedGym.Description;
        gym.Schedule = updatedGym.Schedule;

        await _context.SaveChangesAsync();
        return Ok(gym);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGym(int id, [FromQuery] int userId)
    {
        var gym = await _context.Gyms.FindAsync(id);
        if (gym == null)
            return NotFound();
        if (gym.OwnerUserId != userId)
            return Forbid();
        _context.Gyms.Remove(gym);
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("{gymId}/join")]
    public async Task<IActionResult> JoinGym(int gymId, [FromQuery] int studentId)
    {
        var gym = await _context.Gyms.FindAsync(gymId);
        if (gym == null)
            return NotFound("Gym not found");

        // Check if student is already joined
        if (gym.Students.Contains(studentId))
            return BadRequest("Student is already a member of this gym");

        // Add student to the gym
        gym.Students = gym.Students.Append(studentId).ToArray();

        await _context.SaveChangesAsync();
        return Ok(new { message = "Successfully joined the gym" });
    }

    [HttpDelete("{gymId}/leave")]
    public async Task<IActionResult> LeaveGym(int gymId, [FromQuery] int studentId)
    {
        var gym = await _context.Gyms.FindAsync(gymId);
        if (gym == null)
            return NotFound("Gym not found");

        if (!gym.Students.Contains(studentId))
            return BadRequest("Student is not a member of this gym");

        gym.Students = gym.Students.Where(id => id != studentId).ToArray();

        await _context.SaveChangesAsync();
        return Ok(new { message = "Successfully left the gym" });
    }
} 