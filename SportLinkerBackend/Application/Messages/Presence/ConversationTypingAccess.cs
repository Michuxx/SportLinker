using Application.Abstractions.Data;
using Dapper;
using Domain.Enums;

namespace Application.Messages.Presence;

// Odczyt uprawnień do krótkotrwałych powiadomień, bez ładowania historii rozmowy.
public sealed class ConversationTypingAccess(ISqlConnectionFactory connectionFactory)
{
    public async Task<IReadOnlyList<int>> GetRecipientsAsync(
        int conversationId,
        int senderId,
        CancellationToken cancellationToken)
    {
        using var connection = connectionFactory.CreateConnection();

        const string sql = """
            SELECT DISTINCT recipient.UserId
            FROM Conversations c
            INNER JOIN ConversationParticipants recipient
                ON recipient.ConversationId = c.Id
            WHERE c.Id = @ConversationId
              AND recipient.LeftAt IS NULL
              AND recipient.UserId <> @SenderId
              AND EXISTS (
                  SELECT 1 FROM ConversationParticipants sender
                  WHERE sender.ConversationId = c.Id
                    AND sender.UserId = @SenderId
                    AND sender.LeftAt IS NULL
              )
              AND (
                  c.Type = @GroupType
                  OR (c.Type = @PrivateType AND EXISTS (
                      SELECT 1 FROM Friendships f
                      WHERE (f.FirstUserId = @SenderId AND f.SecondUserId = recipient.UserId)
                         OR (f.SecondUserId = @SenderId AND f.FirstUserId = recipient.UserId)
                  ))
              );
            """;

        var command = new CommandDefinition(sql, new
        {
            ConversationId = conversationId,
            SenderId = senderId,
            GroupType = ConversationType.Group.ToString(),
            PrivateType = ConversationType.Private.ToString()
        }, cancellationToken: cancellationToken);

        return (await connection.QueryAsync<int>(command)).ToList();
    }
}
