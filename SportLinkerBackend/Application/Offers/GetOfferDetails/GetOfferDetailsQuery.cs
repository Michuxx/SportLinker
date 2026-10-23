using Application.Abstractions;
using Application.Offers.Dtos;

namespace Application.Offers.GetOfferDetails
{
    public sealed record GetOfferDetailsQuery(int OfferId, int? UserId) : IQuery<Result<OfferDetailsDto>>
    {
    }
}
