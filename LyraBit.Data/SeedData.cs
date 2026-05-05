namespace LyraBit.Data;

public static class SeedData
{
    public static Task SeedAsync(LyraBitDbContext db, CancellationToken cancellationToken = default)
        => Task.CompletedTask;
}
