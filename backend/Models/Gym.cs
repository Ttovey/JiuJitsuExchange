namespace backend.Models;

public class Gym
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Schedule { get; set; } = string.Empty;
    public int[] Students { get; set; } = Array.Empty<int>();
    public int OwnerUserId { get; set; }
} 