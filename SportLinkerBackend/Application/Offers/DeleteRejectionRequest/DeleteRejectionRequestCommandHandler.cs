using Application.Abstractions;
using Application.Abstractions.Authentication;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Errors;

namespace Application.Offers.DeleteRejectionRequest
{
    public sealed class DeleteRejectionRequestCommandHandler : ICommandHandler<DeleteRejectionRequestCommand, Result<bool>>
    {
        private readonly IOfferRepository _offerRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;
        public DeleteRejectionRequestCommandHandler(IOfferRepository offerRepository, IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _offerRepository = offerRepository;
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }
        public async Task<Result<bool>> Handle(DeleteRejectionRequestCommand request, CancellationToken cancellationToken)
        {
            var offer = await _offerRepository.GetOfferByIdAsync(request.OfferId);
            if (offer is null)
            {
                return Result<bool>.Failure(OfferErrors.OfferNotFound);
            }

            var result = offer.DeleteRejectionFromRequest(_currentUser.UserId);
            if (!result.IsSuccess)
            {
                return result;
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return result;
        }
    }
}
