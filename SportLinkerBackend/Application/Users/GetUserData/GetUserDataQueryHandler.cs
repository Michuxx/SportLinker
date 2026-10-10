using Application.Abstractions;
using Application.Abstractions.Data;
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
                l.Coordinates_Longitude AS Longitude,
                l.Coordinates_Latitude AS Latitude,
                l.City,
                l.Country,
                l.State,
                l.Name
            FROM Users u
            LEFT JOIN Locations l ON u.LocationId = l.Id
            WHERE u.Id = @UserId;

            SELECT s.Id, s.Name
            FROM FavouriteUserSports fus
            INNER JOIN Sports s ON fus.SportId = s.Id
            WHERE fus.UserId = @UserId;
            """;

            using var multi = await connection.QueryMultipleAsync(sql, new { query.userId });

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
