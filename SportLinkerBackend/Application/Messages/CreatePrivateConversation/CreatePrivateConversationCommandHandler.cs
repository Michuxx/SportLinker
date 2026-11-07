using Application.Abstractions;
using Application.Abstractions.Authentication;
using Application.Messages.Policies;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Domain.Errors;

namespace Application.Messages.CreatePrivateConversation
{
    public sealed class CreatePrivateConversationCommandHandler : ICommandHandler<CreatePrivateConversationCommand, Result<bool>>
    {
        private readonly ICurrentUser _currentUser;
        private readonly IMessageRepository _messageRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPrivateMessagingPolicy _privateMessagingPolicy;
        public CreatePrivateConversationCommandHandler(
            IUnitOfWork unitOfWork, 
            ICurrentUser currentUser, 
            IMessageRepository messageRepository, 
            IPrivateMessagingPolicy privateMessagingPolicy
            )
        {
            _currentUser = currentUser;
            _messageRepository = messageRepository;
            _unitOfWork = unitOfWork;
            _privateMessagingPolicy = privateMessagingPolicy;
        }

        public async Task<Result<bool>> Handle(CreatePrivateConversationCommand command, CancellationToken cancellationToken)
        {
            var senderId = _currentUser.UserId;

            if(senderId == command.ReceiverId)
            {
                return Result<bool>.Failure(MessageErrors.CannotSendMessageToYourself);
            }

            var friendshipResult = await _privateMessagingPolicy.CheckAsync(senderId, command.ReceiverId, cancellationToken);

            if (!friendshipResult.IsSuccess)
            {
                return friendshipResult;
            }

            string pairKey = $"{Math.Min(senderId, command.ReceiverId)}:{Math.Max(senderId, command.ReceiverId)}";

            var existingMessage = await _messageRepository
                .GetByClientMessageIdAsync(
                    senderId,
                    command.ClientMessageId,
                    cancellationToken);

            if (existingMessage is not null)
            {
                var isSameOperation =
                    existingMessage.Conversation.Type == ConversationType.Private
                    && existingMessage.Conversation.PrivateConversationPairKey == pairKey
                    && existingMessage.Content == command.Content;

                return isSameOperation
                    ? Result<bool>.Success(true)
                    : Result<bool>.Failure(
                        MessageErrors.ClientMessageIdConflict);
            }

            var existingConversation = await _messageRepository.GetPrivateConversationByPairKey(pairKey, cancellationToken);

            if (existingConversation is not null)
            {
                var addingParticipantBackResult = existingConversation.RestorePrivateParticipants(senderId, command.ReceiverId);

                if (!addingParticipantBackResult.IsSuccess)
                {
                    return addingParticipantBackResult;
                }

                var sendResult = existingConversation.SendMessage(
                senderId,
                command.Content,
                command.ClientMessageId);

                if (!sendResult.IsSuccess)
                {
                    return sendResult;
                }
            }
            else
            {
                var newConversation = Conversation.CreatePrivateConversation(
                    senderId,
                    command.ReceiverId,
                    command.Content,
                    command.ClientMessageId);

                if (!newConversation.IsSuccess)
                {
                    return Result<bool>.Failure(newConversation.Error);
                }

                _messageRepository.AddConversation(newConversation.Value!);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
