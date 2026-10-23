namespace Application.Offers.Dtos
{
    public class OfferMemberDto
    {
        public int UserId { get; set; }
        public string Name { get; set; } = default!;
        public DateTime JoinDate { get; set; }
        public string? Image { get; set; }
    }
}
