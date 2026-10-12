using Application.Abstractions;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Errors;

namespace Application.Users.UpdateFavouriteSports
{
    public sealed class UpdateFavouriteSportsCommandHandler : ICommandHandler<UpdateFavouriteSportsCommand, Result<List<int>>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateFavouriteSportsCommandHandler(IUserRepository userRepository, IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<List<int>>> Handle(UpdateFavouriteSportsCommand command, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetUserByIdAsync(command.UserId, cancellationToken);
            if (user == null)
            {
                return Result<List<int>>.Failure(UserErrors.UserNotFound);
            }

            user.UpdateFavouriteSports(command.SportIds);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var updatedSportIds = user.FavouriteUserSports.Select(f => f.SportId).ToList();
            return Result<List<int>>.Success(updatedSportIds);
        }
    }
}
