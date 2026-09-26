using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(u => u.Id);

            builder.Property(u => u.Email).IsRequired().HasMaxLength(255);

            builder.Property(u => u.Role).IsRequired().HasConversion<string>();

            builder.OwnsOne(u => u.PersonalData, pd =>
            {
                pd.Property(p => p.AboutMe).HasMaxLength(100);
                pd.Property(p => p.BirthDate).HasMaxLength(100);
                pd.Property(p => p.Name).IsRequired().HasMaxLength(100);
                pd.Property(p => p.Gender).HasConversion<string>();
            });

            builder.OwnsOne(u => u.Images, img =>
            {
                img.Property(i => i.BackgroundImage);
                img.Property(i => i.ProfileImage);
            });

            builder.OwnsOne(u => u.Phone, phone =>
            {
                phone.Property(p => p.Number).HasMaxLength(20);
                phone.Property(p => p.Extension).HasMaxLength(5);
            });

            builder.OwnsOne(u => u.Statistics, stats =>
            {
                stats.Property(s => s.CreatedOffers);
                stats.Property(s => s.JoinedOffers);
                stats.Property(s => s.Invitations);
            });

            builder.HasOne(u => u.Location)
                   .WithMany(l => l.Users)
                   .HasForeignKey(u => u.LocationId)
                   .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
