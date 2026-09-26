using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations
{
    public class LocationConfiguration : IEntityTypeConfiguration<Location>
    {
        public void Configure(EntityTypeBuilder<Location> builder)
        {
            builder.HasKey(l => l.Id);

            builder.Property(l => l.Country).HasMaxLength(100);
            builder.Property(l => l.State).HasMaxLength(100);
            builder.Property(l => l.City).HasMaxLength(100);
            builder.Property(l => l.Name).HasMaxLength(100);
            builder.Property(l => l.Street).HasMaxLength(100);
            builder.Property(l => l.HouseNumber).HasMaxLength(20);
            builder.Property(l => l.Type).HasMaxLength(50);

            builder.OwnsOne(l => l.Coordinates, coord =>
            {
                coord.Property(c => c.Latitude).IsRequired();
                coord.Property(c => c.Longitude).IsRequired();
            });
        }
    }
}
