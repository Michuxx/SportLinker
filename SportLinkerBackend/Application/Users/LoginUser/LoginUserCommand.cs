
using Application.Abstractions;

namespace Application.Users.LoginUser
{
    public record LoginUserCommand(string email, string password) : ICommand<Result<LoggedUserDto>>; 
}
