using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        var randomNum = new Random().Next(1, 100);
        return Ok(new { message = $"Hello from the backend! Random number: {randomNum}" });
    }
} 