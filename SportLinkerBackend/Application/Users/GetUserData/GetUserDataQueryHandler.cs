using Application.Abstractions;
using Application.Abstractions.Data;
using Application.Sports.Dtos;
using Application.Users.Dtos;
using Dapper;
using Domain.Abstractions;
using Domain.Errors;
using System.Data;

namespace Application.Users.GetUserData
{
    public class GetUserDataQueryHandler : IQueryHandler<GetUserDataQuery, Result<UserDataDto>>
    {
        private readonly ISqlConnectionFactory _sqlConnectionFactory;
        public GetUserDataQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
        {
            _sqlConnectionFactory = sqlConnectionFactory;
        }
        public async Task<Result<UserDataDto>> Handle(GetUserDataQuery query, CancellationToken cancellationToken)
        {
            using IDbConnection connection = _sqlConnectionFactory.CreateConnection();

            const string sql = """
            SELECT 
                u.Email,
                u.PersonalData_Name AS UserName,
                CONVERT(varchar, u.PersonalData_BirthDate, 23) AS BirthDate,
                u.PersonalData_Gender AS Gender,
                u.PersonalData_AboutMe AS AboutMe,
                u.Images_ProfileImage AS ProfileImage,
                u.Images_BackgroundImage AS BackgroundImage,
                u.Statistics_CreatedOffers AS CreatedOffers,
                u.Statistics_JoinedOffers AS JoinedOffers,
                u.Statistics_Invitations AS Invitations,
                l.Coordinates_Longitude AS [Long],
                l.Coordinates_Latitude AS Lat,
                l.City,
                l.Country,
                l.State,
                l.Name,
                CASE
                WHEN @ViewerId IS NULL
                    THEN 'Anonymous'

                WHEN u.Id = @ViewerId
                    THEN 'Self'

                WHEN EXISTS (
                    SELECT 1
                    FROM Friendships f
                    WHERE
                        (f.FirstUserId = @ViewerId AND f.SecondUserId = u.Id)
                        OR
                        (f.FirstUserId = u.Id AND f.SecondUserId = @ViewerId)
                    )
                    THEN 'Friends'

                WHEN EXISTS (
                    SELECT 1
                    FROM FriendRequests r
                    WHERE r.SenderId = @ViewerId
                      AND r.ReceiverId = u.Id
                    )
                    THEN 'RequestSent'

                WHEN EXISTS (
                    SELECT 1
                    FROM FriendRequests r
                    WHERE r.SenderId = u.Id
                      AND r.ReceiverId = @ViewerId
                    )
                    THEN 'RequestReceived'

                ELSE 'None'
            END AS Relationship,

            CASE
                WHEN @ViewerId IS NULL OR u.Id = @ViewerId
                    THEN NULL

                WHEN EXISTS (
                    SELECT 1
                    FROM Friendships f
                    WHERE
                        (f.FirstUserId = @ViewerId AND f.SecondUserId = u.Id)
                        OR
                        (f.FirstUserId = u.Id AND f.SecondUserId = @ViewerId)
                )
                    THEN NULL

                ELSE (
                    SELECT TOP (1) r.Id
                    FROM FriendRequests r
                    WHERE
                        (r.SenderId = @ViewerId AND r.ReceiverId = u.Id)
                        OR
                        (r.SenderId = u.Id AND r.ReceiverId = @ViewerId)
                    ORDER BY
                        CASE WHEN r.SenderId = @ViewerId THEN 0 ELSE 1 END,
                        r.Id DESC
                )
            END AS FriendRequestId

            FROM Users u
            LEFT JOIN Locations l ON u.LocationId = l.Id
            WHERE u.Id = @UserId;

            SELECT s.Id, s.Name
            FROM FavouriteUserSports fus
            INNER JOIN Sports s ON fus.SportId = s.Id
            WHERE fus.UserId = @UserId;
            """;

            using var multi = await connection.QueryMultipleAsync(sql, new { query.UserId, query.ViewerId });

            var userDto = await multi.ReadSingleOrDefaultAsync<UserDataDto>();
            if (userDto is null)
            {
                return Result<UserDataDto>.Failure(UserErrors.UserNotFound);
            }
           
            userDto.FavouriteSports = (await multi.ReadAsync<SportDto>()).ToList();
            return Result<UserDataDto>.Success(userDto);
        }
    }
}
