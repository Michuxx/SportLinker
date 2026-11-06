namespace Application.Users.Dtos
{
    public class UserFriendInvitation
    {
        public int FriendRequestId { get; set; }
        public int SenderId { get; set; }
        public string SenderUsername { get; set; } = default!;
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
