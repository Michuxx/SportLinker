
using Application.Abstractions;
using Application.Users.Dtos;

namespace Application.Users.LoginUser
{
    public record LoginUserCommand(string email, string password) : ICommand<Result<LoggedUserDto>>; 
}
