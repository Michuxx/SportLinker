namespace Domain.Entities
{
    public class OfferParticipant
    {
        public int Id { get; set; }
        public int OfferId { get; set; }
        public Offer Offer { get; set; } = default!;
        public int UserId { get; set; }
        public User User { get; set; } = default!;
        public DateTime JoinDate { get; } = DateTime.UtcNow;

        public OfferParticipant(int offerId, int userId)
        {
            OfferId = offerId;
            UserId = userId;
        }
    }
}
