namespace Domain.Entities
{
    public class FavouriteUserSport
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int SportId { get; set; }
        public User User { get; set; } = default!;
        public Sport Sport { get; set; } = default!;
    }
}
