using LyraBit.Core.DTOs;

namespace LyraBit.Services.Notifications;

public interface INotificationService
{
    Task<List<NotificationDto>> GetForUserAsync(Guid userId, CancellationToken cancellationToken = default);
}
