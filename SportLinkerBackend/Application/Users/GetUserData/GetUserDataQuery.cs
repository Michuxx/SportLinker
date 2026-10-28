using Application.Abstractions;
using Application.Users.Dtos;
using Domain.Abstractions;

namespace Application.Users.GetUserData
{
    public record GetUserDataQuery(int userId) : IQuery<Result<UserDataDto>>
    {

    }
}
