namespace LyraBit.Core.DTOs;

public sealed record NotificationDto(
    string Id,
    string Type,        // "fraud" | "received" | "monthly_summary" | "subscription"
    string Title,
    string Body,
    DateTime CreatedAt,
    bool Unread,
    int? RiskScore,
    Guid? TransactionId);
