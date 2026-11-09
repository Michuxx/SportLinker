using Application.Abstractions;
using Application.Messages.Dtos;

namespace Application.Messages.GetUserConversations
{
    public sealed class GetUserConversationsQuery : IQuery<List<UserConversationDto>>
    {
    }
}
