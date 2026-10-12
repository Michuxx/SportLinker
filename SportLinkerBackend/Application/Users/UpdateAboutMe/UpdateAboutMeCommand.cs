using Application.Abstractions;

namespace Application.Users.UpdateAboutMe
{
    public sealed record UpdateAboutMeCommand(int UserId, string? AboutMe) : ICommand<Result<string?>>;
}
