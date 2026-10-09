
using Application.Abstractions;

namespace Application.Users.CreateUser
{
    public record CreateUserCommand(string email, string password, string name) : ICommand<Result<bool>>
    {
    }
}
