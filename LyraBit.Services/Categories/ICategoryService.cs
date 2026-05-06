using LyraBit.Core.DTOs;

namespace LyraBit.Services.Categories;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetAllAsync(CancellationToken cancellationToken = default);
}
