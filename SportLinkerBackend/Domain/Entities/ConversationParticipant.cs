namespace Domain.Entities
{
    public class ConversationParticipant
    {
        public int Id { get; set; }
        public int ConversationId { get; set; }
        public int UserId { get; set; }
        public int? LastReadMessageId { get; set; }
        public DateTime? LastReadAt { get; set; }
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LeftAt { get; private set; }
        public Conversation Conversation { get; set; } = default!;
        public User User { get; set; } = default!;
        public Message? LastReadMessage { get; set; } 

        public static ConversationParticipant Create(int conversationId, int userId)
        {
            return new ConversationParticipant
            {
                ConversationId = conversationId,
                UserId = userId
            };
        }

        public void Leave()
        {
            LeftAt ??= DateTime.UtcNow;
        }
    }
}
