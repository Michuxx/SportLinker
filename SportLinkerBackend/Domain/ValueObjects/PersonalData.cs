using Domain.Enums;

namespace Domain.ValueObjects
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
    }
}
