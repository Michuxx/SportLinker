using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations
{
    public class ConversationParticipantConfiguration : IEntityTypeConfiguration<ConversationParticipant>
    {
        public void Configure(EntityTypeBuilder<ConversationParticipant> builder)
        {
            builder.HasKey(cp => cp.Id);
            builder.Property(cp => cp.UserId).IsRequired();
            builder.Property(cp => cp.ConversationId).IsRequired();

            builder.HasIndex(cp => new
            {
                cp.ConversationId,
                cp.UserId
            })
            .IsUnique()
            .HasFilter("[LeftAt] IS NULL");

            builder.Property(cp => cp.JoinedAt)
                .IsRequired()
                .HasConversion(
                    value => value, value => DateTime.SpecifyKind(value, DateTimeKind.Utc));

            builder.Property(cp => cp.LeftAt)
                .HasConversion(
                    value => value,
                    value => value.HasValue
                        ? DateTime.SpecifyKind(value.Value, DateTimeKind.Utc)
                        : null);

            builder.HasOne(cp => cp.Conversation)
                .WithMany(c => c.Participants)
                .HasForeignKey(cp => cp.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(cp => cp.User)
                .WithMany(u => u.ConversationParticipants)
                .HasForeignKey(cp => cp.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
