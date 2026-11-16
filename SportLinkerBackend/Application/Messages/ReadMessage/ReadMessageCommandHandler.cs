using Application.Abstractions;
using Application.Abstractions.Authentication;
using Application.Abstractions.Messaging;
using Application.Messages.Dtos;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Errors;
using Microsoft.Extensions.Logging;

namespace Application.Messages.ReadMessage
{
    public sealed class ReadMessageCommandHandler : ICommandHandler<ReadMessageCommand, Result<ConversationReadDto>>
    {
        private readonly ICurrentUser _currentUser;
        private readonly IMessageRepository _messageRepository;
        private readonly IChatNotifier _chatNotifier;
        private readonly ILogger<ReadMessageCommandHandler> _logger;

        public ReadMessageCommandHandler(
            ICurrentUser currentUser, 
            IMessageRepository messageRepository, 
            IChatNotifier chatNotifier, 
            ILogger<ReadMessageCommandHandler> logger)
        {
            _currentUser = currentUser;
            _messageRepository = messageRepository;
            _chatNotifier = chatNotifier;
            _logger = logger;
        }

        public async Task<Result<ConversationReadDto>> Handle(ReadMessageCommand command, CancellationToken cancellationToken)
        {
            var participant = await _messageRepository.MarkAsReadAsync(
              command.ConversationId,
              _currentUser.UserId,
              command.MessageId,
              cancellationToken);

            if(participant is null || participant.LastReadMessageId is not int lastReadMessageId)
            {
                return Result<ConversationReadDto>.Failure(MessageErrors.ParticipantNotFound);
            }

            var notification = new ConversationReadDto
            {
                ConversationId = participant.ConversationId,
                ParticipantId = participant.Id,
                UserId = participant.UserId,
                LastReadMessageId = lastReadMessageId,
                LastReadAt = participant.LastReadAt,
                JoinedAt = participant.JoinedAt,
                LeftAt = participant.LeftAt,
                LastReadMessageSendAt = participant.LastReadMessage?.SendAt,
                LastReadMessageClientMessageId = participant.LastReadMessage?.ClientMessageId,
                LastReadMessageSenderId = participant.LastReadMessage?.SenderId
            };

            try
            {
                using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(5));

                var recipients = await _messageRepository.GetReadNotificationRecipientsAsync(
                    notification.ConversationId,
                    lastReadMessageId,
                    timeout.Token);

                await _chatNotifier.NotifyConversationReadAsync(recipients, notification, timeout.Token);
            }
            catch(Exception ex)
            {
                _logger.LogWarning(
                    ex,
                    "Nie udało się wysłać powiadomienia o odczycie " +
                    "rozmowy {ConversationId} przez użytkownika {UserId}.",
                    notification.ConversationId,
                    notification.UserId);
            }

            return Result<ConversationReadDto>.Success(notification);


        }
    }
}
