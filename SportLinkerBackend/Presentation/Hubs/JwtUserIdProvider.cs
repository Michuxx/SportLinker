using Microsoft.AspNetCore.SignalR;

namespace Presentation.Hubs
{
    public sealed class JwtUserIdProvider : IUserIdProvider
    {
        public string? GetUserId(HubConnectionContext connection)
        {
            var value =  connection.User?.FindFirst("id")?.Value;

            return int.TryParse(value, out var userId) && userId > 0
                ? userId.ToString() 
                : null;
        }
    }
}
