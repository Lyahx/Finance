using LyraBit.Core.DTOs;
using LyraBit.Core.Entities;
using LyraBit.Data;
using LyraBit.Data.Repositories;
using LyraBit.Services.Exceptions;
using Microsoft.Extensions.Logging;

namespace LyraBit.Services.Auth;

public sealed class AuthService : IAuthService
{
    private readonly LyraBitDbContext _db;
    private readonly IUserRepository _userRepo;
    private readonly IJwtTokenService _jwt;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        LyraBitDbContext db,
        IUserRepository userRepo,
        IJwtTokenService jwt,
        ILogger<AuthService> logger)
    {
        _db = db;
        _userRepo = userRepo;
        _jwt = jwt;
        _logger = logger;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, CancellationToken cancellationToken = default)
    {
        if (await _userRepo.ExistsByEmailAsync(request.Email, cancellationToken))
        {
            throw new BadRequestException("Email is already registered.");
        }

        if (await _userRepo.ExistsByUsernameAsync(request.Username, cancellationToken))
        {
            throw new BadRequestException("Username is already taken.");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Username = request.Username.Trim(),
            FullName = request.FullName.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow,
            Wallet = new Wallet
            {
                Id = Guid.NewGuid(),
                Balance = 0m,
                Currency = "TRY",
                CreatedAt = DateTime.UtcNow
            }
        };

        await _db.Users.AddAsync(user, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("User registered: {Username} ({UserId})", user.Username, user.Id);

        var (token, expiresAt) = _jwt.Generate(user);
        return new AuthResponseDto(token, user.Id, user.Username, expiresAt);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepo.GetByEmailOrUsernameAsync(request.EmailOrUsername.Trim(), cancellationToken)
            ?? throw new UnauthorizedException("Invalid credentials.");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedException("Invalid credentials.");
        }

        _logger.LogInformation("User logged in: {Username} ({UserId})", user.Username, user.Id);

        var (token, expiresAt) = _jwt.Generate(user);
        return new AuthResponseDto(token, user.Id, user.Username, expiresAt);
    }
}
