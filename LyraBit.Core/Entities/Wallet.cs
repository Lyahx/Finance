namespace LyraBit.Core.Entities;

public class Wallet
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public decimal Balance { get; set; }

    public string Currency { get; set; } = "TRY";

    public DateTime CreatedAt { get; set; }

    public User User { get; set; } = null!;
}
