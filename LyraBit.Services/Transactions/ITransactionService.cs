using LyraBit.Core.DTOs;

namespace LyraBit.Services.Transactions;

public interface ITransactionService
{
    Task<TransactionResponseDto> TransferAsync(Guid senderId, TransferRequestDto request, CancellationToken cancellationToken = default);

    Task<List<TransactionResponseDto>> GetUserTransactionsAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<TransactionResponseDto> GetTransactionByIdAsync(Guid transactionId, Guid currentUserId, CancellationToken cancellationToken = default);
}
