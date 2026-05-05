using LyraBit.Core.Entities;
using LyraBit.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace LyraBit.Data.Repositories;

public sealed class TransactionRepository : ITransactionRepository
{
    private readonly LyraBitDbContext _db;

    public TransactionRepository(LyraBitDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(Transaction transaction, CancellationToken cancellationToken = default)
    {
        await _db.Transactions.AddAsync(transaction, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public Task<List<Transaction>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        => _db.Transactions
            .AsNoTracking()
            .Include(t => t.Sender)
            .Include(t => t.Receiver)
            .Where(t => t.SenderId == userId || t.ReceiverId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync(cancellationToken);

    public Task<Transaction?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => _db.Transactions
            .AsNoTracking()
            .Include(t => t.Sender)
            .Include(t => t.Receiver)
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

    public Task<int> UpdateStatusAsync(Guid id, TransactionStatus status, CancellationToken cancellationToken = default)
        => _db.Transactions
            .Where(t => t.Id == id)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(t => t.Status, status),
                cancellationToken);

    public Task<int> CountRecentByUserAsync(Guid userId, TimeSpan window, CancellationToken cancellationToken = default)
    {
        var cutoff = DateTime.UtcNow.Subtract(window);
        return _db.Transactions
            .AsNoTracking()
            .CountAsync(
                t => t.SenderId == userId && t.CreatedAt >= cutoff,
                cancellationToken);
    }

    public Task<bool> HasUserSentToReceiverAsync(Guid senderId, Guid receiverId, CancellationToken cancellationToken = default)
        => _db.Transactions
            .AsNoTracking()
            .AnyAsync(
                t => t.SenderId == senderId && t.ReceiverId == receiverId,
                cancellationToken);

    public async Task<decimal> GetAvgSpendingAsync(Guid userId, TimeSpan window, CancellationToken cancellationToken = default)
    {
        var cutoff = DateTime.UtcNow.Subtract(window);
        var avg = await _db.Transactions
            .AsNoTracking()
            .Where(t => t.SenderId == userId && t.CreatedAt >= cutoff)
            .Select(t => (decimal?)t.Amount)
            .AverageAsync(cancellationToken);
        return avg ?? 0m;
    }
}
