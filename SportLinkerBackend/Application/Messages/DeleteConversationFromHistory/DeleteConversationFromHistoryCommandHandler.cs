using Application.Abstractions;
using Application.Abstractions.Authentication;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Enums;
using Domain.Errors;

namespace Application.Messages.DeleteConversationFromHistory
{
    public sealed class DeleteConversationFromHistoryCommandHandler : ICommandHandler<DeleteConversationFromHistoryCommand, Result<bool>>
    {
        private readonly ICurrentUser _currentUser;
        private readonly IMessageRepository _messageRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFriendshipRepository _friendshipRepository;
        public DeleteConversationFromHistoryCommandHandler(
            ICurrentUser currentUser,
            IMessageRepository messageRepository,
            IUnitOfWork unitOfWork,
            IFriendshipRepository friendshipRepository)
        {
            _currentUser = currentUser;
            _messageRepository = messageRepository;
            _unitOfWork = unitOfWork;
            _friendshipRepository = friendshipRepository;
        }
        public async Task<Result<bool>> Handle(DeleteConversationFromHistoryCommand command, CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            var conversation = await _messageRepository.GetConversationById(command.ConversationId, cancellationToken);
            if (conversation is null)
            {
                return Result<bool>.Failure(MessageErrors.ConversationNotFound);
            }

            if (conversation.Type == ConversationType.Private)
            {
                var recipientResult =
                    conversation.GetPrivateRecipientIdFromSenderId(userId);

                if (!recipientResult.IsSuccess)
                {
                    return Result<bool>.Failure(recipientResult.Error);
                }

                var friendship = await _friendshipRepository.GetBetweenAsync(
                    userId,
                    recipientResult.Value,
                    cancellationToken);

                if (friendship is not null)
                {
                    return Result<bool>.Failure(
                        FriendshipErrors.FriendshipStillExists);
                }
            }

            var result = conversation.RemoveParticipants(userId);

            if(!result.IsSuccess)
            {
                return result;
            }

            if(conversation.Participants.Count == 0)
            {
                _messageRepository.DeleteConversation(conversation);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result<bool>.Success(true);
        }
    }
}
