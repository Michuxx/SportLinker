namespace Application.Friends.Dtos
{
    public class UserFriendDto
    {
        public int FriendshipId { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; } = default!;
        public string? ImageUrl { get; set; }
        public int? ConversationId { get; set; }
        public bool IsOnline { get; set; } = false;
        public DateTime? LastTimeOnline { get; set; }
    }
}
