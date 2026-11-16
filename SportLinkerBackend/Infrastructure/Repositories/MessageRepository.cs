using Domain.Abstractions.Interfaces;
using Domain.Entities;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        private readonly ApplicationDbContext _context;

        public MessageRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Conversation?> GetPrivateConversationByPairKey(string pairKey, CancellationToken cancellationToken)
        {
            return await _context.Conversations
                .Include(c => c.Participants)
                .FirstOrDefaultAsync(x => x.PrivateConversationPairKey == pairKey,
                cancellationToken);
        }

        public async Task<Conversation?> GetConversationById(int conversationId, CancellationToken cancellationToken)
        {
            return await _context.Conversations
                .Include(c => c.Participants)
                .FirstOrDefaultAsync(x => x.Id == conversationId, cancellationToken);
        }

        public Task<Message?> GetByClientMessageIdAsync(
            int senderId,
            Guid clientMessageId,
            CancellationToken cancellationToken)
        {
            return _context.Messages
                .AsNoTracking()
                .Include(m => m.Conversation)
                .SingleOrDefaultAsync(
                    m => m.SenderId == senderId
                        && m.ClientMessageId == clientMessageId,
                    cancellationToken);
        }

        public void AddConversation(Conversation conversation)
        {
            _context.Conversations.Add(conversation);
        }

        public void DeleteConversation(Conversation conversation)
        {
            _context.Conversations.Remove(conversation);
        }

        public async Task<ConversationParticipant?> MarkAsReadAsync(int conversationId, int userId, int messageId, CancellationToken cancellationToken)
        {
            var message = await _context.Messages
                .AsNoTracking()
                .Where(m =>
                    m.Id == messageId &&
                    m.ConversationId == conversationId)
                .Select(m => new
                {
                    m.Id,
                    m.SendAt
                })
                .SingleOrDefaultAsync(cancellationToken);

            if (message is null)
            {
                return null;
            }

            var participants = _context.ConversationParticipants
                .Where(p =>
                    p.ConversationId == conversationId &&
                    p.UserId == userId &&
                    p.JoinedAt <= message.SendAt &&
                    (p.LeftAt == null || message.SendAt < p.LeftAt));

            var readAt = DateTime.UtcNow;

            await participants
                .Where(p =>
                    p.LastReadMessageId == null ||
                    p.LastReadMessage!.SendAt < message.SendAt ||
                    (
                        p.LastReadMessage!.SendAt == message.SendAt &&
                        p.LastReadMessageId.Value < message.Id
                    ))
                .ExecuteUpdateAsync(
                    setters => setters
                        .SetProperty(
                            p => p.LastReadMessageId,
                            message.Id)
                        .SetProperty(
                            p => p.LastReadAt,
                            (DateTime?)readAt),
                    cancellationToken);

            return await participants
                .AsNoTracking()
                .Include(x => x.LastReadMessage)
                .SingleOrDefaultAsync(cancellationToken);
        }
        public async Task<Conversation?> GetConversationByOfferIdAsync(int offerId, CancellationToken cancellationToken)
        {
            return await _context.Conversations
                .Include(c => c.Participants)
                .FirstOrDefaultAsync(x => x.RelatedOfferId == offerId, cancellationToken);
        }

        public async Task<List<int>> GetReadNotificationRecipientsAsync(
            int conversationId,
            int messageId,
            CancellationToken cancellationToken)
        {
            return await _context.ConversationParticipants
                .Where(p => p.ConversationId == conversationId)
                .Where(p => p.Conversation.Messages.Any(m =>
                    m.Id == messageId &&
                    m.SendAt >= p.JoinedAt &&
                    (p.LeftAt == null || m.SendAt < p.LeftAt)))
                .Select(p => p.UserId)
                .Distinct()
                .ToListAsync(cancellationToken);
        }
    }
}
