using Application.Abstractions;
using Application.Abstractions.Authentication;
using Application.Messages.Policies;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Enums;
using Domain.Errors;

namespace Application.Messages.SendMessage
{
    public sealed class SendMessageCommandHandler : ICommandHandler<SendMessageCommand, Result<bool>>
    {
        private readonly ICurrentUser _currentUser;
        private readonly IMessageRepository _messageRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPrivateMessagingPolicy _privateMessagingPolicy;
        public SendMessageCommandHandler(
            ICurrentUser currentUser,
            IMessageRepository messageRepository,
            IUnitOfWork unitOfWork,
            IPrivateMessagingPolicy privateMessagingPolicy)
        {
            _currentUser = currentUser;
            _messageRepository = messageRepository;
            _unitOfWork = unitOfWork;
            _privateMessagingPolicy = privateMessagingPolicy;
        }
        public async Task<Result<bool>> Handle(SendMessageCommand command, CancellationToken cancellationToken)
        {
            var senderId = _currentUser.UserId;
            var conversation = await _messageRepository.GetConversationById(command.ConversationId, cancellationToken);
            if (conversation is null)
            {
                return Result<bool>.Failure(MessageErrors.ConversationNotFound);
            }

            if(conversation.Type == ConversationType.Private)
            {
                var recipientId = conversation.GetPrivateRecipientIdFromSenderId(senderId);
                if (!recipientId.IsSuccess)
                {
                    return Result<bool>.Failure(recipientId.Error);
                }

                var permissionResult = await _privateMessagingPolicy.CheckAsync(
                    senderId,
                    recipientId.Value,
                    cancellationToken);

                if (!permissionResult.IsSuccess)
                {
                    return permissionResult;
                }
            }

            var existingMessage = await _messageRepository
                .GetByClientMessageIdAsync(
                    senderId,
                    command.ClientMessageId,
                    cancellationToken);

            if (existingMessage is not null)
            {
                var isSameOperation = 
                    existingMessage.Conversation.Id == conversation.Id
                    && existingMessage.Content == command.Content;

                return isSameOperation
                    ? Result<bool>.Success(true)
                    : Result<bool>.Failure(
                        MessageErrors.ClientMessageIdConflict);
            }

            var result = conversation.SendMessage(senderId, command.Content, command.ClientMessageId);

            if (!result.IsSuccess)
            {
                return Result<bool>.Failure(result.Error);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result<bool>.Success(true);
        }
    }
}
