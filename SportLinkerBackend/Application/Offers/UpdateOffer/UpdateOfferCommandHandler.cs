using Application.Abstractions;
using Application.Abstractions.Authentication;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Entities;
using Domain.Errors;

namespace Application.Offers.UpdateOffer
{
    public sealed class UpdateOfferCommandHandler : ICommandHandler<UpdateOfferCommand, Result<bool>>
    {
        private readonly IOfferRepository _offerRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;
        public UpdateOfferCommandHandler(IOfferRepository offerRepository, IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _offerRepository = offerRepository;
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }
        public async Task<Result<bool>> Handle(UpdateOfferCommand command, CancellationToken cancellationToken)
        {
            var offer = await _offerRepository.GetOfferByIdAsync(command.OfferId);

            if(offer is null)
            {
                return Result<bool>.Failure(OfferErrors.OfferNotFound);
            }

            if(_currentUser.UserId != offer.AuthorId)
            {
                return Result<bool>.Failure(OfferErrors.NotAuthorOfOffer);
            }

            DateTime parsedDate = command.Date.UtcDateTime;

            Location location = new Location(
                command.Location.Lat, 
                command.Location.Long, 
                command.Location.Country, 
                command.Location.State, 
                command.Location.City, 
                command.Location.Name, 
                command.Location.Street, 
                command.Location.HouseNumber, 
                command.Location.Type);

            var result = offer.UpdateDetails(command.Title, command.Description, command.Level, parsedDate, command.MaxParticipants, command.Mode, command.Availability, location);

            if (!result.IsSuccess) return result;

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return result;
        }
    }
}
