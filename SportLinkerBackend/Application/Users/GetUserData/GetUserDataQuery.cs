

using Application.Abstractions;

namespace Application.Users.GetUserData
{
    public record GetUserDataQuery(int userId) : IQuery<Result<UserDataDto>>
    {

    }
}
