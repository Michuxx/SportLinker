
using Application.Abstractions;
using Application.Users.Dtos;

namespace Application.Users.UserRefreshToken
{
    public record RefreshTokenCommand(string refreshToken) : ICommand<Result<LoggedUserDto>>;
}
