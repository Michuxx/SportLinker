using Application.Abstractions;
using Application.Abstractions.Authentication;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Entities;
using Domain.Errors;

namespace Application.Friends.SendFriendRequest
{
    public sealed class SendFriendRequestCommandHandler : ICommandHandler<SendFriendRequestCommand, Result<bool>>
    {
        private readonly IFriendshipRepository _friendshipRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public SendFriendRequestCommandHandler(IFriendshipRepository friendshipRepository, IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _friendshipRepository = friendshipRepository;
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<Result<bool>> Handle(SendFriendRequestCommand request, CancellationToken cancellationToken)
        {
            var senderId = _currentUser.UserId;
            if (senderId == request.ReceiverId)
            {
                return Result<bool>.Failure(FriendshipErrors.SameUser);
            }

            var existingFriendship = await _friendshipRepository.GetBetweenAsync(senderId, request.ReceiverId, cancellationToken);

            if (existingFriendship != null)
            {
                return Result<bool>.Failure(FriendshipErrors.AlreadyFriends);
            }

            var existingFriendRequest = await _friendshipRepository.GetFriendRequestByReceiverIdAsync(request.ReceiverId, senderId, cancellationToken);

            if (existingFriendRequest != null)
            {
                return Result<bool>.Failure(FriendshipErrors.FriendRequestAlreadySent);
            }
            var friendRequest = FriendRequest.Create(senderId, request.ReceiverId); 

            _friendshipRepository.AddFriendRequest(friendRequest);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
