namespace LyraBit.Core.Entities;

// P1: ileride genişletilecek (group payments).
// Şimdilik entity DB'de hazır dursun, controller/service eklenmedi.
public class GroupWallet
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal Balance { get; set; }

    public DateTime CreatedAt { get; set; }

    // Navigation: many-to-many User
    public ICollection<User> Members { get; set; } = new List<User>();
}
