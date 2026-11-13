using System.Globalization;
using Application.Abstractions.Messaging;
using Application.Messages.Dtos;
using Microsoft.AspNetCore.SignalR;

namespace Presentation.Hubs;

public sealed class SignalRChatNotifier(IHubContext<ChatHub> hubContext) : IChatNotifier
{
    public Task NotifyMessageAsync(
        int recipientUserId,
        MessageReceivedDto notification,
        CancellationToken cancellationToken)
    {
        return hubContext.Clients
            .User(recipientUserId.ToString(CultureInfo.InvariantCulture))
            .SendAsync(
                "MessageReceived",
                notification,
                cancellationToken);
    }

    public Task NotifyPresenceChangedAsync(
    IReadOnlyCollection<int> recipientUserIds,
    UserPresenceChangedDto notification,
    CancellationToken cancellationToken)
    {
        if (recipientUserIds.Count == 0)
        {
            return Task.CompletedTask;
        }

        var identifiers = recipientUserIds
            .Select(id => id.ToString(CultureInfo.InvariantCulture))
            .ToArray();

        return hubContext.Clients
            .Users(identifiers)
            .SendAsync(
                "UserPresenceChanged",
                notification,
                cancellationToken);
    }
}