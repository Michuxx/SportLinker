using Application.Abstractions;
using Application.Users.Dtos;

namespace Application.Users.GetUserRequests
{
    public sealed record GetUserRequestsQuery() : IQuery<List<UserRequestsDto>>
    {
    }
}
