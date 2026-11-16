using Application.Abstractions;
using Application.Offers.Dtos;
using Application.Offers.Enums;
using Domain.Enums;

namespace Application.Offers.SearchOffers
{
    public sealed record SearchOfferQuery(
        int? UserId, 
        string? Search, 
        int? SportId,
        OfferSearchLocationDto? Location, 
        DateTimeOffset? DateFrom,
        DateTimeOffset? DateToExclusive, 
        int? MinParticipants, 
        int? MaxParticipants,
        LevelEnum? Level,
        SortOrderEnum SortOrder = SortOrderEnum.ASC,
        SortOptionsEnum SortOption = SortOptionsEnum.Players,
        int Page = 1, 
        int PageSize = 12
        ) : IQuery<OffersPageDto>
    {
    }
}
