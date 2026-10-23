using Domain.Enums;

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

        public bool JoinToOffer(int userId)
        {
            if (AvailabilityEnum == AvailabilityEnum.Unavailable) return false;
            if (Participants.Count >= MaxPeople) return false;

            var participant = new OfferParticipant(Id, userId);
            Participants.Add(participant);
            return true;
        }

        public bool SendRequestToJoin(int userId)
        {
            if (AvailabilityEnum == AvailabilityEnum.Unavailable) return false;
            if (Participants.Count >= MaxPeople) return false;

            var participant = new OfferRequest(Id, userId);
            OfferRequests.Add(participant);
            return true;
        }
    }

}
