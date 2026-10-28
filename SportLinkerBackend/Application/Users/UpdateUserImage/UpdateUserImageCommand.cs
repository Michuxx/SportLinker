using Application.Abstractions;
using Domain.Abstractions;
using Domain.Enums;

namespace Application.Users.UpdateUserImage
{
    public sealed record UpdateUserImageCommand(
        Stream FileStream,
        string FileName,
        ImageType ImageType
    ) : ICommand<Result<string>>;
}
