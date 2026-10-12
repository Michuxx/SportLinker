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
        public ICollection<FavouriteUserSport> FavouriteUserSports { get; set; } = new List<FavouriteUserSport>();
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

        public void UpdateBasicInfo(string name, DateOnly? birthDate, Gender? gender, Location? location)
        {
            PersonalData = PersonalData.UpdateBasicInfo(name, birthDate, gender);

            if (location == null)
            {
                Location = null;
                LocationId = null;
            }
            else if (Location != null)
            {
                Location.Coordinates = location.Coordinates;
                Location.Country = location.Country;
                Location.State = location.State;
                Location.City = location.City;
                Location.Name = location.Name;
            }
            else
            {
                Location = location;
            }
        }

        public void UpdateAboutMe(string? aboutMe)
        {
            PersonalData = PersonalData.UpdateAboutMe(aboutMe);
        }

        public void UpdateFavouriteSports(IEnumerable<int> sportIds)
        {
            FavouriteUserSports.Clear();
            if (sportIds != null)
            {
                foreach (var sportId in sportIds.Distinct())
                {
                    FavouriteUserSports.Add(new FavouriteUserSport { UserId = Id, SportId = sportId });
                }
            }
        }

        public void UpdateImage(string? imageUrl, ImageType imageType)
        {
            var currentImages = Images ?? new UserImages(null, null);
            Images = imageType switch
            {
                ImageType.Profile => currentImages.UpdateProfileImage(imageUrl),
                ImageType.Background => currentImages.UpdateBackgroundImage(imageUrl),
                _ => throw new ArgumentOutOfRangeException(nameof(imageType), $"Nieobsługiwany typ zdjęcia: {imageType}")
            };
        }
    }
}



