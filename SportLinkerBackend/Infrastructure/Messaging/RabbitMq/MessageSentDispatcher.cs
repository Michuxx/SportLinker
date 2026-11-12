using Application.Abstractions.Messaging;
using Application.Messages.Dtos;
using Application.Messages.IntegrationEvents;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Messaging.RabbitMq;

public sealed class MessageSentDispatcher(
    ApplicationDbContext dbContext,
    IChatNotifier notifier)
{
    public async Task DispatchAsync(
        MessageSentIntegrationEvent integrationEvent,
        CancellationToken cancellationToken)
    {
        var message = await dbContext.Messages
            .AsNoTracking()
            .Where(m =>
                m.Id == integrationEvent.MessageId &&
                m.ConversationId == integrationEvent.ConversationId)
            .Select(m => new
            {
                m.Id,
                m.ConversationId,
                m.SenderId,
                SenderName = m.Sender == null
                    ? "USUNIĘTY UŻYTKOWNIK"
                    : m.Sender.PersonalData.Name,
                m.Content,
                m.SendAt,
                m.ClientMessageId
            })
            .SingleOrDefaultAsync(cancellationToken);

        // Rozmowa mogła zostać usunięta przed obsługą zdarzenia.
        if (message is null)
        {
            return;
        }

        var recipients = await dbContext.ConversationParticipants
            .AsNoTracking()
            .Where(p =>
                p.ConversationId == message.ConversationId &&
                p.JoinedAt <= message.SendAt &&
                (p.LeftAt == null || message.SendAt < p.LeftAt))
            .Select(p => p.UserId)
            .Distinct()
            .ToListAsync(cancellationToken);

        foreach (var recipientId in recipients)
        {
            var dto = new ConversationMessageDto
            {
                Id = message.Id,
                SenderId = message.SenderId,
                SenderName = message.SenderName,
                Content = message.Content,
                SendAt = DateTime.SpecifyKind(
                    message.SendAt, DateTimeKind.Utc),
                ClientMessageId = message.ClientMessageId,
                IsOwnMessage = message.SenderId == recipientId
            };

            await notifier.NotifyMessageAsync(
                recipientId,
                new MessageReceivedDto(message.ConversationId, dto),
                cancellationToken);
        }
    }
}