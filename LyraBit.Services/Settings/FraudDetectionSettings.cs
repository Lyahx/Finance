namespace LyraBit.Services.Settings;

public sealed class FraudDetectionSettings
{
    public const string SectionName = "FraudDetection";

    public bool IsExternalServiceEnabled { get; set; }

    public string? ExternalServiceUrl { get; set; }

    public string TimeZone { get; set; } = "Europe/Istanbul";

    public int FlaggedThreshold { get; set; } = 70;
}
