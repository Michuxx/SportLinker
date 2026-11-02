using Application.Abstractions;
using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Users.Dtos;
using Dapper;

namespace Application.Users.SentOfferRequests
{
    public sealed class SentOfferRequestsQueryHandler : IQueryHandler<SentOfferRequestsQuery, List<SentOfferRequestDto>>
    {
        private readonly ICurrentUser _currentUser;
        private readonly ISqlConnectionFactory _sqlConnectionFactory;
        public SentOfferRequestsQueryHandler(ICurrentUser currentUser, ISqlConnectionFactory sqlConnectionFactory)
        {
            _currentUser = currentUser;
            _sqlConnectionFactory = sqlConnectionFactory;
        }
        public async Task<List<SentOfferRequestDto>> Handle(SentOfferRequestsQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;

            using var connection = _sqlConnectionFactory.CreateConnection();

            const string sql = """
            WITH UserRequests AS (
                SELECT
                    Id,
                    OfferId,
                    Status,
                    RequestDate
                FROM OfferRequests
                WHERE UserId = @UserId
            )
            SELECT
                r.Id AS RequestId,
                r.OfferId,
                r.Status,
                o.Title,
                o.PlanningDate AS [Date],
                o.MaxPeople,
                o.Availability,
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
                (
                    SELECT COUNT(*)
                    FROM OfferParticipants p
                    WHERE p.OfferId = o.Id
                ) AS CurrentPeople
            FROM UserRequests r
            INNER JOIN Offers o ON o.Id = r.OfferId
            INNER JOIN Sports s ON s.Id = o.SportId
            INNER JOIN Locations l ON l.Id = o.LocationId;
            """;

            var command = new CommandDefinition(
                sql,
                new { UserId = userId },
                cancellationToken: cancellationToken);

            var requests = (
                await connection.QueryAsync<SentOfferRequestDto>(command)
            ).ToList();

            foreach (var item in requests)
            {
                item.Date = DateTime.SpecifyKind(item.Date, DateTimeKind.Utc);
            }

            return requests;
        }
    }
}
