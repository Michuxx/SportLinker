using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations
{
    public class FavouriteUserSportConfiguration : IEntityTypeConfiguration<FavouriteUserSport>
    {
        public void Configure(EntityTypeBuilder<FavouriteUserSport> builder)
        {
            builder.HasKey(f => f.Id);
            builder.Property(f => f.UserId).IsRequired();
            builder.Property(f => f.SportId).IsRequired();

            builder.HasOne(f => f.User)
                .WithMany(u => u.FavouriteUserSports)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(f => f.Sport)
                .WithMany(s => s.FavouriteUserSports)
                .HasForeignKey(f => f.SportId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}