using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations
{
    public class OfferParticipantConfiguration : IEntityTypeConfiguration<OfferParticipant>
    {
        public void Configure(EntityTypeBuilder<OfferParticipant> builder)
        {
            builder.HasKey(op => op.Id);
            builder.Property(op => op.UserId).IsRequired();
            builder.Property(op => op.OfferId).IsRequired();
            builder.Property(op => op.JoinDate).IsRequired();

            builder.HasOne(op => op.Offer)
                .WithMany(o => o.Participants)
                .HasForeignKey(op => op.OfferId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(op => op.User)
                .WithMany(u => u.OfferParticipants)
                .HasForeignKey(op => op.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
            