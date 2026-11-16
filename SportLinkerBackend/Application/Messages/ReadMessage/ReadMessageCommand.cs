using Application.Abstractions;
using Application.Messages.Dtos;
using Domain.Abstractions;

namespace Application.Messages.ReadMessage
{
    public sealed record ReadMessageCommand(int MessageId, int ConversationId) : ICommand<Result<ConversationReadDto>>
    {
    }
}
