using Application.Abstractions;
using Application.Abstractions.Data;
using Application.Users.Dtos;
using Dapper;
using System.Data;

namespace Application.Users.GetUserOffers
{
    public class GetUserOffersQueryHandler : IQueryHandler<GetUserOffersQuery, List<OfferUser>>
    {
        private readonly ISqlConnectionFactory _sqlConnectionFactory;
        public GetUserOffersQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
        {
            _sqlConnectionFactory = sqlConnectionFactory;
        }
        public async Task<List<OfferUser>> Handle(GetUserOffersQuery query, CancellationToken cancellationToken)
        {
            using IDbConnection connection = _sqlConnectionFactory.CreateConnection();
            const string sql = """
                SELECT
                    o.Id AS OfferId,
                    o.Title,
                    o.Level,
                    o.Description,
                    o.PlanningDate AS [Date],
                    o.Availability,
                    o.Mode,
                    o.MaxPeople,
                    l.City,
                    l.Country,
                    l.HouseNumber,
                    l.Coordinates_Latitude AS Lat,
                    l.Coordinates_Longitude AS [Long],
                    l.Name,
                    l.State,
                    l.Street,
                    l.Type,
                    s.Name AS SportName,
                    (
                        SELECT COUNT(*)
                        FROM OfferParticipants op
                        WHERE op.OfferId = o.Id
                    ) AS CurrentPeople
                FROM Offers o
                INNER JOIN Locations l ON l.Id = o.LocationId
                INNER JOIN Sports s ON s.Id = o.SportId
                WHERE o.AuthorId = @UserId
                ORDER BY o.PlanningDate, o.Id;
                """;

            var command = new CommandDefinition(sql, new { query.UserId });
            var offers = await connection.QueryAsync<OfferUser>(command);
            return offers.ToList();
        }
    }
}
