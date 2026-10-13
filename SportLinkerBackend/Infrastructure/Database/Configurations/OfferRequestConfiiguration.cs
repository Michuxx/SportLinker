using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations
{
    public class OfferRequestConfiguration : IEntityTypeConfiguration<OfferRequest>
    {
        public void Configure(EntityTypeBuilder<OfferRequest> builder)
        {
            builder.HasKey(or => or.Id);
            builder.Property(or => or.UserId).IsRequired();
            builder.Property(or => or.OfferId).IsRequired();
            builder.Property(or => or.RequestDate).IsRequired();

            builder.HasOne(or => or.Offer)
                .WithMany(o => o.OfferRequests)
                .HasForeignKey(or => or.OfferId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(or => or.User)
                .WithMany(u => u.OfferRequests)
                .HasForeignKey(or => or.UserId)
                .OnDelete(DeleteBehavior.Restrict);  

            builder.Property(r => r.Status).IsRequired()
                .HasConversion<string>();
        }
    }
}
