using LyraBit.Core.DTOs;
using LyraBit.Data.Repositories;
using LyraBit.Services.Exceptions;
using Microsoft.Extensions.Logging;

namespace LyraBit.Services.Wallets;

public sealed class WalletService : IWalletService
{
    private readonly IWalletRepository _walletRepo;
    private readonly ILogger<WalletService> _logger;

    public WalletService(IWalletRepository walletRepo, ILogger<WalletService> logger)
    {
        _walletRepo = walletRepo;
        _logger = logger;
    }

    public async Task<WalletDto> GetBalanceAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var wallet = await _walletRepo.GetByUserIdAsync(userId, cancellationToken)
            ?? throw new NotFoundException("Wallet not found.");

        return new WalletDto(wallet.UserId, wallet.Balance, wallet.Currency);
    }

    public async Task<WalletDto> AddFundsAsync(Guid userId, decimal amount, CancellationToken cancellationToken = default)
    {
        if (amount <= 0)
        {
            throw new BadRequestException("Amount must be greater than zero.");
        }

        var rows = await _walletRepo.UpdateBalanceAsync(userId, amount, cancellationToken);
        if (rows == 0)
        {
            throw new NotFoundException("Wallet not found.");
        }

        _logger.LogInformation("Funds added: {Amount} to wallet of {UserId}", amount, userId);

        var wallet = await _walletRepo.GetByUserIdAsync(userId, cancellationToken)
            ?? throw new NotFoundException("Wallet not found.");

        return new WalletDto(wallet.UserId, wallet.Balance, wallet.Currency);
    }
}
