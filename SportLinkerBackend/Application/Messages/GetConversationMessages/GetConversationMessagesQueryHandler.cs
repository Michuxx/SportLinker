using Application.Abstractions;
using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Messages.Dtos;
using Dapper;
using Domain.Abstractions;
using Domain.Errors;

namespace Application.Messages.GetConversationMessages
{
    public sealed class GetConversationMessagesQueryHandler : IQueryHandler<GetConversationMessagesQuery, Result<MessagesPageDto>>
    {
        private readonly ICurrentUser _currentUser;
        private readonly ISqlConnectionFactory _sqlConnectionFactory;
        public GetConversationMessagesQueryHandler(ICurrentUser currentUser, ISqlConnectionFactory sqlConnectionFactory)
        {
            _currentUser = currentUser;
            _sqlConnectionFactory = sqlConnectionFactory;
        }
        public async Task<Result<MessagesPageDto>> Handle(GetConversationMessagesQuery query, CancellationToken cancellationToken)
        {
            if (query.PageSize is < 1 or > 100
                || query.BeforeSendAt.HasValue != query.BeforeId.HasValue
                || query.BeforeId is <= 0)
            {
                return Result<MessagesPageDto>.Failure(
                    new Error(
                        "INVALID_MESSAGE_PAGINATION",
                        "Nieprawidłowe parametry pobierania wiadomości."));
            }

            using var connection = _sqlConnectionFactory.CreateConnection();

            var userId = _currentUser.UserId;

            const string accessSql = """
            SELECT CAST(
                CASE WHEN EXISTS (
                    SELECT 1
                    FROM ConversationParticipants cp
                    WHERE cp.ConversationId = @ConversationId
                      AND cp.UserId = @UserId
                )
                THEN 1 ELSE 0 END
                AS bit
            );
            """;

            var accessCommand = new CommandDefinition(
                accessSql,
                new { query.ConversationId, UserId = userId },
                cancellationToken: cancellationToken);

            var hasAccess = await connection.ExecuteScalarAsync<bool>(
                accessCommand);

            if (!hasAccess)
            {
                return Result<MessagesPageDto>.Failure(
                    MessageErrors.ConversationNotFound);
            }

            const string sql = """
            SELECT TOP (@Take)
                m.Id,
                m.SenderId,
                COALESCE(
                    sender.PersonalData_Name,
                    N'USUNIĘTY UŻYTKOWNIK'
                ) AS SenderName,
                m.Content,
                m.SendAt,
                m.ClientMessageId,
                CAST(
                    CASE WHEN m.SenderId = @UserId
                        THEN 1 ELSE 0
                    END AS bit
                ) AS IsOwnMessage
            FROM Messages m
            LEFT JOIN Users sender
                ON sender.Id = m.SenderId
            WHERE m.ConversationId = @ConversationId
              AND EXISTS (
                  SELECT 1
                  FROM ConversationParticipants period
                  WHERE period.ConversationId = m.ConversationId
                    AND period.UserId = @UserId
                    AND m.SendAt >= period.JoinedAt
                    AND (
                        period.LeftAt IS NULL
                        OR m.SendAt < period.LeftAt
                    )
              )
              AND (
                  @BeforeSendAt IS NULL
                  OR m.SendAt < @BeforeSendAt
                  OR (
                      m.SendAt = @BeforeSendAt
                      AND m.Id < @BeforeId
                  )
              )
            ORDER BY m.SendAt DESC, m.Id DESC;

            SELECT
                participant.ConversationId,
                participant.Id AS ParticipantId,
                participant.UserId,
                participant.JoinedAt,
                participant.LeftAt,
                readMessage.Id AS LastReadMessageId,
                readMessage.SendAt AS LastReadMessageSendAt,
                participant.LastReadAt
            FROM ConversationParticipants participant
            LEFT JOIN Messages readMessage
                ON readMessage.Id = participant.LastReadMessageId
                AND readMessage.ConversationId = participant.ConversationId
            WHERE participant.ConversationId = @ConversationId
              AND EXISTS (
                  SELECT 1
                  FROM Messages sharedMessage
                  WHERE sharedMessage.ConversationId = participant.ConversationId
                    AND sharedMessage.SendAt >= participant.JoinedAt
                    AND (
                        participant.LeftAt IS NULL
                        OR sharedMessage.SendAt < participant.LeftAt
                    )
                    AND EXISTS (
                        SELECT 1
                        FROM ConversationParticipants viewerPeriod
                        WHERE viewerPeriod.ConversationId = sharedMessage.ConversationId
                          AND viewerPeriod.UserId = @UserId
                          AND sharedMessage.SendAt >= viewerPeriod.JoinedAt
                          AND (
                              viewerPeriod.LeftAt IS NULL
                              OR sharedMessage.SendAt < viewerPeriod.LeftAt
                          )
                    )
              )
            ORDER BY participant.UserId, participant.JoinedAt, participant.Id;
            """;

            var command = new CommandDefinition(
                sql,
                new
                {
                    query.ConversationId,
                    UserId = userId,
                    Take = query.PageSize + 1,
                    BeforeSendAt = query.BeforeSendAt?.UtcDateTime,
                    query.BeforeId
                },
                cancellationToken: cancellationToken);

            using var results = await connection.QueryMultipleAsync(command);

            var rows = (await results
                .ReadAsync<ConversationMessageDto>())
                .ToList();

            var readStates = (await results
                .ReadAsync<ConversationReadDto>())
                .ToList();

            foreach (var state in readStates)
            {
                state.JoinedAt = DateTime.SpecifyKind(
                    state.JoinedAt,
                    DateTimeKind.Utc);

                state.LeftAt = AsUtc(state.LeftAt);
                state.LastReadMessageSendAt = AsUtc(state.LastReadMessageSendAt);
                state.LastReadAt = AsUtc(state.LastReadAt);
            }

            var hasMore = rows.Count > query.PageSize;

            var messages = rows
                .Take(query.PageSize)
                .ToList();

            foreach (var message in messages)
            {
                message.SendAt = DateTime.SpecifyKind(
                    message.SendAt,
                    DateTimeKind.Utc);
            }

            MessageCursorDto? nextCursor = null;

            if (hasMore)
            {
                var oldestMessage = messages[^1];

                nextCursor = new MessageCursorDto(
                    new DateTimeOffset(oldestMessage.SendAt),
                    oldestMessage.Id);
            }

            messages.Reverse();

            return Result<MessagesPageDto>.Success(
                new MessagesPageDto(messages, hasMore, nextCursor));
        }

        private static DateTime? AsUtc(DateTime? value)
        {
            return value.HasValue
                ? DateTime.SpecifyKind(value.Value, DateTimeKind.Utc)
                : null;
        }
    }
}
