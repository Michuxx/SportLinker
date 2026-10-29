using Application.Abstractions;
using Domain.Abstractions;

namespace Application.Offers.LeaveOffer
{
    public sealed record LeaveOfferCommand(int OfferId) : ICommand<Result<bool>>
    {
    }
}
