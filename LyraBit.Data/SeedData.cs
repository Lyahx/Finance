using LyraBit.Core.Entities;
using LyraBit.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace LyraBit.Data;

public static class SeedData
{
    private const string DemoPassword = "Password123!";

    public static async Task SeedAsync(LyraBitDbContext db, CancellationToken cancellationToken = default)
    {
        if (await db.Users.AnyAsync(cancellationToken))
        {
            return;
        }

        var now = DateTime.UtcNow;
        var random = new Random(42);

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(DemoPassword);

        var users = new[]
        {
            new User { Id = Guid.NewGuid(), Email = "furkan@lyrabit.com", Username = "furkan",     FullName = "Furkan Bağdemir", PasswordHash = passwordHash, CreatedAt = now.AddDays(-30) },
            new User { Id = Guid.NewGuid(), Email = "semra@lyrabit.com",  Username = "semra",      FullName = "Semra Yeşilan",   PasswordHash = passwordHash, CreatedAt = now.AddDays(-28) },
            new User { Id = Guid.NewGuid(), Email = "ali@lyrabit.com",    Username = "ali_yilmaz", FullName = "Ali Yılmaz",      PasswordHash = passwordHash, CreatedAt = now.AddDays(-25) },
            new User { Id = Guid.NewGuid(), Email = "ayse@lyrabit.com",   Username = "ayse",       FullName = "Ayşe Kaya",       PasswordHash = passwordHash, CreatedAt = now.AddDays(-20) },
            new User { Id = Guid.NewGuid(), Email = "mehmet@lyrabit.com", Username = "mehmet",     FullName = "Mehmet Demir",    PasswordHash = passwordHash, CreatedAt = now.AddDays(-18) }
        };

        var wallets = users
            .Select(u => new Wallet
            {
                Id = Guid.NewGuid(),
                UserId = u.Id,
                Balance = 75_000m,
                Currency = "TRY",
                CreatedAt = u.CreatedAt
            })
            .ToArray();

        for (var i = 0; i < users.Length; i++)
        {
            users[i].Wallet = wallets[i];
        }

        var categories = new[]
        {
            new Category { Name = "Food",          Icon = "restaurant" },
            new Category { Name = "Subscriptions", Icon = "subscriptions" },
            new Category { Name = "Rent",          Icon = "home" },
            new Category { Name = "Transport",     Icon = "directions_car" },
            new Category { Name = "Entertainment", Icon = "movie" },
            new Category { Name = "Groceries",    Icon = "local_grocery_store" },
            new Category { Name = "Gift",          Icon = "card_giftcard" },
            new Category { Name = "Health",        Icon = "fitness_center" },
            new Category { Name = "Education",     Icon = "menu_book" }
        };

        var transactions = new List<Transaction>();

        var nightUtc = DateTime.UtcNow.Date.AddDays(-1);
        AddTransfer(transactions, wallets,
            senderIdx: 0, receiverIdx: 4,
            amount: 50_000m,
            description: "Acil havale",
            when: nightUtc,
            status: TransactionStatus.FlaggedForReview,
            riskScore: 70,
            category: null);

        AddTransfer(transactions, wallets,
            senderIdx: 2, receiverIdx: 0,
            amount: 75m,
            description: "Spotify Premium aboneliği",
            when: now.AddDays(-7),
            status: TransactionStatus.Completed,
            riskScore: 5,
            category: "Subscriptions");

        AddTransfer(transactions, wallets,
            senderIdx: 1, receiverIdx: 3,
            amount: 199m,
            description: "Netflix paylaşımı",
            when: now.AddDays(-5),
            status: TransactionStatus.Completed,
            riskScore: 10,
            category: "Subscriptions");

        AddTransfer(transactions, wallets,
            senderIdx: 0, receiverIdx: 2,
            amount: 250m,
            description: "Yemeksepeti sipariş paylaşımı",
            when: now.AddDays(-3),
            status: TransactionStatus.Completed,
            riskScore: 5,
            category: "Food");

        var randomDescriptions = new (string Description, string Category)[]
        {
            ("Akşam yemeği",          "Food"),
            ("Kira payı",             "Rent"),
            ("Doğum günü hediyesi",   "Gift"),
            ("Taksi paylaşımı",       "Transport"),
            ("Market alışverişi",     "Groceries"),
            ("Kafede ödeme",          "Food"),
            ("Sinema bileti",         "Entertainment"),
            ("Konser bileti",         "Entertainment"),
            ("Borç ödemesi",          null!),
            ("Spor salonu üyeliği",   "Health"),
            ("Kitap",                 "Education")
        };

        for (var i = 0; i < 22; i++)
        {
            var senderIdx = random.Next(users.Length);
            int receiverIdx;
            do
            {
                receiverIdx = random.Next(users.Length);
            }
            while (receiverIdx == senderIdx);

            var (desc, cat) = randomDescriptions[random.Next(randomDescriptions.Length)];
            decimal amount = random.Next(50, 3_000);
            var when = now
                .AddDays(-random.Next(1, 30))
                .AddHours(-random.Next(0, 12))
                .AddMinutes(-random.Next(0, 60));
            var risk = random.Next(0, 30);

            AddTransfer(transactions, wallets,
                senderIdx, receiverIdx,
                amount, desc, when,
                TransactionStatus.Completed,
                risk,
                cat);
        }

        await db.Categories.AddRangeAsync(categories, cancellationToken);
        await db.Users.AddRangeAsync(users, cancellationToken);
        await db.Transactions.AddRangeAsync(transactions, cancellationToken);

        await db.SaveChangesAsync(cancellationToken);
    }

    private static void AddTransfer(
        List<Transaction> transactions,
        Wallet[] wallets,
        int senderIdx,
        int receiverIdx,
        decimal amount,
        string description,
        DateTime when,
        TransactionStatus status,
        int riskScore,
        string? category)
    {
        transactions.Add(new Transaction
        {
            Id = Guid.NewGuid(),
            SenderId = wallets[senderIdx].UserId,
            ReceiverId = wallets[receiverIdx].UserId,
            Amount = amount,
            Currency = "TRY",
            Description = description,
            Status = status,
            RiskScore = riskScore,
            Category = category,
            CreatedAt = when
        });

        wallets[senderIdx].Balance -= amount;
        wallets[receiverIdx].Balance += amount;
    }
}
