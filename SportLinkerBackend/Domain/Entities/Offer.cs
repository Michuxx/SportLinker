using Application.Abstractions;
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
        public AvailabilityEnum AvailabilityEnum { get; set; } = AvailabilityEnum.Available;
        public ModeEnum ModeEnum { get; set; }
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
                ModeEnum = modeEnum,
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
            ModeEnum = mode;
            AvailabilityEnum = availability;
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

        public Result<bool> JoinToOffer(int userId)
        {
            if (AvailabilityEnum == AvailabilityEnum.Unavailable)
            {
                return Result<bool>.Failure(OfferErrors.OfferIsNotAvailable);
            }

            if (Participants.Count >= MaxPeople)
            {
                return Result<bool>.Failure(OfferErrors.MaximumCapacityOfOffer);
            }

            var participant = new OfferParticipant(Id, userId);

            if (Participants.Contains(participant))
            {
                return Result<bool>.Failure(OfferErrors.AlreadyJoinedToOffer);
            }

            if (ModeEnum == ModeEnum.Private)
            {
                OfferRequest offerRequest = new OfferRequest(Id, userId);
                if (OfferRequests.Contains(offerRequest))
                {
                    return Result<bool>.Failure(OfferErrors.AlreadySentRequestToOffer);
                }

                OfferRequests.Add(offerRequest);
            }
            else
            {
                Participants.Add(participant);
            }

            return Result<bool>.Success(true);
        }
    }

}
