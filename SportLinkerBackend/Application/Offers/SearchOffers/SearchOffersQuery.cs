using Application.Abstractions;
using Application.Offers.Dtos;
using Application.Offers.Enums;
using Domain.Enums;

namespace Application.Offers.SearchOffers
{
    public sealed record SearchOffersQuery(
        int? UserId, 
        string? Search, 
        int? SportId,
        OfferSearchLocationDto? Location, 
        DateTimeOffset? DateFrom,
        DateTimeOffset? DateToExclusive, 
        int? MinParticipants, 
        int? MaxParticipants,
        LevelEnum Level = LevelEnum.Any,
        int Page = 1, 
        int PageSize = 12,
        SortOrderEnum SortOrder = SortOrderEnum.ASC,
        SortOptionsEnum SortOption = SortOptionsEnum.Players
        ) : IQuery<OffersPageDto>
    {
    }
}
