using Domain.Abstractions;
using Domain.Enums;
using Domain.Errors;
using Domain.Events;

namespace Domain.Entities
{
    public class Offer
    {
        public int Id { get; set; }
        public string Title { get; set; } = default!;
        public string Description { get; set; } = default!;
        public LevelEnum Level { get; set; }
        public DateTime PlanningDate { get; set; }
        public DateTime CreatedAt { get; } = DateTime.UtcNow;
        public int MaxPeople { get; set; } = 2;
        public AvailabilityEnum Availability { get; set; } = AvailabilityEnum.Available;
        public ModeEnum Mode { get; set; }
        public int SportId { get; set; }
        public Sport Sport { get; set; } = default!;
        public int LocationId { get; set; }
        public Location Location { get; set; } = default!;
        public int AuthorId { get; private set; }
        public User Author { get; private set; } = default!;
        public Conversation Conversation { get; set; } = default!;
        public ICollection<OfferParticipant> Participants { get; set; } = new List<OfferParticipant>();
        public ICollection<OfferRequest> OfferRequests { get; set; } = new List<OfferRequest>();
        private readonly List<DomainEvent> _domainEvents = new List<DomainEvent>();
        private void RaiseDomainEvent(DomainEvent domainEvent)
        {
            _domainEvents.Add(domainEvent);
        }

        public ICollection<DomainEvent> DequeueDomainEvents()
        {
            var events = _domainEvents.ToArray();
            _domainEvents.Clear();
            return events;
        }
        public static Offer CreateOffer(string title, string description, LevelEnum level, DateTime planningDate, int maxPeople, ModeEnum modeEnum, int sportId, Location location, int userId)
        {
            var offer = new Offer
            {
                Title = title,
                Description = description,
                Level = level,
                PlanningDate = planningDate,
                MaxPeople = maxPeople,
                Mode = modeEnum,
                SportId = sportId,
                Location = location,
                AuthorId = userId
            };

            var offerParticipant = new OfferParticipant(offer.Id, userId);
            offer.Participants.Add(offerParticipant);
            offer.RaiseDomainEvent(new OfferCreated(userId));

            return offer;
        }

        public Result<bool> UpdateDetails(
            string title,
            string description,
            LevelEnum level,
            DateTime planningDateUtc,
            int maxPeople,
            ModeEnum mode,
            AvailabilityEnum availability,
            Location location)
        {
            int joinedParticipants = Participants.Count;

            if (maxPeople < joinedParticipants)
            {
                return Result<bool>.Failure(OfferErrors.CapacityTooLow);
            }

            if (maxPeople == joinedParticipants && availability == AvailabilityEnum.Available)
            {
                return Result<bool>.Failure(OfferErrors.FullOfferCannotBeAvailable);
            }

            Title = title;
            Description = description;
            Level = level;
            PlanningDate = planningDateUtc;
            MaxPeople = maxPeople;
            Mode = mode;
            Availability = availability;
            Location = location;

            return Result<bool>.Success(true);
        }

        public Result<bool> TransferAuthorship(int newAuthorId)
        {
            if (newAuthorId != AuthorId)
            {
                bool isParticipant = Participants.Any(p => p.UserId == newAuthorId);
                if (!isParticipant) return Result<bool>.Failure(OfferErrors.OfferParticipantNotFound);
                AuthorId = newAuthorId;
                return Result<bool>.Success(true);
            }
            return Result<bool>.Failure(OfferErrors.UserIsAuthor);
        }

        public Result<bool> LeaveOffer(int userId)
        {
            var participant = Participants.FirstOrDefault(x => x.UserId == userId);
            if (participant is null)
            {
                return Result<bool>.Failure(OfferErrors.OfferParticipantNotFound);
            }

            var remainingParticipants = Participants
                .Where(p => p.UserId != userId)
                .ToList();

            if (userId == AuthorId && remainingParticipants.Count > 0)
            {
                var newAuthor = remainingParticipants
                    .OrderBy(p => p.JoinDate)
                    .ThenBy(p => p.UserId)
                    .First();

                var result = TransferAuthorship(newAuthor.UserId);

                if (!result.IsSuccess)
                {
                    return result;
                }

                Participants.Remove(participant);
                return result;
            }
            Participants.Remove(participant);
            return Result<bool>.Success(true);
        }

