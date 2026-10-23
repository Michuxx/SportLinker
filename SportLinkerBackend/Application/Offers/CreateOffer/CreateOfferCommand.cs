using Application.Abstractions;
using Application.Offers.Dtos;

namespace Application.Offers.CreateOffer
{
    public record CreateOfferCommand(int SportId, string Level, string Title, string Description, DateTimeOffset Date, LocationCreateOfferDto Location, int MaxParticipants, string Mode) : ICommand<Result<int>>
    {
    }
}
