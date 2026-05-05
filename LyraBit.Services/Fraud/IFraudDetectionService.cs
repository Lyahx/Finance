namespace LyraBit.Services.Fraud;

public interface IFraudDetectionService
{
    Task<int> CalculateRiskScoreAsync(
        Guid senderId,
        Guid receiverId,
        decimal amount,
        int senderAccountAgeDays,
        CancellationToken cancellationToken = default);
}
