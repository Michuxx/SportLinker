using Application.Abstractions.Messaging;
using Application.Messages.Dtos;
using Domain.Abstractions.Interfaces;

namespace Application.Messages.Presence;

public sealed class UserPresenceNotifications(
    IFriendshipRepository friendshipRepository,
    IChatNotifier notifier)
{
    public async Task NotifyFriendsAsync(
        int userId,
        CancellationToken cancellationToken)
    {
        var friendIds = await friendshipRepository.GetFriendIdsAsync(
            userId,
            cancellationToken);

        await notifier.NotifyPresenceChangedAsync(
            friendIds,
            new UserPresenceChangedDto(userId),
            cancellationToken);
    }
}