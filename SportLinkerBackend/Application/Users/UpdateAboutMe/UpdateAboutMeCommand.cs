using Application.Abstractions;

namespace Application.Users.UpdateAboutMe
{
    public sealed record UpdateAboutMeCommand(string? AboutMe) : ICommand<Result<string?>>;
}
