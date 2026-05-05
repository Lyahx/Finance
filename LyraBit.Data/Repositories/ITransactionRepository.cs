using LyraBit.Core.Entities;
using LyraBit.Core.Enums;

namespace LyraBit.Data.Repositories;

public interface ITransactionRepository
{
    Task AddAsync(Transaction transaction, CancellationToken cancellationToken = default);

    Task<List<Transaction>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<Transaction?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<int> UpdateStatusAsync(Guid id, TransactionStatus status, CancellationToken cancellationToken = default);

    Task<int> CountRecentByUserAsync(Guid userId, TimeSpan window, CancellationToken cancellationToken = default);

    Task<bool> HasUserSentToReceiverAsync(Guid senderId, Guid receiverId, CancellationToken cancellationToken = default);

    Task<decimal> GetAvgSpendingAsync(Guid userId, TimeSpan window, CancellationToken cancellationToken = default);
}