        public Result<bool> CancelRequest(int userId)
        {
            var request = OfferRequests.FirstOrDefault(x => x.UserId == userId);
            if (request is null)
            {
                return Result<bool>.Failure(OfferErrors.OfferRequestNotFound);
            }

            OfferRequests.Remove(request);
            return Result<bool>.Success(true);
        }

        public Result<bool> DeleteParticipant(int userId)
        {
            if (userId == AuthorId)
            {
                return Result<bool>.Failure(OfferErrors.WrongPersonToDelete);
            }

            var participant = Participants.FirstOrDefault(x => x.UserId == userId);

            if(participant is null)
            {
                return Result<bool>.Failure(OfferErrors.OfferParticipantNotFound);
            }

            Participants.Remove(participant);
            return Result<bool>.Success(true);
        }

        public Result<bool> JoinToOffer(int userId)
        {
            if (Availability == AvailabilityEnum.Unavailable)
            {
                return Result<bool>.Failure(OfferErrors.OfferIsNotAvailable);
            }

            if (Participants.Any(p => p.UserId == userId))
            {
                return Result<bool>.Failure(OfferErrors.AlreadyParticipant);
            }

            if (Mode == ModeEnum.Private)
            {
                return SendOfferRequest(userId);
            }
            else
            {
                return AddParticipant(userId);
            }
        }

        public Result<bool> AddParticipantFromRequest(int userId)
        {
            var offerRequest = OfferRequests.FirstOrDefault(x => x.UserId == userId);

            if(offerRequest is null)
            {
                return Result<bool>.Failure(OfferErrors.OfferRequestNotFound);
            }

            if(Participants.Any(x => x.UserId == userId))
            {
                return Result<bool>.Failure(OfferErrors.AlreadyParticipant);
            }

            if(offerRequest.Status != RequestStatusEnum.Pending)
            {
                return Result<bool>.Failure(OfferErrors.WrongRequestStatus);
            }

            var result = AddParticipant(userId);

            if (!result.IsSuccess)
            {
                return result;
            }

            OfferRequests.Remove(offerRequest);
            return result;
        }

        public Result<bool> RejectParticipantFromRequest(int userId)
        {
            var offerRequest = OfferRequests.FirstOrDefault(x => x.UserId == userId);

            if (offerRequest is null)
            {
                return Result<bool>.Failure(OfferErrors.OfferRequestNotFound);
            }

            if (offerRequest.Status != RequestStatusEnum.Pending)
            {
                return Result<bool>.Failure(OfferErrors.WrongRequestStatus);
            }

            offerRequest.Status = RequestStatusEnum.Rejected;
            return Result<bool>.Success(true);
        }

        public Result<bool> DeleteRejectionFromRequest(int userId)
        {
            if(userId == AuthorId)
            {
                return Result<bool>.Failure(OfferErrors.CannotDeleteOwnRejection);
            }

            var offerRequest = OfferRequests.FirstOrDefault(x => x.UserId == userId);

            if (offerRequest is null)
            {
                return Result<bool>.Failure(OfferErrors.OfferRequestNotFound);
            }

            if (offerRequest.Status != RequestStatusEnum.Rejected)
            {
                return Result<bool>.Failure(OfferErrors.WrongRequestStatus);
            }

            OfferRequests.Remove(offerRequest);
            return Result<bool>.Success(true);
        }

        private Result<bool> AddParticipant(int userId)
        {
            if (Participants.Any(p => p.UserId == userId))
            {
                return Result<bool>.Failure(OfferErrors.AlreadyParticipant);
            }

            if (Participants.Count >= MaxPeople)
            {
                return Result<bool>.Failure(OfferErrors.MaximumCapacityOfOffer);
            }

            OfferParticipant newParticipant = new OfferParticipant(Id, userId);
            Participants.Add(newParticipant);
            RaiseDomainEvent(new ParticipantJoined(Id, userId));

            if (Participants.Count >= MaxPeople)
            {
                Availability = AvailabilityEnum.Unavailable;
            }

            return Result<bool>.Success(true);
        }

        private Result<bool> SendOfferRequest(int userId)
        {
            OfferRequest offerRequest = new OfferRequest(Id, userId);

            if (OfferRequests.Any(r => r.UserId == userId))
            {
                return Result<bool>.Failure(OfferErrors.AlreadySentRequestToOffer);
            }

            OfferRequests.Add(offerRequest);
            RaiseDomainEvent(new OfferRequestSent(Id, userId));
            return Result<bool>.Success(true);
        }
    }

}
