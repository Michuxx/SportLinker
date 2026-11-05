using Application.Abstractions;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Errors;

namespace Application.Friends.CancelFriendRequest
{
    public sealed class CancelFriendRequestCommandHandler : ICommandHandler<CancelFriendRequestCommand, Result<bool>>
    {
        private readonly IFriendshipRepository _friendRepository;
        private readonly IUnitOfWork _unitOfWork;
        
        public CancelFriendRequestCommandHandler(IFriendshipRepository friendRepository, IUnitOfWork unitOfWork)
        {
            _friendRepository = friendRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(CancelFriendRequestCommand request, CancellationToken cancellationToken)
        {
            var friendRequest = await _friendRepository.GetFriendRequestByIdAsync(request.RequestId, cancellationToken);
            if (friendRequest == null)
            {
                return Result<bool>.Failure(FriendshipErrors.FriendRequestNotFound);
            }
            _friendRepository.RemoveFriendRequest(friendRequest);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result<bool>.Success(true);
        }
    }
}
