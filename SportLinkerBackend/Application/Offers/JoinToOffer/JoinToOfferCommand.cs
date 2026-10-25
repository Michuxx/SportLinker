using Application.Abstractions;

namespace Application.Offers.JoinToOffer
{
    public sealed record JoinToOfferCommand(int OfferId) : ICommand<Result<bool>>
    {
    }
}
