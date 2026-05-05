using LyraBit.Data.Repositories;
using LyraBit.Services.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LyraBit.Services.Fraud;

public sealed class FraudDetectionService : IFraudDetectionService
{
    private readonly ITransactionRepository _txRepo;
    private readonly FraudDetectionSettings _settings;
    private readonly ILogger<FraudDetectionService> _logger;

    public FraudDetectionService(
        ITransactionRepository txRepo,
        IOptions<FraudDetectionSettings> options,
        ILogger<FraudDetectionService> logger)
    {
        _txRepo = txRepo;
        _settings = options.Value;
        _logger = logger;
    }

    public async Task<int> CalculateRiskScoreAsync(
        Guid senderId,
        Guid receiverId,
        decimal amount,
        int senderAccountAgeDays,
        CancellationToken cancellationToken = default)
    {
        if (_settings.IsExternalServiceEnabled)
        {
            _logger.LogWarning(
                "External fraud service flag enabled but HTTP integration not implemented yet, using C# fallback rules.");
        }

        var score = 0;

        if (amount >= 10_000m)
        {
            score += 30;
        }

        var hasSentBefore = await _txRepo.HasUserSentToReceiverAsync(senderId, receiverId, cancellationToken);
        if (!hasSentBefore)
        {
            score += 25;
        }

        var recentCount = await _txRepo.CountRecentByUserAsync(senderId, TimeSpan.FromHours(1), cancellationToken);
        if (recentCount >= 3)
        {
            score += 20;
        }

        if (IsLateNight(_settings.TimeZone))
        {
            score += 15;
        }

        if (amount > 1_000m && amount % 100m != 0m)
        {
            score += 10;
        }

        if (senderAccountAgeDays < 30 && amount >= 5_000m)
        {
            score += 20;
        }

        var avgSpending = await _txRepo.GetAvgSpendingAsync(senderId, TimeSpan.FromDays(180), cancellationToken);
        if (avgSpending > 0m && amount > avgSpending * 10m)
        {
            score += 25;
        }

        var finalScore = Math.Min(score, 100);

        _logger.LogInformation(
            "Risk score for transfer {SenderId} -> {ReceiverId} amount {Amount} (age {AgeDays}d, avg6m {Avg}): {Score}",
            senderId, receiverId, amount, senderAccountAgeDays, avgSpending, finalScore);

        return finalScore;
    }

    private static bool IsLateNight(string timeZoneId)
    {
        try
        {
            var tz = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
            var localHour = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, tz).Hour;
            return localHour >= 2 && localHour < 5;
        }
        catch (TimeZoneNotFoundException)
        {
            var hour = DateTime.Now.Hour;
            return hour >= 2 && hour < 5;
        }
    }
}
