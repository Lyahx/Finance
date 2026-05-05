using LyraBit.Core.Entities;

namespace LyraBit.Services.Auth;

public interface IJwtTokenService
{
    (string Token, DateTime ExpiresAt) Generate(User user);
}
