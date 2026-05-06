using LyraBit.Core.DTOs;

namespace LyraBit.Services.Users;

public interface IUserService
{
    Task<UserProfileDto> GetProfileAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<List<UserSummaryDto>> SearchAsync(string query, int limit, Guid excludeUserId, CancellationToken cancellationToken = default);
}
