using Application.Abstractions;
using Domain.Abstractions;

namespace Application.Friends.SendFriendRequest
{
    public sealed record SendFriendRequestCommand(int ReceiverId) : ICommand<Result<int>>
    {
    }
}
