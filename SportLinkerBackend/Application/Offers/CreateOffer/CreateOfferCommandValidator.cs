using FluentValidation;

namespace Application.Offers.CreateOffer
{
    public sealed class CreateOfferCommandValidator : AbstractValidator<CreateOfferCommand>
    {
        public CreateOfferCommandValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty()
                .WithMessage("Tytuł jest wymagany.")
                .MaximumLength(50)
                .WithMessage("Tytuł nie może przekraczać 50 znaków.");

            RuleFor(x => x.Description)
                .NotEmpty()
                .WithMessage("Opis jest wymagany.")
                .MaximumLength(180)
                .WithMessage("Opis nie może przekraczać 180 znaków.");

            RuleFor(x => x.Date)
                .NotEmpty()
                .WithMessage("Data jest wymagana.")
                .Must(date => date > DateTimeOffset.UtcNow)
                .WithMessage("Date cannot be earlier date");

            RuleFor(x => x.MaxParticipants)
                .NotEmpty()
                .WithMessage("Maksymalna liczba osób jest wymagana.")
                .InclusiveBetween(2, 100)
                .WithMessage("Maksymalna liczba osób musi być między 2 i 100.");

            RuleFor(x => x.SportId)
                .NotEmpty()
                .WithMessage("Identyfikator sportu jest wymagany.");

            RuleFor(x => x.Mode)
                .NotEmpty()
                .WithMessage("Tryb jest wymagany.");

            RuleFor(x => x.Level)
                .NotEmpty()
                .WithMessage("Poziom jest wymagany.");

            RuleFor(x => x.Location)
                 .NotNull().WithMessage("Lokalizacja jest wymagana.")
                 .ChildRules(location =>
                 {
                     location.RuleFor(l => l.Lat)
                         .NotEmpty()
                         .WithMessage("Latidute cannot be empty");

                     location.RuleFor(l => l.Long)
                         .NotEmpty()
                         .WithMessage("Longitude cannot be empty");

                     location.RuleFor(l => l.City)
                         .NotEmpty()
                         .WithMessage("Miasto jest wymagane.");
                 });
        }
    }
}
