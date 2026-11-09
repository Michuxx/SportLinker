using Application.Abstractions;
using Application.Friends.Dtos;

namespace Application.Friends.GetUserFriends
{
    public sealed record GetUserFriendsQuery() : IQuery<List<UserFriendDto>>
    {
    }
}
