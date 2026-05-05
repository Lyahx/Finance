using LyraBit.Core.Enums;

namespace LyraBit.Core.Entities;

public class Transaction
{
    public Guid Id { get; set; }

    public Guid SenderId { get; set; }

    public Guid ReceiverId { get; set; }

    public decimal Amount { get; set; }

    public string Currency { get; set; } = "TRY";

    public string? Description { get; set; }

    public TransactionStatus Status { get; set; }

    public int? RiskScore { get; set; }

    // Python data servisi dolduracak
    public string? Category { get; set; }

    public DateTime CreatedAt { get; set; }

    // Navigation
    public User Sender { get; set; } = null!;

    public User Receiver { get; set; } = null!;
}
