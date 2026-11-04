using Application.Abstractions;
using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Users.Dtos;
using Dapper;
using MediatR;
using System.Data;

namespace Application.Users.GetJoinedOffers
{
    public sealed class GetJoinedOffersQueryHandler : IQueryHandler<GetJoinedOffersQuery, List<JoinedOffersDto>>
    {
        private readonly ICurrentUser _currentUser;
        private readonly ISqlConnectionFactory _sqlConnectionFactory;
        public GetJoinedOffersQueryHandler(ICurrentUser currentUser, ISqlConnectionFactory sqlConnectionFactory)
        {
            _currentUser = currentUser;
            _sqlConnectionFactory = sqlConnectionFactory;
        }

        public async Task<List<JoinedOffersDto>> Handle(GetJoinedOffersQuery query, CancellationToken cancellationToken)
        {
            using IDbConnection connection = _sqlConnectionFactory.CreateConnection();
            const string sql = """
                SELECT
                    o.Id AS OfferId,
                    o.Title AS OfferName,
                    o.Description AS OfferDescription,
                    o.PlanningDate AS OfferDate,
                    o.MaxPeople,
                    o.Level,
                    o.Availability,
                    l.City,
                    l.Country,
                    l.HouseNumber,
                    l.Coordinates_Latitude AS Lat,
                    l.Coordinates_Longitude AS [Long],
                    l.Name,
                    l.State,
                    l.Street,
                    l.Type,
                    s.Name AS Sport,
                    (
                        SELECT COUNT(*)
                        FROM OfferParticipants op
                        WHERE op.OfferId = o.Id
                    ) AS CurrentPeople
                FROM Offers o
                INNER JOIN Locations l ON l.Id = o.LocationId
                INNER JOIN OfferParticipants op ON op.OfferId = o.Id
                INNER JOIN Sports s ON s.Id = o.SportId
                WHERE op.UserId = @UserId;
                """;
            var command = new CommandDefinition(sql, new { _currentUser.UserId });
            var offers = await connection.QueryAsync<JoinedOffersDto>(command);

            foreach (var item in offers)
            {
                item.OfferDate = DateTime.SpecifyKind(
                    item.OfferDate,
                    DateTimeKind.Utc);
            }

            return offers.ToList();
        }
    }
}
