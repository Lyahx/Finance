using LyraBit.Core.DTOs;
using LyraBit.Data.Repositories;
using LyraBit.Services.Exceptions;

namespace LyraBit.Services.Users;

public sealed class UserService : IUserService
{
    private readonly IUserRepository _userRepo;
    private readonly IWalletRepository _walletRepo;

    public UserService(IUserRepository userRepo, IWalletRepository walletRepo)
    {
        _userRepo = userRepo;
        _walletRepo = walletRepo;
    }

    public async Task<UserProfileDto> GetProfileAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _userRepo.GetByIdAsync(userId, cancellationToken)
            ?? throw new NotFoundException("User not found.");

        var wallet = await _walletRepo.GetByUserIdAsync(userId, cancellationToken);
        var ageDays = (int)(DateTime.UtcNow - user.CreatedAt).TotalDays;

        return new UserProfileDto(
            user.Id,
            user.Email,
            user.Username,
            user.FullName,
            user.CreatedAt,
            ageDays,
            wallet?.Balance ?? 0m,
            wallet?.Currency ?? "TRY");
    }

    public async Task<List<UserSummaryDto>> SearchAsync(string query, int limit, Guid excludeUserId, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(query) || query.Length < 2)
        {
            return new List<UserSummaryDto>();
        }

        var clampedLimit = Math.Clamp(limit, 1, 25);
        var users = await _userRepo.SearchAsync(query.Trim(), clampedLimit, excludeUserId, cancellationToken);
        return users
            .Select(u => new UserSummaryDto(u.Id, u.Username, u.FullName))
            .ToList();
    }
}
