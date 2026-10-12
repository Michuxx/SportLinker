using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.ValueObjects.User
{
    public record UserImages
    {
        public string? ProfileImage { get; }
        public string? BackgroundImage { get; }

        public UserImages(string? profileImage, string? backgroundImage)
        {
            ProfileImage = profileImage;
            BackgroundImage = backgroundImage;
        }

        public UserImages UpdateProfileImage(string? profileImage) =>
            new UserImages(profileImage, this.BackgroundImage);

        public UserImages UpdateBackgroundImage(string? backgroundImage) =>
            new UserImages(this.ProfileImage, backgroundImage);
    }
}
