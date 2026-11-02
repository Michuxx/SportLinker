using Application.Abstractions;
using Application.Users.Dtos;

namespace Application.Users.GetUserOffers
{
    public sealed record GetUserOffersQuery(int UserId) : IQuery<List<OfferUser>>
    {
    }
}
