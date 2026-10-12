using Application.Abstractions;
using Application.Users.Dtos;

namespace Application.Users.UpdateUserData
{
    public sealed record UpdateUserProfileCommand(
        int UserId,
        string Name,
        DateOnly? BirthDate,
        string? Gender,
        UserLocationDto? Location
    ) : ICommand<Result<UpdatedUser>>;
}
