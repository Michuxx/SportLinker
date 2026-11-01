using Application.Abstractions.Events;
using Domain.Abstractions.Interfaces;
using Domain.Entities;
using Domain.Events;
using MediatR;

namespace Application.Users.Statistics
{
    public sealed class UpdateUserStatisticsHandler(IUserRepository userRepository) : INotificationHandler<DomainEventNotification>
    {

        public async Task Handle(DomainEventNotification notification, CancellationToken cancellationToken)
        {
            switch(notification.Event)
            {
                case OfferCreated e:
                    await UpdateUser(
                    e.AuthorId,
                    user => user.RecordOfferCreated(),
                    cancellationToken);
                    break;

                case ParticipantJoined e:
                    await UpdateUser(
                        e.UserId,
                        user => user.RecordOfferJoined(),
                        cancellationToken);
                    break;

                case OfferRequestSent e:
                    await UpdateUser(
                        e.UserId,
                        user => user.RecordOfferRequestSent(),
                        cancellationToken);
                    break;
            }
        }

        private async Task UpdateUser(
        int userId,
        Action<User> update,
        CancellationToken cancellationToken)
        {
            var user = await userRepository.GetUserByIdAsync(
                userId,
                cancellationToken);

            if (user is null)
            {
                throw new InvalidOperationException(
                    $"Nie znaleziono użytkownika {userId}.");
            }

            update(user);
        }
    }
}
