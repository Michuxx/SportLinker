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
        private readonly IMessageRepository _messageRepository;
        public DeleteFriendCommandHandler(IFriendshipRepository friendshipRepository, IUnitOfWork unitOfWork, ICurrentUser currentUser, IMessageRepository messageRepository)
        {
            _friendshipRepository = friendshipRepository;
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
            _messageRepository = messageRepository;
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

            var firstUserId = friendship.FirstUserId;
            var secondUserId = friendship.SecondUserId;
            var pairKey = $"{firstUserId}:{secondUserId}";

            var leaveResult = await LeaveConversationForUsers(firstUserId, secondUserId, pairKey, cancellationToken);

            if (!leaveResult.IsSuccess)
            {
                return leaveResult;
            }

            _friendshipRepository.RemoveFriendship(friendship);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result<bool>.Success(true);
        }

        private async Task<Result<bool>> LeaveConversationForUsers(int firstUserId, int secondUserId, string pairKey, CancellationToken cancellationToken)
        {
            var conversation = await _messageRepository
                .GetPrivateConversationByPairKey(pairKey, cancellationToken);

            if (conversation is not null)
            {
                foreach (var userId in new[] { firstUserId, secondUserId })
                {
                    var isActive = conversation.Participants.Any(
                        p => p.UserId == userId && p.LeftAt is null);

                    if (!isActive)
                    {
                        continue;
                    }

                    var leaveResult = conversation.LeaveConversation(userId);

                    if (!leaveResult.IsSuccess)
                    {
                        return leaveResult;
                    }
                }
            }

            return Result<bool>.Success(true);
        }
    }
}
