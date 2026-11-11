using Infrastructure.Messaging.Outbox;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations;

public sealed class OutboxMessageConfiguration
    : IEntityTypeConfiguration<OutboxMessage>
{
    public void Configure(EntityTypeBuilder<OutboxMessage> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .ValueGeneratedNever();

        builder.Property(x => x.Type)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.Payload)
            .HasColumnType("nvarchar(max)")
            .IsRequired();

        builder.Property(x => x.OccurredAt)
            .HasConversion(
                value => value,
                value => DateTime.SpecifyKind(
                    value, DateTimeKind.Utc));

        builder.Property(x => x.ProcessedAt)
            .HasConversion(
                value => value,
                value => value.HasValue
                    ? DateTime.SpecifyKind(
                        value.Value, DateTimeKind.Utc)
                    : null);

        builder.HasIndex(x => new { x.OccurredAt, x.Id })
            .HasFilter("[ProcessedAt] IS NULL");
    }
}