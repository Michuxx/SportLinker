using Application.Abstractions;
using Application.Abstractions.Authentication;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Errors;

namespace Application.Users.UpdateAboutMe
{
    public sealed class UpdateAboutMeCommandHandler : ICommandHandler<UpdateAboutMeCommand, Result<string?>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public UpdateAboutMeCommandHandler(IUserRepository userRepository, IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<Result<string?>> Handle(UpdateAboutMeCommand command, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetUserByIdAsync(_currentUser.UserId, cancellationToken);
            if (user == null)
            {
                return Result<string?>.Failure(UserErrors.UserNotFound);
            }

            user.UpdateAboutMe(command.AboutMe);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<string?>.Success(user.PersonalData.AboutMe);
        }
    }
}
