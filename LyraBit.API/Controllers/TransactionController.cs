using LyraBit.API.Constants;
using LyraBit.API.Extensions;
using LyraBit.Core.DTOs;
using LyraBit.Services.Transactions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LyraBit.API.Controllers;

[ApiController]
[Route(ApiRoutes.Transactions.Controller)]
[Authorize]
public sealed class TransactionController : ControllerBase
{
    private const string DeviceIdHeader = "X-Device-Id";
    private const string ChannelHeader = "X-Lyrabit-Channel";
    private const string DefaultChannel = "Api";

    private readonly ITransactionService _transactions;

    public TransactionController(ITransactionService transactions)
    {
        _transactions = transactions;
    }

    [HttpPost(ApiRoutes.Transactions.Transfer)]
    [ProducesResponseType(typeof(TransactionResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TransactionResponseDto>> Transfer(
        [FromBody] TransferRequestDto request,
        CancellationToken cancellationToken)
    {
        var senderId = User.GetUserId();
        var transferContext = BuildTransferContext();
        var transaction = await _transactions.TransferAsync(senderId, request, transferContext, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = transaction.Id }, transaction);
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<TransactionResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<List<TransactionResponseDto>>> GetMyTransactions(CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var list = await _transactions.GetUserTransactionsAsync(userId, cancellationToken);
        return Ok(list);
    }

    [HttpGet(ApiRoutes.Transactions.ById)]
    [ProducesResponseType(typeof(TransactionResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TransactionResponseDto>> GetById(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var transaction = await _transactions.GetTransactionByIdAsync(id, userId, cancellationToken);
        return Ok(transaction);
    }

    private TransferContext BuildTransferContext()
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var deviceId = Request.Headers.TryGetValue(DeviceIdHeader, out var deviceVal)
            ? deviceVal.ToString()
            : null;
        var channel = Request.Headers.TryGetValue(ChannelHeader, out var channelVal)
            ? channelVal.ToString()
            : DefaultChannel;

        return new TransferContext(
            string.IsNullOrWhiteSpace(ip) ? null : ip,
            string.IsNullOrWhiteSpace(deviceId) ? null : deviceId,
            string.IsNullOrWhiteSpace(channel) ? null : channel);
    }
}
