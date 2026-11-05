using Application.Abstractions;
using Application.Friends.AcceptFriendRequest;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Entities;
using Domain.Errors;

namespace Application.Friends.RejectFriendFrequest
{
    public sealed class RejectFriendRequestCommandHandler : ICommandHandler<RejectFriendRequestCommand, Result<bool>>
    {
        private readonly IFriendshipRepository _friendshipRepository;
        private readonly IUnitOfWork _unitOfWork;

        public RejectFriendRequestCommandHandler(IFriendshipRepository friendshipRepository, IUnitOfWork unitOfWork)
        {
            _friendshipRepository = friendshipRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(RejectFriendRequestCommand request, CancellationToken cancellationToken)
        {
            var friendRequest = await _friendshipRepository.GetFriendRequestByIdAsync(request.FriendRequestId, cancellationToken);
            if (friendRequest == null)
            {
                return Result<bool>.Failure(FriendshipErrors.FriendRequestNotFound);
            }

            _friendshipRepository.RemoveFriendRequest(friendRequest);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result<bool>.Success(true);
        }
    }
}
