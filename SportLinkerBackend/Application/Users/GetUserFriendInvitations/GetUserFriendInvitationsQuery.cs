using Application.Abstractions;
using Application.Users.Dtos;
using Domain.Abstractions;

namespace Application.Users.GetUserFriendInvitations
{
    public sealed record GetUserFriendInvitationsQuery() : IQuery<Result<List<UserFriendInvitation>>>
    {
    }
}
