using Domain.ValueObjects.Location;

namespace Domain.Entities
{
    public class Location
    {
        public int Id { get; set; }
        public Coordinates Coordinates { get; set; } = new Coordinates(0, 0);
        public string? Country { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }
        public string? Name { get; set; }
        public string? Street { get; set; }
        public string? HouseNumber { get; set; }
        public string? Type { get; set; }

        public ICollection<User> Users { get; set; } = new List<User>();   
    }
}
