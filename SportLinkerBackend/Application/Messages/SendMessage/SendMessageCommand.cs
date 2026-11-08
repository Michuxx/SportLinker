using Application.Abstractions;
using Domain.Abstractions;

namespace Application.Messages.SendMessage
{
    public sealed record SendMessageCommand(int ConversationId, string Content, Guid ClientMessageId) : ICommand<Result<bool>>
    {
    }
}
