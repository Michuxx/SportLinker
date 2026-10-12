using FluentValidation;

namespace Application.Users.UpdateAboutMe
{
    public sealed class UpdateAboutMeCommandValidator : AbstractValidator<UpdateAboutMeCommand>
    {
        public UpdateAboutMeCommandValidator()
        {
            RuleFor(x => x.AboutMe)
                .MaximumLength(180)
                .WithMessage("Opis nie może przekraczać 180 znaków.");
        }
    }
}
