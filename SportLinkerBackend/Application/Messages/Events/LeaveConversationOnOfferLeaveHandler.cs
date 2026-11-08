using Application.Abstractions.Events;
using Domain.Abstractions.Interfaces;
using Domain.Events;
using MediatR;

namespace Application.Messages.Events
{
    public sealed class LeaveConversationOnOfferLeaveHandler(IMessageRepository messageRepository) : INotificationHandler<DomainEventNotification>
    {
        public async Task Handle(DomainEventNotification notification, CancellationToken cancellationToken)
        {
            if (notification.Event is not OfferLeave offerLeave)
            {
                return;
            }
            var conversation = await messageRepository.GetConversationByOfferIdAsync(offerLeave.OfferId, cancellationToken);
            if (conversation == null)
            {
                throw new InvalidOperationException($"Nie znaleziono rozmowy dla oferty {offerLeave.OfferId}.");
            }
            var result = conversation.LeaveConversation(offerLeave.UserId);
            if (!result.IsSuccess)
            {
                throw new InvalidOperationException(result.Error.Message);
            }
            return;
        }
    }
}
