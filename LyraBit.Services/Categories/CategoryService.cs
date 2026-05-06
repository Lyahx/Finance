using LyraBit.Core.DTOs;
using LyraBit.Data.Repositories;

namespace LyraBit.Services.Categories;

public sealed class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _repo;

    public CategoryService(ICategoryRepository repo)
    {
        _repo = repo;
    }

    public async Task<List<CategoryDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var list = await _repo.GetAllAsync(cancellationToken);
        return list.Select(c => new CategoryDto(c.Id, c.Name, c.Icon)).ToList();
    }
}
