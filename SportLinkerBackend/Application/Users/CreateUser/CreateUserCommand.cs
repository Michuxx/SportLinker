
using Application.Abstractions;
using Domain.Abstractions;

namespace Application.Users.CreateUser
{
    public record CreateUserCommand(string email, string password, string name) : ICommand<Result<bool>>
    {
    }
}
