using Domain.Entities;

namespace Domain.Abstractions.Interfaces
{
    public interface IOfferRepository
    {
        void AddOffer(Offer offer);
    }
}
