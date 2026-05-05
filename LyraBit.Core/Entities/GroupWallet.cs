namespace LyraBit.Core.Entities;

public class GroupWallet
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal Balance { get; set; }

    public DateTime CreatedAt { get; set; }

    public ICollection<User> Members { get; set; } = new List<User>();
}
