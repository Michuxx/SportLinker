namespace Application.Offers.Dtos
{
    public class OfferRequestDto
    {
        public int UserId { get; set; }
        public string? UserImage { get; set; }
        public string Name { get; set; } = default!;
    }
}
