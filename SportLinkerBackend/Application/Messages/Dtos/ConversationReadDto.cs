namespace Application.Messages.Dtos
{
    public class ConversationReadDto
    {
        public int ConversationId { get; set; }
        public int ParticipantId { get; set; }
        public int UserId { get; set; }

        public DateTime JoinedAt { get; set; }
        public DateTime? LeftAt { get; set; }

        public int? LastReadMessageId { get; set; }
        public DateTime? LastReadMessageSendAt { get; set; }
        public DateTime? LastReadAt { get; set; }
    }
}
