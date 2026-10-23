using Application.Abstractions;
using Application.Abstractions.Authentication;
using Application.Abstractions.Storage;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Enums;
using Domain.Errors;

namespace Application.Users.UpdateUserImage
{
    public sealed class UpdateUserImageCommandHandler : ICommandHandler<UpdateUserImageCommand, Result<string>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IImageStorageService _imageStorageService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public UpdateUserImageCommandHandler(
            IUserRepository userRepository,
            IImageStorageService imageStorageService,
            IUnitOfWork unitOfWork,
            ICurrentUser currentUser)
        {
            _userRepository = userRepository;
            _imageStorageService = imageStorageService;
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<Result<string>> Handle(UpdateUserImageCommand command, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetUserByIdAsync(_currentUser.UserId, cancellationToken);
            if (user == null)
            {
                return Result<string>.Failure(UserErrors.UserNotFound);
            }

            string? oldImageUrl = command.ImageType switch
            {
                ImageType.Profile => user.Images?.ProfileImage,
                ImageType.Background => user.Images?.BackgroundImage,
                _ => null
            };

            if (!string.IsNullOrWhiteSpace(oldImageUrl))
            {
                await _imageStorageService.DeleteImageAsync(oldImageUrl, cancellationToken);
            }

            string newImageUrl = await _imageStorageService.UploadImageAsync(
                command.FileStream,
                command.FileName,
                command.ImageType,
                cancellationToken);

            user.UpdateImage(newImageUrl, command.ImageType);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<string>.Success(newImageUrl);
        }
    }
}
