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
    }
}
