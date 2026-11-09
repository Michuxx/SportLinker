using Application.Abstractions;
using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Messages.Dtos;
using Dapper;
using Domain.Enums;

namespace Application.Messages.GetUserConversations
{
    public sealed class GetUserConvesationsQueryHandler : IQueryHandler<GetUserConversationsQuery, List<UserConversationDto>>
    {
        private readonly ICurrentUser _currentUser;
        private readonly ISqlConnectionFactory _sqlConnectionFactory;
        public GetUserConvesationsQueryHandler(ICurrentUser currentUser, ISqlConnectionFactory sqlConnectionFactory)
        {
            _currentUser = currentUser;
            _sqlConnectionFactory = sqlConnectionFactory;
        }

        public async Task<List<UserConversationDto>> Handle(GetUserConversationsQuery query, CancellationToken cancellationToken)
        {
            using var connection = _sqlConnectionFactory.CreateConnection();
            const string sql = """
            SELECT
                c.Id,
                c.Type,
                CASE
                    WHEN c.Type = @PrivateType
                        THEN COALESCE(recipient.PersonalData_Name, N'USUNIĘTY UŻYTKOWNIK')
                    ELSE COALESCE(o.Title, N'Rozmowa usuniętej oferty')
                END AS Name,

                recipient.Images_ProfileImage AS ImageUrl,
                recipient.Id AS RecipientUserId,

                CASE
                    WHEN c.Type = @PrivateType THEN CAST(0 AS bit)
                    ELSE NULL
                END AS IsOnline,

                recipient.LastSeenAt AS LastTimeOnline,

                CAST(
                    CASE
                        WHEN EXISTS (
                            SELECT 1
                            FROM ConversationParticipants activeParticipant
                            WHERE activeParticipant.ConversationId = c.Id
                              AND activeParticipant.UserId = @UserId
                              AND activeParticipant.LeftAt IS NULL
                        )
                        AND (
                            (
                                c.Type = @GroupType
                                AND c.RelatedOfferId IS NOT NULL
                            )
                            OR (
                                c.Type = @PrivateType
                                AND EXISTS (
                                    SELECT 1
                                    FROM Friendships f
                                    WHERE
                                        (f.FirstUserId = @UserId
                                         AND f.SecondUserId = recipient.Id)
                                        OR
                                        (f.FirstUserId = recipient.Id
                                         AND f.SecondUserId = @UserId)
                                )
                            )
                        )
                        THEN 1
                        ELSE 0
                    END
                    AS bit
                ) AS CanSendMessages,

                lastMessage.Id AS LastMessageId,
                CASE
                    WHEN lastMessage.Id IS NULL THEN NULL
                    ELSE COALESCE(sender.PersonalData_Name, N'USUNIĘTY UŻYTKOWNIK')
                END AS LastMessageSenderName,
                lastMessage.Content AS LastMessageText,
                lastMessage.SendAt AS LastMessageTime

            FROM Conversations c

            OUTER APPLY (
                SELECT
                    TRY_CONVERT(int, LEFT(
                        c.PrivateConversationPairKey,
                        NULLIF(CHARINDEX(':', c.PrivateConversationPairKey), 0) - 1
                    )) AS FirstUserId,

                    TRY_CONVERT(int, SUBSTRING(
                        c.PrivateConversationPairKey,
                        CHARINDEX(':', c.PrivateConversationPairKey) + 1,
                        21
                    )) AS SecondUserId
            ) privatePair

            LEFT JOIN Users recipient
                ON c.Type = @PrivateType
                AND recipient.Id = CASE
                    WHEN privatePair.FirstUserId = @UserId
                        THEN privatePair.SecondUserId
                    ELSE privatePair.FirstUserId
                END

            LEFT JOIN Offers o
                ON o.Id = c.RelatedOfferId

            OUTER APPLY (
                SELECT TOP (1)
                    m.Id,
                    m.SenderId,
                    m.Content,
                    m.SendAt
                FROM Messages m
                WHERE m.ConversationId = c.Id
                  AND EXISTS (
                      SELECT 1
                      FROM ConversationParticipants period
                      WHERE period.ConversationId = c.Id
                        AND period.UserId = @UserId
                        AND m.SendAt >= period.JoinedAt
                        AND (
                            period.LeftAt IS NULL
                            OR m.SendAt < period.LeftAt
                        )
                  )
                ORDER BY m.SendAt DESC, m.Id DESC
            ) lastMessage

            LEFT JOIN Users sender
                ON sender.Id = lastMessage.SenderId

            WHERE EXISTS (
                SELECT 1
                FROM ConversationParticipants participant
                WHERE participant.ConversationId = c.Id
                  AND participant.UserId = @UserId
            )

            ORDER BY
                COALESCE(lastMessage.SendAt, c.CreatedAt) DESC,
                c.Id DESC;
            """;

            var command = new CommandDefinition(
            sql,
            new
            {
                _currentUser.UserId,
                PrivateType = ConversationType.Private.ToString(),
                GroupType = ConversationType.Group.ToString()
            },
            cancellationToken: cancellationToken);

            var conversations = (await connection
                .QueryAsync<UserConversationDto>(command))
                .ToList();

            foreach (var conversation in conversations)
            {
                if (conversation.LastMessageTime is DateTime messageTime)
                {
                    conversation.LastMessageTime =
                        DateTime.SpecifyKind(messageTime, DateTimeKind.Utc);
                }

                if (conversation.LastTimeOnline is DateTime lastOnline)
                {
                    conversation.LastTimeOnline =
                        DateTime.SpecifyKind(lastOnline, DateTimeKind.Utc);
                }
            }

            return conversations;
        }
    }
}
