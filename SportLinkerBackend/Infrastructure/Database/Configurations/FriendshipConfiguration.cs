using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations;

public sealed class FriendshipConfiguration
    : IEntityTypeConfiguration<Friendship>
{
    public void Configure(EntityTypeBuilder<Friendship> builder)
    {
        builder.ToTable("Friendships", table =>
        {
            table.HasCheckConstraint(
                "CK_Friendships_UserOrder",
                "[FirstUserId] < [SecondUserId]");
        });

        builder.HasKey(f => f.Id);

        builder.HasIndex(f => new
        {
            f.FirstUserId,
            f.SecondUserId
        }).IsUnique();

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(f => f.FirstUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(f => f.SecondUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}