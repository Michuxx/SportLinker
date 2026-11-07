using Application.Abstractions.Events;
using Domain.Abstractions;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Database
{
    public sealed class ApplicationDbContext : DbContext, IUnitOfWork
    {
        private readonly IPublisher _publisher;
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IPublisher publisher) : base(options)
        {
            _publisher = publisher;
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Sport> Sports { get; set; }
        public DbSet<FavouriteUserSport> FavouriteUserSports { get; set; }
        public DbSet<Offer> Offers { get; set; }
        public DbSet<OfferParticipant> OfferParticipants { get; set; }
        public DbSet<OfferRequest> OfferRequests { get; set; }
        public DbSet<Friendship> Friendships { get; set; }
        public DbSet<FriendRequest> FriendRequests { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<ConversationParticipant> ConversationParticipants { get; set; }
        public DbSet<Message> Messages { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
            base.OnModelCreating(modelBuilder);
        }

        public override async Task<int> SaveChangesAsync(
            CancellationToken cancellationToken = default)
        {
            while (true)
            {
                var events = ChangeTracker
                    .Entries<Offer>()
                    .SelectMany(entry => entry.Entity.DequeueDomainEvents())
                    .ToArray();

                if (events.Length == 0)
                {
                    break;
                }

                foreach (var domainEvent in events)
                {
                    await _publisher.Publish(
                        new DomainEventNotification(domainEvent),
                        cancellationToken);
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}
