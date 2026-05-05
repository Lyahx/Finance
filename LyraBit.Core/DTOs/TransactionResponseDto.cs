using LyraBit.Core.Enums;

namespace LyraBit.Core.DTOs;

public sealed record TransactionResponseDto(
    Guid Id,
    string SenderUsername,
    string ReceiverUsername,
    decimal Amount,
    string Currency,
    string? Description,
    TransactionStatus Status,
    int? RiskScore,
    string? Category,
    DateTime CreatedAt,
    string? IpAddress,
    string? DeviceId,
    string? Channel,
    int SenderAccountAgeDays);
