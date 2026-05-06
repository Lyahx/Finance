using LyraBit.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LyraBit.Data.Configurations;

public sealed class WalletConfiguration : IEntityTypeConfiguration<Wallet>
{
    public void Configure(EntityTypeBuilder<Wallet> builder)
    {
        builder.ToTable("Wallets");

        builder.HasKey(w => w.Id);

        builder.Property(w => w.Id)
            .ValueGeneratedNever();

        builder.Property(w => w.Balance)
            .HasColumnType("decimal(18,2)")
            .HasDefaultValue(0m);

        builder.Property(w => w.Currency)
            .IsRequired()
            .HasMaxLength(3)
            .HasDefaultValue("TRY");

        builder.Property(w => w.CreatedAt)
            .HasDefaultValueSql("now() at time zone 'utc'");

        builder.HasOne(w => w.User)
            .WithOne(u => u.Wallet)
            .HasForeignKey<Wallet>(w => w.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(w => w.UserId).IsUnique();
    }
}
