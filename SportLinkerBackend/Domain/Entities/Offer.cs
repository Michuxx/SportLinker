using Domain.Abstractions;
using Domain.Enums;
using Domain.Errors;

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
        public ICollection<OfferParticipant> Participants { get; set; } = new List<OfferParticipant>();
        public ICollection<OfferRequest> OfferRequests { get; set; } = new List<OfferRequest>();
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

            var OfferParticipant = new OfferParticipant(offer.Id, userId);
            offer.Participants.Add(OfferParticipant);

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

        public bool TransferAuthorship(int newAuthorId)
        {
            if (newAuthorId <= 0) return false;
            if (newAuthorId != AuthorId)
            {
                bool isParticipant = Participants.Any(p => p.UserId == newAuthorId);
                if (!isParticipant) return false;
                AuthorId = newAuthorId;
                return true;
            }
            return false;
        }

        public Result<bool> DeleteParticipant(int userId)
        {
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
                OfferRequest offerRequest = new OfferRequest(Id, userId);

                if (OfferRequests.Any(r => r.UserId == userId))
                {
                    return Result<bool>.Failure(OfferErrors.AlreadySentRequestToOffer);
                }

                OfferRequests.Add(offerRequest);
            }
            else
            {
                return AddParticipant(userId);
            }

            return Result<bool>.Success(true);
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

            Participants.Add(new OfferParticipant(Id, userId));
            if (Participants.Count >= MaxPeople)
            {
                Availability = AvailabilityEnum.Unavailable;
            }

            return Result<bool>.Success(true);
        }

    }

}
