namespace LyraBit.Core.DTOs;

public sealed record WalletDto(
    Guid UserId,
    decimal Balance,
    string Currency);
