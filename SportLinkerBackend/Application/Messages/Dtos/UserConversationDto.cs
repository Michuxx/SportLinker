using Domain.Enums;

namespace Application.Messages.Dtos
{
    public sealed class UserConversationDto
    {
        public int Id { get; set; }
        public ConversationType Type { get; set; }
        public string Name { get; set; } = default!;
        public string? ImageUrl { get; set; }
        public int? RecipientUserId { get; set; }

        public bool? IsOnline { get; set; }
        public DateTime? LastTimeOnline { get; set; }
        public bool CanSendMessages { get; set; }

        public int? LastMessageId { get; set; }
        public string? LastMessageSenderName { get; set; }
        public string? LastMessageText { get; set; }
        public DateTime? LastMessageTime { get; set; }
    }
}
