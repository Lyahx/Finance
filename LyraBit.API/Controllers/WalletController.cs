using LyraBit.API.Constants;
using LyraBit.API.Extensions;
using LyraBit.Core.DTOs;
using LyraBit.Services.Wallets;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LyraBit.API.Controllers;

[ApiController]
[Route(ApiRoutes.Wallet.Controller)]
[Authorize]
public sealed class WalletController : ControllerBase
{
    private readonly IWalletService _wallet;

    public WalletController(IWalletService wallet)
    {
        _wallet = wallet;
    }

    [HttpGet]
    [ProducesResponseType(typeof(WalletDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<WalletDto>> GetMyWallet(CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var wallet = await _wallet.GetBalanceAsync(userId, cancellationToken);
        return Ok(wallet);
    }

    [HttpPost(ApiRoutes.Wallet.AddFunds)]
    [ProducesResponseType(typeof(WalletDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<WalletDto>> AddFunds(
        [FromBody] AddFundsRequestDto request,
        CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var wallet = await _wallet.AddFundsAsync(userId, request.Amount, cancellationToken);
        return Ok(wallet);
    }
}
