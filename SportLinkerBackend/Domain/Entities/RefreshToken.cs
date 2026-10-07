namespace Domain.Entities
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string Token { get; set; } = default!;
        public int UserId { get; set; }
        public User User { get; set; } = default!;
        public DateTime ExpiresOnUtc { get; set; }
        public DateTime CreatedOnUtc { get; set; }
        public DateTime? RevokedOnUtc { get; set; } 
        public bool IsExpired => DateTime.UtcNow >= ExpiresOnUtc;
        public bool IsActive => RevokedOnUtc == null && !IsExpired;
    }
}
