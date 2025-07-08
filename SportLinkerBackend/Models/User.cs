using System.Reflection.Metadata;

namespace SportLinkerBackend.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string PhoneNumberCountryCode { get; set; } = string.Empty;
        public int? PhoneNumber { get; set; }
        public string? ProfilePictureUrl { get; set; }

        public DateTime? DateOfBirth { get; set; }


    }
}
