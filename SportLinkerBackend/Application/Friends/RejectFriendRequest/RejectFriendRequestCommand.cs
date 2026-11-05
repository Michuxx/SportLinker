using Application.Abstractions;
using Domain.Abstractions;

namespace Application.Friends.RejectFriendRequest
{
    public sealed record RejectFriendRequestCommand(int FriendRequestId) : ICommand<Result<bool>>
    {
    }
}
