using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.ValueObjects
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
    }

   
}
