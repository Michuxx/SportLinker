namespace Application.Messages.Dtos
{
    public sealed record MessageReceivedDto(
    int ConversationId,
    ConversationMessageDto Message);
}
