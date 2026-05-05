namespace LyraBit.Core.DTOs;

public sealed record AuthResponseDto(
    string Token,
    Guid UserId,
    string Username,
    DateTime ExpiresAt);
