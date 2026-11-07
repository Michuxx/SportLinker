namespace Domain.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public int ConversationId { get; set; }
        public int? SenderId { get; set; }
        public string Content { get; set; } = String.Empty;
        public DateTime SendAt { get; set; } = DateTime.UtcNow;
        public Guid ClientMessageId { get; set; }
        public Conversation Conversation { get; set; } = default!;
        public User? Sender { get; set; }

        public static Message Create(int conversationId, int senderId, string content, Guid clientMessageId)
        {
            return new Message
            {
                ConversationId = conversationId,
                SenderId = senderId,
                Content = content,
                ClientMessageId = clientMessageId
            };
        }
    }
}
