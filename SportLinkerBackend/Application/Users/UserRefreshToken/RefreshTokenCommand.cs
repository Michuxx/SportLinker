
using Application.Abstractions;
using Application.Users.Dtos;
using Domain.Abstractions;

namespace Application.Users.UserRefreshToken
{
    public record RefreshTokenCommand(string refreshToken) : ICommand<Result<LoggedUserDto>>;
}
