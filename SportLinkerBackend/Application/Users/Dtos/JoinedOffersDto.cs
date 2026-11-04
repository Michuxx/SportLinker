using Domain.Enums;

namespace Application.Users.Dtos
{
    public class JoinedOffersDto
    {
        public int OfferId { get; set; }
        public string OfferName { get; set; } = default!;
        public string OfferDescription { get; set; } = default!;
        public DateTime OfferDate { get; set; }
        public int MaxPeople { get; set; }
        public int CurrentPeople { get; set; }
        public string Sport { get; set; } = default!;
        public LevelEnum Level { get; set; }
        public AvailabilityEnum Availability { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? DisplayLabel =>
            !string.IsNullOrWhiteSpace(City)
            && !string.IsNullOrWhiteSpace(Name)
            && !string.IsNullOrWhiteSpace(Street)
                ? $"{City}, ul. {Street}, {Name}"
                : Name ?? City;
        public string? HouseNumber { get; set; }
        public double Lat { get; set; }
        public double Long { get; set; }
        public string? Name { get; set; }
        public string? State { get; set; }
        public string? Street { get; set; }
        public string? Type { get; set; }
    }
}
