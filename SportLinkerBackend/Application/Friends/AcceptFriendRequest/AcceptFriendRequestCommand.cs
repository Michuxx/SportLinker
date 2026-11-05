
using Application.Abstractions;
using Domain.Abstractions;

namespace Application.Friends.AcceptFriendRequest
{
    public sealed record AcceptFriendRequestCommand(int FriendRequestId) : ICommand<Result<bool>>
    {
    }
}
