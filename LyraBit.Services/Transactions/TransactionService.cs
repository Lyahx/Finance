using LyraBit.Core.DTOs;
using LyraBit.Core.Entities;
using LyraBit.Core.Enums;
using LyraBit.Data;
using LyraBit.Data.Repositories;
using LyraBit.Services.Exceptions;
using LyraBit.Services.Fraud;
using LyraBit.Services.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LyraBit.Services.Transactions;

public sealed class TransactionService : ITransactionService
{
    private readonly LyraBitDbContext _db;
    private readonly IUserRepository _userRepo;
    private readonly IWalletRepository _walletRepo;
    private readonly ITransactionRepository _txRepo;
    private readonly IFraudDetectionService _fraud;
    private readonly FraudDetectionSettings _fraudSettings;
    private readonly ILogger<TransactionService> _logger;

    public TransactionService(
        LyraBitDbContext db,
        IUserRepository userRepo,
        IWalletRepository walletRepo,
        ITransactionRepository txRepo,
        IFraudDetectionService fraud,
        IOptions<FraudDetectionSettings> fraudOptions,
        ILogger<TransactionService> logger)
    {
        _db = db;
        _userRepo = userRepo;
        _walletRepo = walletRepo;
        _txRepo = txRepo;
        _fraud = fraud;
        _fraudSettings = fraudOptions.Value;
        _logger = logger;
    }

    public async Task<TransactionResponseDto> TransferAsync(
        Guid senderId,
        TransferRequestDto request,
        TransferContext context,
        CancellationToken cancellationToken = default)
    {
        if (request.Amount <= 0)
        {
            throw new BadRequestException("Amount must be greater than zero.");
        }

        var sender = await _userRepo.GetByIdAsync(senderId, cancellationToken)
            ?? throw new UnauthorizedException("Sender not found.");

        var receiver = await _userRepo.GetByEmailOrUsernameAsync(request.ReceiverEmailOrUsername.Trim(), cancellationToken)
            ?? throw new NotFoundException("Receiver not found.");

        if (receiver.Id == senderId)
        {
            throw new BadRequestException("Cannot transfer to yourself.");
        }

        var senderAccountAgeDays = (int)(DateTime.UtcNow - sender.CreatedAt).TotalDays;

        var riskScore = await _fraud.CalculateRiskScoreAsync(
            senderId,
            receiver.Id,
            request.Amount,
            senderAccountAgeDays,
            cancellationToken);

        var status = riskScore >= _fraudSettings.FlaggedThreshold
            ? TransactionStatus.FlaggedForReview
            : TransactionStatus.Completed;

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            SenderId = senderId,
            ReceiverId = receiver.Id,
            Amount = request.Amount,
            Currency = "TRY",
            Description = request.Description,
            Status = status,
            RiskScore = riskScore,
            IpAddress = context.IpAddress,
            DeviceId = context.DeviceId,
            Channel = context.Channel,
            CreatedAt = DateTime.UtcNow
        };

        await using var dbTx = await _db.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            var decreased = await _walletRepo.TryDecreaseBalanceAsync(senderId, request.Amount, cancellationToken);
            if (decreased == 0)
            {
                throw new BadRequestException("Insufficient funds.");
            }

            var increased = await _walletRepo.UpdateBalanceAsync(receiver.Id, request.Amount, cancellationToken);
            if (increased == 0)
            {
                throw new NotFoundException("Receiver wallet not found.");
            }

            await _txRepo.AddAsync(transaction, cancellationToken);

            await dbTx.CommitAsync(cancellationToken);
        }
        catch
        {
            await dbTx.RollbackAsync(cancellationToken);
            throw;
        }

        _logger.LogInformation(
            "Transfer completed: {Amount} TRY from {SenderId} to {ReceiverId}, status={Status}, risk={Risk}, channel={Channel}",
            request.Amount, senderId, receiver.Id, status, riskScore, context.Channel);

        return new TransactionResponseDto(
            transaction.Id,
            sender.Username,
            receiver.Username,
            transaction.Amount,
            transaction.Currency,
            transaction.Description,
            transaction.Status,
            transaction.RiskScore,
            transaction.Category,
            transaction.CreatedAt,
            transaction.IpAddress,
            transaction.DeviceId,
            transaction.Channel,
            senderAccountAgeDays);
    }

    public async Task<List<TransactionResponseDto>> GetUserTransactionsAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var list = await _txRepo.GetByUserIdAsync(userId, cancellationToken);
        return list.Select(MapToDto).ToList();
    }

    public async Task<TransactionResponseDto> GetTransactionByIdAsync(
        Guid transactionId,
        Guid currentUserId,
        CancellationToken cancellationToken = default)
    {
        var tx = await _txRepo.GetByIdAsync(transactionId, cancellationToken)
            ?? throw new NotFoundException("Transaction not found.");

        if (tx.SenderId != currentUserId && tx.ReceiverId != currentUserId)
        {
            throw new UnauthorizedException("You are not a participant of this transaction.");
        }

        return MapToDto(tx);
    }

    private static TransactionResponseDto MapToDto(Transaction t)
    {
        var ageDays = (int)(DateTime.UtcNow - t.Sender.CreatedAt).TotalDays;
        return new TransactionResponseDto(
            t.Id,
            t.Sender.Username,
            t.Receiver.Username,
            t.Amount,
            t.Currency,
            t.Description,
            t.Status,
            t.RiskScore,
            t.Category,
            t.CreatedAt,
            t.IpAddress,
            t.DeviceId,
            t.Channel,
            ageDays);
    }
}
