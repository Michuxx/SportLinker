using Application.Abstractions;
using Application.Abstractions.Authentication;
using Application.Messages.Policies;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Domain.Errors;
using Microsoft.VisualBasic;

namespace Application.Messages.CreatePrivateConversation
{
    public sealed class CreatePrivateConversationCommandHandler : ICommandHandler<CreatePrivateConversationCommand, Result<int>>
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

        public async Task<Result<int>> Handle(CreatePrivateConversationCommand command, CancellationToken cancellationToken)
        {
            var senderId = _currentUser.UserId;

            if(senderId == command.ReceiverId)
            {
                return Result<int>.Failure(MessageErrors.CannotSendMessageToYourself);
            }

            var friendshipResult = await _privateMessagingPolicy.CheckAsync(senderId, command.ReceiverId, cancellationToken);

            if (!friendshipResult.IsSuccess)
            {
                return Result<int>.Failure(friendshipResult.Error);
            }

            string pairKey = $"{Math.Min(senderId, command.ReceiverId)}:{Math.Max(senderId, command.ReceiverId)}";

            Conversation conversation;

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
                    ? Result<int>.Success(existingMessage.Conversation.Id)
                    : Result<int>.Failure(
                        MessageErrors.ClientMessageIdConflict);
            }

            var existingConversation = await _messageRepository.GetPrivateConversationByPairKey(pairKey, cancellationToken);

            if (existingConversation is not null)
            {
                conversation = existingConversation;
                var addingParticipantBackResult = existingConversation.RestorePrivateParticipants(senderId, command.ReceiverId);

                if (!addingParticipantBackResult.IsSuccess)
                {
                    return Result<int>.Failure(addingParticipantBackResult.Error);
                }

                var sendResult = existingConversation.SendMessage(
                senderId,
                command.Content,
                command.ClientMessageId);

                if (!sendResult.IsSuccess)
                {
                    return Result<int>.Failure(sendResult.Error);
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
                    return Result<int>.Failure(newConversation.Error);
                }

                conversation = newConversation.Value!;
                _messageRepository.AddConversation(newConversation.Value!);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<int>.Success(conversation.Id);
        }
    }
}
