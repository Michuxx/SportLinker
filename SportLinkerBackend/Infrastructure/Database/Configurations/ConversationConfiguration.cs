using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations
{
    public class ConversationConfiguration : IEntityTypeConfiguration<Conversation>
    {
        public void Configure(EntityTypeBuilder<Conversation> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Type)
                .HasConversion<string>()
                .IsRequired();

            builder.Property(c => c.CreatedAt)
                .IsRequired()
                .HasConversion(
                    value => value, value => DateTime.SpecifyKind(value, DateTimeKind.Utc));

            builder.Property(c => c.PrivateConversationPairKey)
                .HasMaxLength(21);

            builder.HasIndex(c => c.PrivateConversationPairKey)
                .IsUnique()
                .HasFilter("[PrivateConversationPairKey] IS NOT NULL");

            builder.HasOne(x => x.Offer)
                .WithOne(x => x.Conversation)
                .HasForeignKey<Conversation>(c => c.RelatedOfferId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
