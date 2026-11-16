using Application.Messages.Dtos;

namespace Application.Abstractions.Messaging
{
    public interface IChatNotifier
    {
        Task NotifyMessageAsync(
            int recipientUserId,
            MessageReceivedDto notification,
            CancellationToken cancellationToken);

        Task NotifyPresenceChangedAsync(
            IReadOnlyCollection<int> recipientUserIds,
            UserPresenceChangedDto notification,
            CancellationToken cancellationToken);

        Task NotifyConversationReadAsync(
            IReadOnlyCollection<int> recipentUserIds,
            ConversationReadDto notification,
            CancellationToken cancellationToken);
    }
}
