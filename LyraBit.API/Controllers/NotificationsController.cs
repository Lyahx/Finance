using LyraBit.API.Constants;
using LyraBit.API.Extensions;
using LyraBit.Core.DTOs;
using LyraBit.Services.Notifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LyraBit.API.Controllers;

[ApiController]
[Route(ApiRoutes.Notifications.Controller)]
[Authorize]
public sealed class NotificationsController : ControllerBase
{
    private readonly INotificationService _notifications;

    public NotificationsController(INotificationService notifications)
    {
        _notifications = notifications;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<NotificationDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<List<NotificationDto>>> GetMyNotifications(CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var list = await _notifications.GetForUserAsync(userId, cancellationToken);
        return Ok(list);
    }
}
