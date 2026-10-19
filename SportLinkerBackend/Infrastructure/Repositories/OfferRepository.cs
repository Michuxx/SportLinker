using Domain.Abstractions.Interfaces;
using Domain.Entities;
using Infrastructure.Database;

namespace Infrastructure.Repositories
{
    public class OfferRepository : IOfferRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public OfferRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void AddOffer(Offer offer)
        {
            _dbContext.Offers.Add(offer);
        }
    }
}
