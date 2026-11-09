using Application.Abstractions;
using Domain.Abstractions;

namespace Application.Messages.CreatePrivateConversation
{
    public sealed record CreatePrivateConversationCommand(int ReceiverId, string Content, Guid ClientMessageId) : ICommand<Result<int>>
    {
    }
}
