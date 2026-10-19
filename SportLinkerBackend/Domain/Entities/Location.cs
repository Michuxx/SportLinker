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
        public Location(double latitude, double longitude, string? Country, string? State, string? City, string? Name, string? Street, string? HouseNumber, string? Type)
        {
            Coordinates = new Coordinates(latitude, longitude);
            this.Country = Country;
            this.State = State;
            this.City = City;
            this.Name = Name;
            this.Street = Street;
            this.HouseNumber = HouseNumber;
            this.Type = Type;
        }

        public ICollection<User> Users { get; set; } = new List<User>();   
        public ICollection<Offer> Offers { get; set; } = new List<Offer>();
    }
}
