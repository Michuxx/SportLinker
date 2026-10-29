using Application.Abstractions;
using Application.Abstractions.Authentication;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Errors;

namespace Application.Offers.DeleteParticipantFromOffer
{
    public sealed class DeleteParticipantFromOfferCommandHandler : ICommandHandler<DeleteParticipantFromOfferCommand, Result<bool>>
    {
        private readonly IOfferRepository _offerRepository;
        private readonly ICurrentUser _currentUser;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteParticipantFromOfferCommandHandler(IOfferRepository offerRepository, ICurrentUser currentUser, IUnitOfWork unitOfWork)
        {
            _offerRepository = offerRepository;
            _currentUser = currentUser;
            _unitOfWork = unitOfWork;
            
        }
        public async Task<Result<bool>> Handle(DeleteParticipantFromOfferCommand command, CancellationToken cancellationToken)
        {
            var offer = await _offerRepository.GetOfferByIdAsync(command.OfferId);
            if (offer is null)
            {
                return Result<bool>.Failure(OfferErrors.OfferNotFound);
            }

            if (_currentUser.UserId != offer.AuthorId)
            {
                return Result<bool>.Failure(OfferErrors.NotAuthorOfOffer);
            }

            if(command.UserId == offer.AuthorId)
            {
                return Result<bool>.Failure(OfferErrors.WrongPersonToDelete);
            }

            var result = offer.DeleteParticipant(command.UserId);
            return result;
        }
    }
}
