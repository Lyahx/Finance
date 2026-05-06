using LyraBit.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace LyraBit.Data.Repositories;

public sealed class CategoryRepository : ICategoryRepository
{
    private readonly LyraBitDbContext _db;

    public CategoryRepository(LyraBitDbContext db)
    {
        _db = db;
    }

    public Task<List<Category>> GetAllAsync(CancellationToken cancellationToken = default)
        => _db.Categories
            .AsNoTracking()
            .OrderBy(c => c.Id)
            .ToListAsync(cancellationToken);
}
