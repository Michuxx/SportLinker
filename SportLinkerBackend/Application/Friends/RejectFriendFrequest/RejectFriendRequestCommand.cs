using Application.Abstractions;
using Domain.Abstractions;

namespace Application.Friends.RejectFriendFrequest
{
    public sealed record RejectFriendRequestCommand(int FriendRequestId) : ICommand<Result<bool>>
    {
    }
}
