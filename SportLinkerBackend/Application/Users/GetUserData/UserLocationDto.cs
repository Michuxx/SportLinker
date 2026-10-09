namespace Application.Users.GetUserData
{
    public class UserLocationDto
    {
        public float Long { get; set; }
        public float Lat { get; set; }
        public string? Country { get; set; }
        public string? Name { get; set; }
        public string? State { get; set; }
        public string? DisplayLabel { get; set; }
    }
}
