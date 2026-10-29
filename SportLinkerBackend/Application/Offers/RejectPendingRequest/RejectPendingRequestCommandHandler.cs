using Application.Abstractions;
using Application.Abstractions.Authentication;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Errors;

namespace Application.Offers.RejectPendingRequest
{
    public sealed class RejectPendingRequestCommandHandler : ICommandHandler<RejectPendingRequestCommand, Result<bool>>
    {
        private readonly IOfferRepository _offerRepository;
        private readonly ICurrentUser _currentUser;
        private readonly IUnitOfWork _unitOfWork;

        public RejectPendingRequestCommandHandler(ICurrentUser currentUser, IOfferRepository offerRepository, IUnitOfWork unitOfWork)
        {
            _offerRepository = offerRepository;
            _currentUser = currentUser;
            _unitOfWork = unitOfWork;
        }
        public async Task<Result<bool>> Handle(RejectPendingRequestCommand command, CancellationToken cancellationToken)
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

            var result = offer.RejectParticipantFromRequest(command.UserId);
            if(!result.IsSuccess)
            {
                return result;
            }
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return result;
        }
    }
}
