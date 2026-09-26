using Domain.Enums;
using Domain.ValueObjects;
using System.Net.Mail;

namespace Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = default!;
        public PersonalData PersonalData { get; set; } = default!;
        public UserImages? Images { get; set; }
        public Phone? Phone { get; set; }
        public UserStatistics? Statistics { get; set; }
        public int? LocationId { get; set; }
        public Location? Location { get; set; }
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



