using Application.Abstractions;
using Domain.Abstractions;

namespace Application.Messages.DeleteConversationFromHistory
{
    public sealed record DeleteConversationFromHistoryCommand(int ConversationId) : ICommand<Result<bool>>
    {
    }
}
