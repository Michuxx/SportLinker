using Application.Abstractions;
using Application.Users.Dtos;

namespace Application.Users.GetUserRequestsQuery
{
    public sealed record GetUserRequestsQuery() : IQuery<List<UserRequestsDto>>
    {
    }
}
