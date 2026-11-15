namespace Application.Offers.Dtos
{
    public sealed record OffersPageDto(List<OfferListItem> Items, int TotalCount, int Page, int PageSize)
    {
    }
}
