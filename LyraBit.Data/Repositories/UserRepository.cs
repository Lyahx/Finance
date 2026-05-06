using LyraBit.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace LyraBit.Data.Repositories;

public sealed class UserRepository : IUserRepository
{
    private readonly LyraBitDbContext _db;

    public UserRepository(LyraBitDbContext db)
    {
        _db = db;
    }

    public Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id, cancellationToken);

    public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
        => _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == email, cancellationToken);

    public Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default)
        => _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Username == username, cancellationToken);

    public Task<User?> GetByEmailOrUsernameAsync(string emailOrUsername, CancellationToken cancellationToken = default)
        => _db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(
                u => u.Email == emailOrUsername || u.Username == emailOrUsername,
                cancellationToken);

    public async Task AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await _db.Users.AddAsync(user, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default)
        => _db.Users.AnyAsync(u => u.Email == email, cancellationToken);

    public Task<bool> ExistsByUsernameAsync(string username, CancellationToken cancellationToken = default)
        => _db.Users.AnyAsync(u => u.Username == username, cancellationToken);

    public Task<List<User>> SearchAsync(string query, int limit, Guid? excludeUserId, CancellationToken cancellationToken = default)
    {
        var pattern = $"%{query}%";
        var q = _db.Users.AsNoTracking()
            .Where(u =>
                EF.Functions.Like(u.Username, pattern) ||
                EF.Functions.Like(u.Email, pattern) ||
                EF.Functions.Like(u.FullName, pattern));

        if (excludeUserId.HasValue)
        {
            q = q.Where(u => u.Id != excludeUserId.Value);
        }

        return q.OrderBy(u => u.Username).Take(limit).ToListAsync(cancellationToken);
    }
}
