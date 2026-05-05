using LyraBit.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LyraBit.Data.Configurations;

public sealed class GroupWalletConfiguration : IEntityTypeConfiguration<GroupWallet>
{
    public void Configure(EntityTypeBuilder<GroupWallet> builder)
    {
        builder.ToTable("GroupWallets");

        builder.HasKey(g => g.Id);

        builder.Property(g => g.Id)
            .ValueGeneratedNever();

        builder.Property(g => g.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(g => g.Balance)
            .HasColumnType("decimal(18,2)")
            .HasDefaultValue(0m);

        builder.Property(g => g.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");

        builder.HasMany(g => g.Members)
            .WithMany(u => u.GroupWallets)
            .UsingEntity(j => j.ToTable("GroupWalletMembers"));
    }
}
