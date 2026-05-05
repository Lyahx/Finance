using LyraBit.Core.Entities;

namespace LyraBit.Data.Repositories;

public interface IWalletRepository
{
    Task<Wallet?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<int> UpdateBalanceAsync(Guid userId, decimal delta, CancellationToken cancellationToken = default);

    Task AddAsync(Wallet wallet, CancellationToken cancellationToken = default);
}
