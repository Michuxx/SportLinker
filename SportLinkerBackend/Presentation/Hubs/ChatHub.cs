using Application.Abstractions.Messaging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Presentation.Hubs
{
    [Authorize]
    public sealed class ChatHub(IUserPresenceStore userPresenceStore) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            if (!int.TryParse(Context.UserIdentifier, out var userId)
            || userId <= 0)
            {
                Context.Abort();
                return;
            }

            await base.OnConnectedAsync();

            userPresenceStore.AddConnection(
                userId,
                Context.ConnectionId);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if (int.TryParse(Context.UserIdentifier, out var userId)
                && userId > 0)
            {
                userPresenceStore.RemoveConnection(
                    userId,
                    Context.ConnectionId);
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
