using Application.Abstractions.Events;
using Domain.Abstractions.Interfaces;
using Domain.Entities;
using Domain.Events;
using MediatR;

namespace Application.Messages.Events
{
    public sealed class CreateGroupConversationOnOfferCreatedHandler(IMessageRepository messageRepository) : INotificationHandler<DomainEventNotification>
    {
        public Task Handle(DomainEventNotification notification, CancellationToken cancellationToken)
        {
            if (notification.Event is not OfferCreated created)
            {
                return Task.CompletedTask;
            }

            var result = Conversation.CreateGroupConversation(
                created.Offer.Id,
                created.AuthorId);

            if (!result.IsSuccess)
            {
                throw new InvalidOperationException(result.Error.Message);
            }

            var conversation = result.Value!;

            conversation.Offer = created.Offer;
            created.Offer.Conversation = conversation;

            messageRepository.AddConversation(conversation);

            return Task.CompletedTask;
        }
    }
}
