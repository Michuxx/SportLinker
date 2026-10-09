
using Application.Abstractions;
using Application.Users.LoginUser;

namespace Application.Users.UserRefreshToken
{
    public record RefreshTokenCommand(string refreshToken) : ICommand<Result<LoggedUserDto>>;
}
