using Application.Abstractions;
using Application.Abstractions.Authentication;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Errors;

namespace Application.Friends.DeleteFriend
{
    public class DeleteFriendCommandHandler : ICommandHandler<DeleteFriendCommand, Result<bool>>
    {
        private readonly IFriendshipRepository _friendshipRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;
        public DeleteFriendCommandHandler(IFriendshipRepository friendshipRepository, IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _friendshipRepository = friendshipRepository;
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }
        public async Task<Result<bool>> Handle(DeleteFriendCommand request, CancellationToken cancellationToken)
        {
            if(request.FriendId == _currentUser.UserId)
            {
                return Result<bool>.Failure(FriendshipErrors.SameUser);
            }

            var friendship = await _friendshipRepository.GetBetweenAsync(_currentUser.UserId, request.FriendId, cancellationToken);
            if (friendship == null)
            {
                return Result<bool>.Failure(FriendshipErrors.FriendshipNotFound);
            }
            _friendshipRepository.RemoveFriendship(friendship);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result<bool>.Success(true);
        }
    }
}
