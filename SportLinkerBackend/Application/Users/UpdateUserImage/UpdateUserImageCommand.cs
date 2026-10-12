using Application.Abstractions;
using Domain.Enums;

namespace Application.Users.UpdateUserImage
{
    public sealed record UpdateUserImageCommand(
        int UserId,
        Stream FileStream,
        string FileName,
        ImageType ImageType
    ) : ICommand<Result<string>>;
}
