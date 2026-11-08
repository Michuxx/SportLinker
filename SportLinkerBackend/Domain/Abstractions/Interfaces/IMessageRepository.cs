using Domain.Entities;

namespace Domain.Abstractions.Interfaces
{
    public interface IMessageRepository
    {
        Task<Conversation?> GetPrivateConversationByPairKey(string pairKey, CancellationToken cancellationToken);
        Task<Message?> GetByClientMessageIdAsync(
            int senderId,
            Guid clientMessageId,
            CancellationToken cancellationToken);
        void AddConversation(Conversation conversation);
        Task<Conversation?> GetConversationById(int conversationId, CancellationToken cancellationToken);
    }
}
