namespace Application.Users.Dtos
{
    public class UserLocationDto
    {
        public double Long { get; set; }
        public double Lat { get; set; }
        public string? Country { get; set; }
        public string? Name { get; set; }
        public string? State { get; set; }
        public string? DisplayLabel { get; set; }
    }
}
