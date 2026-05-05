using LyraBit.Core.DTOs;

namespace LyraBit.Services.Wallets;

public interface IWalletService
{
    Task<WalletDto> GetBalanceAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<WalletDto> AddFundsAsync(Guid userId, decimal amount, CancellationToken cancellationToken = default);
}
