using Domain.Abstractions.Interfaces;
using Domain.Entities;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

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

        public async Task<Offer?> GetOfferByIdAsync(int offerId)
        {
            return await _dbContext.Offers
                .Include(o => o.Participants)
                .Include(o => o.OfferRequests)
                .FirstOrDefaultAsync(x => x.Id == offerId);
        }

        public void DeleteOffer(Offer offer)
        {
            _dbContext.Remove(offer);
        }
    }
}
