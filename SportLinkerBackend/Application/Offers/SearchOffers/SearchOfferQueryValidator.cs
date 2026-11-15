using FluentValidation;

namespace Application.Offers.SearchOffers
{
    public sealed class SearchOfferQueryValidator : AbstractValidator<SearchOffersQuery>
    {
        public SearchOfferQueryValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0)
                .WithMessage("Identyfikator użytkownika musi być dodatni.");

            RuleFor(x => x.Page)
                .GreaterThan(0)
                .WithMessage("Numer strony musi być większy od 0.");

            RuleFor(x => x.PageSize)
                .InclusiveBetween(1, 50)
                .WithMessage("Liczba ofert na stronie musi wynosić od 1 do 50.");

            RuleFor(x => x.Search)
                .MaximumLength(200)
                .WithMessage("Wyszukiwana fraza może mieć maksymalnie 200 znaków.");

            RuleFor(x => x.SportId)
                .GreaterThan(0)
                .WithMessage("Identyfikator sportu musi być dodatni.");

            RuleFor(x => x.Location!)
                .ChildRules(location =>
                {
                    location.RuleFor(x => x.Country)
                        .NotEmpty()
                        .WithMessage("Kraj wybranej lokalizacji jest wymagany.")
                        .MaximumLength(100)
                        .WithMessage("Nazwa kraju może mieć maksymalnie 100 znaków.");

                    location.RuleFor(x => x.State)
                        .MaximumLength(150)
                        .WithMessage("Nazwa województwa może mieć maksymalnie 150 znaków.");

                    location.RuleFor(x => x.City)
                        .MaximumLength(150)
                        .WithMessage("Nazwa miasta może mieć maksymalnie 150 znaków.");

                    location.RuleFor(x => x)
                        .Must(value =>
                            !string.IsNullOrWhiteSpace(value.City)
                            || !string.IsNullOrWhiteSpace(value.State))
                        .WithMessage("Wybierz miasto lub województwo.");
                })
                .When(x => x.Location is not null);

            RuleFor(x => x.Level)
                .IsInEnum()
                .WithMessage("Nieprawidłowy poziom zaawansowania.");

            RuleFor(x => x.SortOrder)
                .IsInEnum()
                .WithMessage("Nieprawidłowa kolejność sortowania.");

            RuleFor(x => x.SortOption)
                .IsInEnum()
                .WithMessage("Nieprawidłowy sposób sortowania.");

            RuleFor(x => x.MinParticipants)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Minimalna liczba uczestników nie może być ujemna.");

            RuleFor(x => x.MaxParticipants)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Maksymalna liczba uczestników nie może być ujemna.");

            RuleFor(x => x.MaxParticipants)
                .Must((query, max) =>
                    !query.MinParticipants.HasValue
                    || !max.HasValue
                    || max.Value >= query.MinParticipants.Value)
                .WithMessage(
                    "Maksymalna liczba uczestników nie może być mniejsza od minimalnej.");

            RuleFor(x => x.DateToExclusive)
                .Must((query, dateTo) =>
                    !query.DateFrom.HasValue
                    || !dateTo.HasValue
                    || dateTo.Value > query.DateFrom.Value)
                .WithMessage(
                    "Koniec zakresu dat musi być późniejszy niż jego początek.");
        }
    }
}
