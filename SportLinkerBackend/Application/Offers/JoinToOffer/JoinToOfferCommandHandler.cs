using Application.Abstractions;
using Application.Abstractions.Authentication;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Domain.Errors;

namespace Application.Offers.JoinToOffer
{
    public sealed class JoinToOfferCommandHandler : ICommandHandler<JoinToOfferCommand, Result<bool>>
    {
        private readonly IOfferRepository _offerRepository;
        private readonly ICurrentUser _currentUser;
        private readonly IUnitOfWork _unitOfWork;

        public JoinToOfferCommandHandler(IOfferRepository offerRepository, ICurrentUser currentUser, IUnitOfWork unitOfWork)
        {
            _offerRepository = offerRepository;
            _currentUser = currentUser;
            _unitOfWork = unitOfWork;
        }
        public async Task<Result<bool>> Handle(JoinToOfferCommand command, CancellationToken cancellationToken)
        {
            var offer = await _offerRepository.GetOfferByIdAsync(command.OfferId);

            if(offer == null)
            {
                return Result<bool>.Failure(OfferErrors.OfferNotFound);
            }

            var result = offer.JoinToOffer(_currentUser.UserId);
            if (!result.IsSuccess)
            {
                return result;
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return result;
        }
    }
}
