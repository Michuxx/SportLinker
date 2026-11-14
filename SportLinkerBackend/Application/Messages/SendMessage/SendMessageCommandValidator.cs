using FluentValidation;

namespace Application.Messages.SendMessage
{
    public class SendMessageCommandValidator : AbstractValidator<SendMessageCommand>
    {
        public SendMessageCommandValidator()
        {
            RuleFor(x => x.ConversationId)
                .GreaterThan(0)
                .WithMessage("Identyfikator konwersacji musi być dodatni.");

            RuleFor(x => x.Content)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("Treść wiadomości nie może być pusta.")
                .MaximumLength(4000)
                .WithMessage("Wiadomość może mieć maksymalnie 4000 znaków.");

            RuleFor(x => x.ClientMessageId)
                .NotEmpty()
                .WithMessage("ClientMessageId nie może być pusty.");

        }
    }
}
