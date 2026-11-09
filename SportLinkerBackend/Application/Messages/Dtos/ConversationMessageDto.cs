namespace Application.Messages.Dtos
{
    public class ConversationMessageDto 
    {
        public int Id { get; set; }
        public int? SenderId { get; set; }
        public string SenderName { get; set; } = default!;
        public string Content { get; set; } = default!;
        public DateTime SendAt { get; set; }
        public Guid ClientMessageId { get; set; }
        public bool IsOwnMessage { get; set; }
    }

    public sealed record MessageCursorDto(
    DateTimeOffset SendAt,
    int Id);

    public sealed record MessagesPageDto(
    List<ConversationMessageDto> Items,
    bool HasMore,
    MessageCursorDto? NextCursor);
}
