using Application.Abstractions.Events;
using Application.Messages.IntegrationEvents;
using Domain.Abstractions;
using Domain.Entities;
using Infrastructure.Messaging.Outbox;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

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
        public DbSet<OutboxMessage> OutboxMessages { get; set; }
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

            var newMessages = ChangeTracker
                .Entries<Message>()
                .Where(entry => entry.State == EntityState.Added)
                .Select(entry => entry.Entity)
                .ToArray();

            if (newMessages.Length == 0)
            {
                return await base.SaveChangesAsync(cancellationToken);
            }

            await using var transaction = await Database.BeginTransactionAsync(cancellationToken);

            var affectedRows = await base.SaveChangesAsync(cancellationToken);

            foreach(var message in newMessages)
            {
                var integrationEvent = new MessageSentIntegrationEvent(
                    MessageId: message.Id,
                    ConversationId: message.ConversationId,
                    SenderId: message.SenderId,
                    ClientMessageId: message.ClientMessageId,
                    Content: message.Content,
                    SendAt: message.SendAt);

                var outboxMessage = OutboxMessage.Create(
                    type: MessageSentIntegrationEvent.EventType,
                    payload: JsonSerializer.Serialize(integrationEvent),
                    occurredAt: message.SendAt);

                OutboxMessages.Add(outboxMessage);
            }

            affectedRows += await base.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            return affectedRows;
        }
    }
}
