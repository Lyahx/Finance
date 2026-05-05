using System.Security.Claims;
using LyraBit.Core.Constants;

namespace LyraBit.API.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var raw = user.FindFirstValue(ApiClaims.UserId);
        if (string.IsNullOrWhiteSpace(raw) || !Guid.TryParse(raw, out var id))
        {
            throw new InvalidOperationException("Authenticated user does not have a valid userId claim.");
        }
        return id;
    }

    public static string GetUsername(this ClaimsPrincipal user)
        => user.FindFirstValue(ApiClaims.Username) ?? string.Empty;
}
