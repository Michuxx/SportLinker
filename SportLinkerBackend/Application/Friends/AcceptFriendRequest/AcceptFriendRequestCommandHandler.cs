using Application.Abstractions;
using Application.Abstractions.Authentication;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Entities;
using Domain.Errors;

namespace Application.Friends.AcceptFriendRequest
{
    public sealed class AcceptFriendRequestCommandHandler : ICommandHandler<AcceptFriendRequestCommand, Result<bool>>
    {
        private readonly IFriendshipRepository _friendshipRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;
        private readonly IMessageRepository _messageRepository;

        public AcceptFriendRequestCommandHandler(IFriendshipRepository friendshipRepository, IUnitOfWork unitOfWork, ICurrentUser currentUser, IMessageRepository messageRepository )
        {
            _friendshipRepository = friendshipRepository;
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
            _messageRepository = messageRepository;
        }

        public async Task<Result<bool>> Handle(AcceptFriendRequestCommand request, CancellationToken cancellationToken)
        {
            var friendRequest = await _friendshipRepository.GetFriendRequestByIdAsync(request.FriendRequestId, cancellationToken);
            if (friendRequest == null)
            {
                return Result<bool>.Failure(FriendshipErrors.FriendRequestNotFound);
            }

            if (friendRequest.ReceiverId != _currentUser.UserId)
            {
                return Result<bool>.Failure(FriendshipErrors.NotRequestReceiver);
            }

            var friendship = Friendship.Create(friendRequest.SenderId, friendRequest.ReceiverId);

            if (!friendship.IsSuccess)
            {
                return Result<bool>.Failure(friendship.Error);
            }

            var result = await AddConversationParticipantsAgain(friendship.Value!, cancellationToken);

            if(!result.IsSuccess)
            {
                return result;
            }

            _friendshipRepository.AddFriendship(friendship.Value!);
            _friendshipRepository.RemoveFriendRequest(friendRequest);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result<bool>.Success(true);
        }

        private async Task<Result<bool>> AddConversationParticipantsAgain(Friendship friendship, CancellationToken cancellationToken)
        {
            var pairKey =
                $"{friendship.FirstUserId}:{friendship.SecondUserId}";

            var conversation = await _messageRepository
                .GetPrivateConversationByPairKey(pairKey, cancellationToken);

            if (conversation is not null)
            {
                var restoreResult = conversation.RestorePrivateParticipants(
                    friendship.FirstUserId,
                    friendship.SecondUserId);

                if (!restoreResult.IsSuccess)
                {
                    return restoreResult;
                }
            }

            return Result<bool>.Success(true);
        }
    }
}
