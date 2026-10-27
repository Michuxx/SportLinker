using Application.Abstractions;
using Application.Offers.Dtos;

namespace Application.Offers.GetOfferRequests
{
    public sealed record GetOfferRequestsQuery(int OfferId) : IQuery<List<OfferRequestDto>>
    {
    }
}
