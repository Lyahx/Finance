using LyraBit.Core.Entities;

namespace LyraBit.Data.Repositories;

public interface ICategoryRepository
{
    Task<List<Category>> GetAllAsync(CancellationToken cancellationToken = default);
}
