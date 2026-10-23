using Domain.Enums;

namespace Application.Offers.Dtos
{
    public class OfferDetailsDto
    {
        public int OfferId { get; set; }
        public string Title { get; set; } = default!;
        public LevelEnum Level { get; set; } = default!;
        public string Description { get; set; } = default!;
        public DateTime Date { get; set; }
        public DateTime CreationDate { get; set; }
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
        public int MaxPeople { get; set; }
        public AvailabilityEnum Availability { get; set; } = default!;
        public ModeEnum Mode { get; set; } = default!;
        public RequestStatusEnum? Status { get; set; }
        public int AuthorId { get; set; }
        public OfferMemberDto Author { get; set; } = default!;
        public List<OfferMemberDto> Members { get; set; } = new List<OfferMemberDto>();
    }
}
