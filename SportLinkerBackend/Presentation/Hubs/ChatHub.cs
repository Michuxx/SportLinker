using Application.Abstractions.Messaging;
using Application.Messages.Presence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Presentation.Hubs;

[Authorize]
public sealed class ChatHub(
    IUserPresenceStore userPresenceStore,
    IUserLastSeenWriter userLastSeenWriter,
    UserPresenceNotifications presenceNotifications,
    ConversationTypingAccess typingAccess,
    ILogger<ChatHub> logger) : Hub
{
    public async Task SetTyping(int conversationId, bool isTyping)
    {
        if (conversationId <= 0
            || !int.TryParse(Context.UserIdentifier, out var userId)
            || userId <= 0)
        {
            return;
        }

        var recipients = await typingAccess.GetRecipientsAsync(
            conversationId, userId, Context.ConnectionAborted);

        if (recipients.Count == 0) return;

        await Clients.Users(recipients.Select(id => id.ToString(
                System.Globalization.CultureInfo.InvariantCulture)))
            .SendAsync("TypingChanged", new
            {
                ConversationId = conversationId,
                UserId = userId,
                IsTyping = isTyping
            }, Context.ConnectionAborted);
    }

    public override async Task OnConnectedAsync()
    {
        if (!int.TryParse(Context.UserIdentifier, out var userId)
            || userId <= 0)
        {
            Context.Abort();
            return;
        }

        await base.OnConnectedAsync();

        var becameOnline = userPresenceStore.AddConnection(
            userId,
            Context.ConnectionId);

        if (becameOnline)
        {
            await NotifyPresenceAsync(userId);
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        try
        {
            if (!int.TryParse(Context.UserIdentifier, out var userId)
                || userId <= 0)
            {
                return;
            }

            var becameOffline = userPresenceStore.RemoveConnection(
                userId,
                Context.ConnectionId);

            if (!becameOffline)
            {
                return;
            }

            using var timeout = new CancellationTokenSource(
                TimeSpan.FromSeconds(5));

            try
            {
                await userLastSeenWriter.UpdateAsync(
                    userId,
                    DateTime.UtcNow,
                    timeout.Token);
            }
            catch (Exception error)
            {
                logger.LogWarning(
                    error,
                    "Nie udało się zapisać LastSeenAt użytkownika {UserId}.",
                    userId);
            }

            await NotifyPresenceAsync(userId);
        }
        finally
        {
            await base.OnDisconnectedAsync(exception);
        }
    }

    private async Task NotifyPresenceAsync(int userId)
    {
        using var timeout = new CancellationTokenSource(
            TimeSpan.FromSeconds(5));

        try
        {
            await presenceNotifications.NotifyFriendsAsync(
                userId,
                timeout.Token);
        }
        catch (Exception error)
        {
            logger.LogWarning(
                error,
                "Nie udało się powiadomić o obecności użytkownika {UserId}.",
                userId);
        }
    }
}
