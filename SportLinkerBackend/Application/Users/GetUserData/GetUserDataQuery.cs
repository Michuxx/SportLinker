

using Application.Abstractions;
using Application.Users.Dtos;

namespace Application.Users.GetUserData
{
    public record GetUserDataQuery(int userId) : IQuery<Result<UserDataDto>>
    {

    }
}
