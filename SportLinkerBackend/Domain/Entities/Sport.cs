
namespace Domain.Entities
{
    public class Sport
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public ICollection<FavouriteUserSport> FavouriteUserSports { get; set; } = new List<FavouriteUserSport>();
    }
}
