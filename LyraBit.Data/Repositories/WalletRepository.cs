using LyraBit.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace LyraBit.Data.Repositories;

public sealed class WalletRepository : IWalletRepository
{
    private readonly LyraBitDbContext _db;

    public WalletRepository(LyraBitDbContext db)
    {
        _db = db;
    }

    public Task<Wallet?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        => _db.Wallets.AsNoTracking().FirstOrDefaultAsync(w => w.UserId == userId, cancellationToken);

    public Task<int> UpdateBalanceAsync(Guid userId, decimal delta, CancellationToken cancellationToken = default)
        => _db.Wallets
            .Where(w => w.UserId == userId)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(w => w.Balance, w => w.Balance + delta),
                cancellationToken);

    public async Task AddAsync(Wallet wallet, CancellationToken cancellationToken = default)
    {
        await _db.Wallets.AddAsync(wallet, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);
    }
}
