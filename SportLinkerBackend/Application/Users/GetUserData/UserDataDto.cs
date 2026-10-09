namespace Application.Users.GetUserData
{
    public class UserDataDto
    {
        public int Id { get; set; }
        public string? AboutMe { get; set; }
        public List<SportDto> FavouriteSports = new List<SportDto>();
        public DateTime BirthDate { get; set; }
        public int CreatedOffers { get; set; }
        public int JoinedOffers { get; set; }
        public int Invitations { get; set; }
        public Gender? Gender { get; set; }
        public UserLocationDto? Location { get; set; }
        public string? ProfileImage { get; set; }
        public string? BackgroundImage { get; set; }
    }
}
