using Domain.Enums;
using Domain.ValueObjects.User;
using System.Net.Mail;

namespace Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = default!;
        public string PasswordHash { get; set; } = default!;
        public PersonalData PersonalData { get; set; } = default!;
        public UserImages? Images { get; set; }
        public Phone? Phone { get; set; }
        public UserStatistics Statistics { get; set; } = new UserStatistics();
        public int? LocationId { get; set; }
        public Location? Location { get; set; }
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
        public Role Role { get; set; } = Role.User;
        
        public void ChangeEmail(string newEmail)
        {

            if (string.IsNullOrWhiteSpace(newEmail))
            {
                throw new ArgumentException("Adres e-mail nie może być pusty.", nameof(newEmail));
            }

            try
            {
                var mailAddress = new MailAddress(newEmail);

                if (mailAddress.Address != newEmail)
                {
                    throw new FormatException("Niepoprawny format adresu e-mail.");
                }
            }
            catch (Exception ex) when (ex is FormatException || ex is ArgumentException)
            {
                throw new ArgumentException("Podany adres e-mail jest nieprawidłowy.", nameof(newEmail), ex);
            }

            Email = newEmail;
        }
    }
}



