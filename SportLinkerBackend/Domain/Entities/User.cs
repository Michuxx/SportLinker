using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class User
    {
        public int Id {  get; set; }
        public string Name { get; set; } = default!;
        public string Email { get; set; } = default!;
        public DateOnly? BirthDate { get; set; }
        public string? Gender { get; set; }
        public string? AboutMe { get; set; } 
        public string? ProfileImage { get; set; }
        public string? BackgroundImage { get; set; } 
        public int? PhoneNumber { get; set; }
        public int? PhoneExtension { get; set; }
        public int CreatedOffers { get; set; }
        public int JoinedOffers { get; set; }
        public int Invitations { get; set; }
        public int? LocationId { get; set; }
        public Location? Location { get; set; }
        public string Role { get; set; } = "User";
    }
}
