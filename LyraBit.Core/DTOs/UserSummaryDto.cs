namespace LyraBit.Core.DTOs;

public sealed record UserSummaryDto(
    Guid Id,
    string Username,
    string FullName);
