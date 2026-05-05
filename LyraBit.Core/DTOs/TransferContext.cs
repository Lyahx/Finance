namespace LyraBit.Core.DTOs;

public sealed record TransferContext(
    string? IpAddress,
    string? DeviceId,
    string? Channel);
