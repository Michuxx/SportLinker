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
        Task<Conversation?> GetConversationByOfferIdAsync(int offerId, CancellationToken cancellationToken);
        void DeleteConversation(Conversation conversation);
        Task<ConversationParticipant?> MarkAsReadAsync(int conversationId, int userId, int messageId, CancellationToken cancellationToken);
        Task<List<int>> GetReadNotificationRecipientsAsync(
            int conversationId,
            int messageId,
            CancellationToken cancellationToken);
    }
}
