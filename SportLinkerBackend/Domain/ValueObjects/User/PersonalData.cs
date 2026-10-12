using Domain.Enums;

namespace Domain.ValueObjects.User
{
    public record PersonalData
    {
        public string Name { get; } = default!;
        public DateOnly? BirthDate { get; }
        public Gender? Gender { get; }
        public string? AboutMe { get; }

        public PersonalData(string name, DateOnly? birthDate, Gender? gender, string? aboutMe)
        {
            Name = name;
            BirthDate = birthDate;
            Gender = gender;
            AboutMe = aboutMe;
        }

        public PersonalData UpdateBasicInfo(string name, DateOnly? birthDate, Gender? gender)
        {
            return new PersonalData(
                name,
                birthDate,
                gender,
                this.AboutMe
            );
        }

        public PersonalData UpdateAboutMe(string? aboutMe)
        {
            return new PersonalData(
                this.Name,
                this.BirthDate,
                this.Gender,
                aboutMe
            );
        }
    }
}
