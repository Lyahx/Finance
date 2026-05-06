namespace LyraBit.Core.DTOs;

public sealed record UserProfileDto(
    Guid Id,
    string Email,
    string Username,
    string FullName,
    DateTime CreatedAt,
    int AccountAgeDays,
    decimal Balance,
    string Currency);
