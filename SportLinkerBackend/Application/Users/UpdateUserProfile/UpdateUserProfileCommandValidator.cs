using FluentValidation;

namespace Application.Users.UpdateUserData
{
    public sealed class UpdateUserProfileCommandValidator : AbstractValidator<UpdateUserProfileCommand>
    {
        public UpdateUserProfileCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Imię i nazwisko nie może być puste.")
                .MaximumLength(20).WithMessage("Imię i nazwisko nie może mieć więcej niż 20 znaków.");

            RuleFor(x => x.BirthDate)
                .Must(NotBeInTheFuture)
                .WithMessage("Data urodzenia nie może być z przyszłości.")
                .Must(BeAtLeastThirteenYearsOld)
                .WithMessage("Musisz mieć co najmniej 13 lat.")
                .Must(NotBeOlderThanEightyYears)
                .WithMessage("Wprowadzona data wskazuje na wiek powyżej 80 lat.")
                .When(x => x.BirthDate != null);
        }

        private static bool NotBeInTheFuture(DateOnly? birthDate)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            return birthDate <= today;
        }

        private static bool BeAtLeastThirteenYearsOld(DateOnly? birthDate)
        {
            var minBirthDate = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(-13));
            return birthDate <= minBirthDate;
        }

        private static bool NotBeOlderThanEightyYears(DateOnly? birthDate)
        {
            var maxBirthDate = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(-80));
            return birthDate >= maxBirthDate;
        }
    }
}
