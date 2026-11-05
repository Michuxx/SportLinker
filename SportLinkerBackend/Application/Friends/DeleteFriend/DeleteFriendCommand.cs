using Application.Abstractions;
using Domain.Abstractions;

namespace Application.Friends.DeleteFriend
{
    public sealed record DeleteFriendCommand(int FriendId) : ICommand<Result<bool>>
    {
    }
}
