using Domain.Enums;

namespace Application.Users.Dtos
{
    public class UserDataDto
    {
        public string UserName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string? BirthDate { get; set; }
        public string? Gender { get; set; }
        public string? AboutMe { get; set; }
        public string? ProfileImage { get; set; }
        public string? BackgroundImage { get; set; }
        public int CreatedOffers { get; set; }
        public int JoinedOffers { get; set; }
        public int Invitations { get; set; }
        public double? Long { get; set; }
        public double? Lat { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? State { get; set; }
        public string? Name { get; set; } // Name of the location
        public string? DisplayLabel => !string.IsNullOrWhiteSpace(Name) && !string.IsNullOrWhiteSpace(State)
                                        ? $"{Name}, {State}"
                                        : Name ?? State;
        public List<SportDto> FavouriteSports { get; set; } = new();
    }
}
