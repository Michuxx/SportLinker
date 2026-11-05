using Application.Abstractions;
using Domain.Abstractions;

namespace Application.Friends.CancelFriendRequest
{
    public sealed record CancelFriendRequestCommand(int RequestId) : ICommand<Result<bool>>
    {
    }
}
