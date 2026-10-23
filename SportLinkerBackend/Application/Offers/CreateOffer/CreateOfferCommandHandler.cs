using Application.Abstractions;
using Application.Abstractions.Authentication;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Entities;
using Domain.Enums;

namespace Application.Offers.CreateOffer
{
    internal sealed class CreateOfferCommandHandler : ICommandHandler<CreateOfferCommand, Result<int>>
    {
        private readonly IOfferRepository _offerRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;
        public CreateOfferCommandHandler(IOfferRepository offerRepository, IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _offerRepository = offerRepository;
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }
        public async Task<Result<int>> Handle(CreateOfferCommand command, CancellationToken cancellationToken)
        {
            LevelEnum level = Enum.Parse<LevelEnum>(command.Level, ignoreCase: true);
            ModeEnum mode = Enum.Parse<ModeEnum>(command.Mode, ignoreCase: true);
            DateTime parsedDate = command.Date.UtcDateTime;

            Location location = new Location(command.Location.Lat, command.Location.Long, command.Location.Country, command.Location.State, command.Location.City, command.Location.Name, command.Location.Street, command.Location.HouseNumber, command.Location.Type);

            var offer = Offer.CreateOffer(command.Title, command.Description, level, parsedDate, command.MaxParticipants, mode, command.SportId, location, _currentUser.UserId);
            _offerRepository.AddOffer(offer);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result<int>.Success(offer.Id);
        }
    }
}
