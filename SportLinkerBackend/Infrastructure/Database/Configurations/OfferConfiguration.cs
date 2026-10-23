using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations
{
    public class OfferConfiguration : IEntityTypeConfiguration<Offer>
    {
        public void Configure(EntityTypeBuilder<Offer> builder)
        {
            builder.HasKey(o => o.Id);
            builder.Property(o => o.Title).IsRequired().HasMaxLength(50);
            builder.Property(o => o.Description).IsRequired().HasMaxLength(190);

            builder.Property(o => o.Level).IsRequired()
                .HasConversion<string>();

            builder.Property(o => o.PlanningDate)
                .IsRequired()
                .HasConversion(
                    value => value, value => DateTime.SpecifyKind(value, DateTimeKind.Utc));

            builder.Property(o => o.CreatedAt).IsRequired();
            builder.Property(o => o.MaxPeople).IsRequired();

            builder.Property(o => o.AvailabilityEnum).IsRequired()
                .HasConversion<string>();

            builder.Property(o => o.ModeEnum).IsRequired()
                .HasConversion<string>();

            builder.HasOne(o => o.Sport)
                .WithMany(s => s.Offers)
                .HasForeignKey(o => o.SportId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(o => o.Location)
                .WithMany(l => l.Offers)
                .HasForeignKey(o => o.LocationId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(o => o.Author)
                .WithMany(u => u.Offers)
                .HasForeignKey(o => o.AuthorId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}