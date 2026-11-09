using Application.Abstractions;
using Application.Messages.Dtos;
using Domain.Abstractions;

namespace Application.Messages.GetConversationMessages
{
    public sealed record GetConversationMessagesQuery(int ConversationId, DateTimeOffset? BeforeSendAt = null, int PageSize = 30, int? BeforeId = null) : IQuery<Result<MessagesPageDto>>
    {
    }
}
