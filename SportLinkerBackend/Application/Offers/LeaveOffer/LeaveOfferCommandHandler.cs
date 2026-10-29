using Application.Abstractions;
using Application.Abstractions.Authentication;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Errors;

namespace Application.Offers.LeaveOffer
{
    public sealed class LeaveOfferCommandHandler : ICommandHandler<LeaveOfferCommand, Result<bool>>
    {
        private readonly ICurrentUser _currentUser;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOfferRepository _offerRepository;
        public LeaveOfferCommandHandler(IOfferRepository offerRepository, ICurrentUser currentUser, IUnitOfWork unitOfWork)
        {
            _offerRepository = offerRepository;
            _currentUser = currentUser;
            _unitOfWork = unitOfWork;

        }
        public async Task<Result<bool>> Handle(LeaveOfferCommand command, CancellationToken cancellationToken) 
        {
            var offer = await _offerRepository.GetOfferByIdAsync(command.OfferId);
            if (offer is null)
            {
                return Result<bool>.Failure(OfferErrors.OfferNotFound);
            }

            var result = offer.LeaveOffer(_currentUser.UserId);

            if (!result.IsSuccess)
            {
                return result;
            }

            if (offer.Participants.Count == 0)
            {
                _offerRepository.DeleteOffer(offer);
            }
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return result;
        }
    }
}
