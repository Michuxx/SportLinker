using Application.Abstractions;
using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Friends.Dtos;
using Dapper;
using Domain.Enums;

namespace Application.Friends.GetUserFriends
{
    public sealed class GetUserFriendsQueryHandler : IQueryHandler<GetUserFriendsQuery, List<UserFriendDto>>
    {
        private readonly ICurrentUser _currentUser;
        private readonly ISqlConnectionFactory _sqlConnectionFactory;

        public GetUserFriendsQueryHandler(ICurrentUser currentUser, ISqlConnectionFactory sqlConnectionFactory)
        {
            _currentUser = currentUser;
            _sqlConnectionFactory = sqlConnectionFactory;
        }

        public async Task<List<UserFriendDto>> Handle(GetUserFriendsQuery query, CancellationToken cancellationToken)
        {
            using var connection = _sqlConnectionFactory.CreateConnection();
            const string sql = """
            SELECT
                f.Id AS FriendshipId,
                u.Id AS UserId,
                u.PersonalData_Name AS Name,
                u.Images_ProfileImage AS ImageUrl,
                c.Id AS ConversationId,
                CAST(0 AS bit) AS IsOnline,
                u.LastSeenAt AS LastTimeOnline
            FROM Friendships f
            INNER JOIN Users u
                ON u.Id = CASE
                    WHEN f.FirstUserId = @CurrentUserId
                        THEN f.SecondUserId
                    ELSE f.FirstUserId
                END
            LEFT JOIN Conversations c
                ON c.PrivateConversationPairKey =
                    CONCAT(f.FirstUserId, ':', f.SecondUserId)
                AND c.Type = @PrivateType
                AND EXISTS (
                    SELECT 1
                    FROM ConversationParticipants cp
                    WHERE cp.ConversationId = c.Id
                      AND cp.UserId = @CurrentUserId
                )
            WHERE f.FirstUserId = @CurrentUserId
               OR f.SecondUserId = @CurrentUserId;
            """;
            var command = new CommandDefinition(
              sql,
              new
              {
                  CurrentUserId = _currentUser.UserId,
                  PrivateType = ConversationType.Private.ToString()
              },
              cancellationToken: cancellationToken);

            var friends = (await connection
                .QueryAsync<UserFriendDto>(command))
                .ToList();

            foreach (var friend in friends)
            {
                if (friend.LastTimeOnline is DateTime lastTimeOnline)
                {
                    friend.LastTimeOnline = DateTime.SpecifyKind(
                        lastTimeOnline,
                        DateTimeKind.Utc);
                }
            }

            return friends;
        }
    }
}
