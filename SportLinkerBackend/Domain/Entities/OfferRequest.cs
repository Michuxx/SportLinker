using Domain.Enums;

namespace Domain.Entities
{
    public class OfferRequest
    {
        public int Id { get; set; }
        public int OfferId { get; set; }
        public Offer Offer { get; set; } = default!;
        public int UserId { get; set; }
        public User User { get; set; } = default!;
        public RequestStatusEnum Status { get; set; } = RequestStatusEnum.Pending;
        public DateTime RequestDate { get; set; } = DateTime.UtcNow;

        public OfferRequest()
        {
        }

        public OfferRequest(int offerId, int userId)
        {
            OfferId = offerId;
            UserId = userId;
        }
    }
}
