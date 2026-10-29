using Application.Abstractions;
using Domain.Abstractions;

namespace Application.Offers.DeleteParticipantFromOffer
{
    public sealed record DeleteParticipantFromOfferCommand(int OfferId, int UserId) : ICommand<Result<bool>>
    {
    }
}
