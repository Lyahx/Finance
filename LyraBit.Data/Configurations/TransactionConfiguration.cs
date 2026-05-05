using LyraBit.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LyraBit.Data.Configurations;

public sealed class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.ToTable("Transactions");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id)
            .ValueGeneratedNever();

        builder.Property(t => t.Amount)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(t => t.Currency)
            .IsRequired()
            .HasMaxLength(3)
            .HasDefaultValue("TRY");

        builder.Property(t => t.Description)
            .HasMaxLength(500);

        builder.Property(t => t.Status)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(t => t.Category)
            .HasMaxLength(100);

        builder.Property(t => t.IpAddress)
            .HasMaxLength(45);

        builder.Property(t => t.DeviceId)
            .HasMaxLength(100);

        builder.Property(t => t.Channel)
            .HasMaxLength(30);

        builder.Property(t => t.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");

        builder.HasOne(t => t.Sender)
            .WithMany(u => u.SentTransactions)
            .HasForeignKey(t => t.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(t => t.Receiver)
            .WithMany(u => u.ReceivedTransactions)
            .HasForeignKey(t => t.ReceiverId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(t => t.SenderId);
        builder.HasIndex(t => t.ReceiverId);
        builder.HasIndex(t => t.CreatedAt);
        builder.HasIndex(t => t.Status);
    }
}
