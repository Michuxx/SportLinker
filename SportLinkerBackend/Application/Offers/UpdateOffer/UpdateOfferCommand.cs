using Application.Abstractions;
using Application.Offers.Dtos;
using Domain.Enums;

namespace Application.Offers.UpdateOffer
{
    public sealed record UpdateOfferCommand(AvailabilityEnum Availability, LevelEnum Level, string Title, string Description, LocationCreateOfferDto Location, DateTimeOffset Date, int MaxParticipants, ModeEnum Mode, int OfferId) : ICommand<Result<bool>>
    {
    }
}
