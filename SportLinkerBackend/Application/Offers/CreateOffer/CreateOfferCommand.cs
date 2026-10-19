using Application.Abstractions;
using Application.Offers.Dtos;

namespace Application.Offers.CreateOffer
{
    public record CreateOfferCommand(int SportId, string Level, string Title, string Description, string Date, LocationCreateOfferDto Location, int MaxParticipants, string Mode, int UserId) : ICommand<Result<int>>
    {
    }
}
