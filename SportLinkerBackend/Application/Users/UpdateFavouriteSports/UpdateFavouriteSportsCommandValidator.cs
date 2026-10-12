using FluentValidation;

namespace Application.Users.UpdateFavouriteSports
{
    public sealed class UpdateFavouriteSportsCommandValidator : AbstractValidator<UpdateFavouriteSportsCommand>
    {
        public UpdateFavouriteSportsCommandValidator()
        {
            RuleFor(x => x.SportIds)
                .NotNull()
                .WithMessage("Lista ulubionych sportów nie może być nullem.");
        }
    }
}
