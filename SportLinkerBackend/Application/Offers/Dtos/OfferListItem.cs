using Domain.Enums;

namespace Application.Offers.Dtos
{
    public class OfferListItem
    {
        public int OfferId { get; set; }
        public string Title { get; set; } = default!;
        public string Description { get; set; } = default!;
        public int SportId { get; set; }
        public string SportName { get; set; } = default!;
        public LevelEnum Level { get; set; }
        public DateTime Date { get; set; }
        public string? City { get; set; } 
        public string? State { get; set; } 
        public int CurrentPeople { get; set; }
        public int MaxPeople { get; set; }
        public ModeEnum Mode { get; set; }
        public int AuthorId { get; set; }
        public string AuthorName { get; set; } = default!;
    }
}
