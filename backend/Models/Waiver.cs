namespace backend.Models;

public class Waiver
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int GymId { get; set; }
    public string SignatureData { get; set; } = string.Empty; // Base64 encoded signature image
    public DateTime SignedDate { get; set; }
    public string WaiverText { get; set; } = string.Empty;
}
