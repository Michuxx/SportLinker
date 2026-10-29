using Application.Abstractions;
using Application.Abstractions.Authentication;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Errors;

namespace Application.Offers.CancelRequest
{
    public sealed class CancelRequestCommandHandler : ICommandHandler<CancelRequestCommand, Result<bool>>
    {
        private readonly ICurrentUser _currentUser;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOfferRepository _offerRepository;
        public CancelRequestCommandHandler(IOfferRepository offerRepository, ICurrentUser currentUser, IUnitOfWork unitOfWork)
        {
            _offerRepository = offerRepository;
            _currentUser = currentUser;
            _unitOfWork = unitOfWork;

        }
        public async Task<Result<bool>> Handle(CancelRequestCommand command, CancellationToken cancellationToken) 
        {
            var offer = await _offerRepository.GetOfferByIdAsync(command.OfferId);
            if (offer is null)
            {
                return Result<bool>.Failure(OfferErrors.OfferNotFound);
            }

            var result = offer.CancelRequest(_currentUser.UserId);

            if (!result.IsSuccess)
            {
                return result;
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return result;
        }
    }
}
