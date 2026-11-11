namespace Application.Messages.IntegrationEvents
{
    public sealed record MessageSentIntegrationEvent(int MessageId, int ConversationId, int? SenderId, Guid ClientMessageId, string Content, DateTime SendAt)
    {
        public const string EventType = "MessageSent.v1";
    }
}
