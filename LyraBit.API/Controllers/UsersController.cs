using LyraBit.API.Constants;
using LyraBit.API.Extensions;
using LyraBit.Core.DTOs;
using LyraBit.Services.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LyraBit.API.Controllers;

[ApiController]
[Route(ApiRoutes.Users.Controller)]
[Authorize]
public sealed class UsersController : ControllerBase
{
    private readonly IUserService _users;

    public UsersController(IUserService users)
    {
        _users = users;
    }

    [HttpGet(ApiRoutes.Users.Me)]
    [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserProfileDto>> GetMe(CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var profile = await _users.GetProfileAsync(userId, cancellationToken);
        return Ok(profile);
    }

    [HttpGet(ApiRoutes.Users.Search)]
    [ProducesResponseType(typeof(List<UserSummaryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<List<UserSummaryDto>>> Search(
        [FromQuery] string q,
        [FromQuery] int limit = 10,
        CancellationToken cancellationToken = default)
    {
        var userId = User.GetUserId();
        var results = await _users.SearchAsync(q ?? string.Empty, limit, userId, cancellationToken);
        return Ok(results);
    }
}
