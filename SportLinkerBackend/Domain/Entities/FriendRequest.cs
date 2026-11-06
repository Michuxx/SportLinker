namespace Domain.Entities
{
    public class FriendRequest
    {
        public int Id { get; set; }
        public int SenderId { get; private set; }
        public int ReceiverId { get; private set; }
        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

        public static FriendRequest Create(int senderId, int receiverId)
        {
            return new FriendRequest
            {
                SenderId = senderId,
                ReceiverId = receiverId
            };
        }
    }
}
