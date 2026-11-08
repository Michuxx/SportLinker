using Application.Abstractions.Events;
using Domain.Abstractions.Interfaces;
using Domain.Events;
using MediatR;

namespace Application.Messages.Events
{
    public sealed class JoinToConversationHandler(IMessageRepository messageRepository) : INotificationHandler<DomainEventNotification>
    {
        public async Task Handle(DomainEventNotification notification, CancellationToken cancellationToken)
        {
            if (notification.Event is not ParticipantJoined joined)
            {
                return;
            }

            var conversation = await messageRepository.GetConversationByOfferIdAsync(joined.OfferId, cancellationToken);
            if (conversation == null)
            {
                throw new InvalidOperationException($"Nie znaleziono rozmowy dla oferty {joined.OfferId}.");
            }

            var result = conversation.AddParticipant(joined.UserId);
            if (!result.IsSuccess)
            {
                throw new InvalidOperationException(result.Error.Message);
            }

            return;
        }
    }
}
