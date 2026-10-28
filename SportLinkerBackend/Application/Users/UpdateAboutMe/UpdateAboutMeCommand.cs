using Application.Abstractions;
using Domain.Abstractions;

namespace Application.Users.UpdateAboutMe
{
    public sealed record UpdateAboutMeCommand(string? AboutMe) : ICommand<Result<string?>>;
}
