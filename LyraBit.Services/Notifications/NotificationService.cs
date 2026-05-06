using System.Globalization;
using LyraBit.Core.DTOs;
using LyraBit.Core.Enums;
using LyraBit.Data.Repositories;

namespace LyraBit.Services.Notifications;

/// <summary>
/// Bildirimler ayrı tablo olarak persist edilmiyor — son işlemlerden türetiliyor.
/// Sender açısından flagged işlemler, receiver açısından son 48 saat içinde alınanlar
/// ve bu ayın özeti karışık liste olarak döner.
/// </summary>
public sealed class NotificationService : INotificationService
{
    private static readonly TimeSpan ReceivedWindow = TimeSpan.FromHours(48);

    private readonly ITransactionRepository _txRepo;

    public NotificationService(ITransactionRepository txRepo)
    {
        _txRepo = txRepo;
    }

    public async Task<List<NotificationDto>> GetForUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var all = await _txRepo.GetByUserIdAsync(userId, cancellationToken);
        var now = DateTime.UtcNow;
        var notifs = new List<NotificationDto>();

        // 1) Flagged işlemler (sender)
        var flagged = all
            .Where(t => t.SenderId == userId && t.Status == TransactionStatus.FlaggedForReview)
            .OrderByDescending(t => t.CreatedAt)
            .ToList();

        foreach (var t in flagged)
        {
            notifs.Add(new NotificationDto(
                Id: $"fraud-{t.Id}",
                Type: "fraud",
                Title: "Şüpheli İşlem Tespit Edildi",
                Body: $"{FormatAmount(t.Amount)} TL'lik {(string.IsNullOrWhiteSpace(t.Description) ? "transfer" : $"\"{t.Description}\"")} işlemi yüksek risk skoru aldı (skor: {t.RiskScore ?? 0}). İncelemeyi onayla.",
                CreatedAt: t.CreatedAt,
                Unread: true,
                RiskScore: t.RiskScore,
                TransactionId: t.Id));
        }

        // 2) Son 48 saat içinde alınan transferler (receiver)
        var recentReceived = all
            .Where(t => t.ReceiverId == userId
                        && t.Status == TransactionStatus.Completed
                        && (now - t.CreatedAt) < ReceivedWindow)
            .OrderByDescending(t => t.CreatedAt)
            .Take(5)
            .ToList();

        foreach (var t in recentReceived)
        {
            notifs.Add(new NotificationDto(
                Id: $"received-{t.Id}",
                Type: "received",
                Title: "Para alındı",
                Body: $"{t.Sender.Username} sana {FormatAmount(t.Amount)} TL gönderdi.",
                CreatedAt: t.CreatedAt,
                Unread: (now - t.CreatedAt) < TimeSpan.FromHours(12),
                RiskScore: null,
                TransactionId: t.Id));
        }

        // 3) Bu ayın özeti (sentetik, ay başında üretiliyormuş gibi)
        var thisMonthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var thisMonthSent = all
            .Where(t => t.SenderId == userId && t.CreatedAt >= thisMonthStart)
            .ToList();

        if (thisMonthSent.Count > 0)
        {
            var total = thisMonthSent.Sum(t => t.Amount);
            var topCategory = thisMonthSent
                .Where(t => !string.IsNullOrWhiteSpace(t.Category))
                .GroupBy(t => t.Category!)
                .OrderByDescending(g => g.Sum(t => t.Amount))
                .FirstOrDefault();

            var body = topCategory != null
                ? $"Bu ay {FormatAmount(total)} TL harcadın, en yoğun kategori: {topCategory.Key} ({FormatAmount(topCategory.Sum(t => t.Amount))} TL)."
                : $"Bu ay {FormatAmount(total)} TL harcadın — detayları gör.";

            notifs.Add(new NotificationDto(
                Id: $"monthly-{now.Year}-{now.Month}",
                Type: "monthly_summary",
                Title: "Aylık özet hazır",
                Body: body,
                CreatedAt: thisMonthStart,
                Unread: false,
                RiskScore: null,
                TransactionId: null));
        }

        return notifs
            .OrderByDescending(n => n.Unread)
            .ThenByDescending(n => n.CreatedAt)
            .ToList();
    }

    private static string FormatAmount(decimal amount)
        => amount.ToString("N2", CultureInfo.GetCultureInfo("tr-TR"));
}
