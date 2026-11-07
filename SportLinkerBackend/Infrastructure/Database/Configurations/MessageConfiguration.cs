using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations
{
    public class MessageConfiguration : IEntityTypeConfiguration<Message>
    {
        public void Configure(EntityTypeBuilder<Message> builder)
        {
            builder.HasKey(m => m.Id);
            builder.Property(m => m.ConversationId).IsRequired();
            builder.Property(m => m.SenderId).IsRequired();
            builder.Property(m => m.Content).IsRequired();
            builder.Property(m => m.ClientMessageId).IsRequired();

            builder.Property(m => m.SendAt)
                .IsRequired()
                .HasConversion(
                    value => value, value => DateTime.SpecifyKind(value, DateTimeKind.Utc));

            builder.HasIndex(x => new
            {
                x.SenderId,
                x.ClientMessageId
            }).IsUnique();

            builder.HasIndex(m => new
            {
                m.ConversationId,
                m.SendAt,
                m.Id
            });

            builder.HasOne(m => m.Conversation)
                .WithMany(c => c.Messages)
                .HasForeignKey(m => m.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(m => m.Sender)
                .WithMany(u => u.Messages)
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
    
}
