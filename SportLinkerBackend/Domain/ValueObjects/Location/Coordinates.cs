namespace Domain.ValueObjects.Location
{
    public record Coordinates
    {
        public double Latitude { get; }
        public double Longitude { get; }
        public Coordinates(double latitude, double longitude)
        {
            Latitude = latitude;
            Longitude = longitude;
        }
    }
}
