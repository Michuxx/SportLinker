using Application.Abstractions;
using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Users.Dtos;
using Dapper;

namespace Application.Users.GetUserRequests
{
    public sealed class GetUserRequestsQueryHandler : IQueryHandler<GetUserRequestsQuery, List<UserRequestsDto>>
    {
        private readonly ICurrentUser _currentUser;
        private readonly ISqlConnectionFactory _sqlConnectionFactory;

        public GetUserRequestsQueryHandler(ICurrentUser currentUser, ISqlConnectionFactory sqlConnectionFactory)
        {
            _currentUser = currentUser;
            _sqlConnectionFactory = sqlConnectionFactory;
        }
        public async Task<List<UserRequestsDto>> Handle(GetUserRequestsQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            using var connection = _sqlConnectionFactory.CreateConnection();

            const string sql = """
            SELECT
                r.Id AS RequestId,
                r.OfferId,
                r.Status,
                o.Title AS OfferTitle,
                o.PlanningDate AS [Date],
                o.MaxPeople,
                s.Name AS Sport,
                l.City,
                l.Country,
                l.HouseNumber,
                l.Coordinates_Latitude AS Lat,
                l.Coordinates_Longitude AS [Long],
                l.Name,
                l.State,
                l.Street,
                l.Type,
                u.Id AS UserId,
                u.PersonalData_Name AS UserName,
                (
                    SELECT COUNT(*)
                    FROM OfferParticipants p
                    WHERE p.OfferId = o.Id
                ) AS CurrentPeople
            FROM OfferRequests r
            INNER JOIN Offers o ON o.Id = r.OfferId
            INNER JOIN Sports s ON s.Id = o.SportId
            INNER JOIN Locations l ON l.Id = o.LocationId
            INNER JOIN Users u ON u.Id = r.UserId
            WHERE o.AuthorId = @UserId
            AND r.Status = 'Pending';
            """;

            var command = new CommandDefinition(
           sql,
           new { UserId = userId },
           cancellationToken: cancellationToken);

            var requests = (
                await connection.QueryAsync<UserRequestsDto>(command)
            ).ToList();

            foreach (var item in requests)
            {
                item.Date = DateTime.SpecifyKind(
                    item.Date,
                    DateTimeKind.Utc);
            }

            return requests;
        }
    }
}
