using Application.Abstractions;
using Application.Users.Dtos;
using Domain.Abstractions;

namespace Application.Users.LoginUser
{
    public sealed record LoginUserCommand(string Email, string Password) : ICommand<Result<LoggedUserDto>>; 
}
