using Application.Abstractions;
using Application.Abstractions.Data;
using Application.Offers.Dtos;
using Dapper;
using System.Data;

namespace Application.Offers.GetOfferDetails
{
    public class GetOfferDetailsQueryHandler : IQueryHandler<GetOfferDetailsQuery, Result<OfferDetailsDto>>
    {
        private readonly ISqlConnectionFactory _sqlConnectionFactory;

        public GetOfferDetailsQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
        {
            _sqlConnectionFactory = sqlConnectionFactory;
        }

        public async Task<Result<OfferDetailsDto>> Handle(GetOfferDetailsQuery query, CancellationToken cancellationToken)
        {
            using IDbConnection connection = _sqlConnectionFactory.CreateConnection();

            const string sql = """
                SELECT
                    o.Id AS OfferId,
                    o.Title,
                    o.Level,
                    o.Description,
                    o.PlanningDate AS [Date],
                    o.CreatedAt AS CreationDate,
                    o.MaxPeople,
                    o.AvailabilityEnum AS Availability,
                    o.ModeEnum AS Mode,
                    o.AuthorId,
                    request.Status AS Status,
                    l.City,
                    l.Country,
                    l.HouseNumber,
                    l.Coordinates_Latitude AS Lat,
                    l.Coordinates_Longitude AS [Long],
                    l.Name,
                    l.State,
                    l.Street,
                    l.Type,
                    s.Name as SportName,
                    s.Id as SportId
                FROM Offers o
                INNER JOIN Sports s
                ON o.SportId = s.Id
                INNER JOIN Locations l ON l.Id = o.LocationId
                OUTER APPLY (
                    SELECT TOP (1)
                        r.Status
                    FROM OfferRequests r
                    WHERE r.OfferId = o.Id
                      AND r.UserId = @UserId
                ) request
                WHERE o.Id = @OfferId;

                SELECT
                    u.Id AS UserId,
                    u.PersonalData_Name AS Name,
                    p.JoinDate,
                    u.Images_ProfileImage AS Image
                FROM Offers o
                INNER JOIN Users u ON u.Id = o.AuthorId
                INNER JOIN OfferParticipants p
                    ON p.OfferId = o.Id
                    AND p.UserId = o.AuthorId
                WHERE o.Id = @OfferId;

                SELECT
                    u.Id AS UserId,
                    u.PersonalData_Name AS Name,
                    p.JoinDate,
                    u.Images_ProfileImage AS Image
                FROM OfferParticipants p
                INNER JOIN Users u ON u.Id = p.UserId
                WHERE p.OfferId = @OfferId;
        """;

            var command = new CommandDefinition(
                sql,
                new
                {
                    query.OfferId,
                    query.UserId
                },
                cancellationToken: cancellationToken);

            using var results = await connection.QueryMultipleAsync(command);

            var offer = await results.ReadSingleOrDefaultAsync<OfferDetailsDto>();

            if (offer is null)
            {
                throw new KeyNotFoundException("Oferta nie istnieje.");
            }

            offer.Author = await results.ReadSingleAsync<OfferMemberDto>();
            offer.Members = (await results.ReadAsync<OfferMemberDto>()).ToList();

            offer.Date = DateTime.SpecifyKind(
                offer.Date, DateTimeKind.Utc);

            offer.CreationDate = DateTime.SpecifyKind(
                offer.CreationDate, DateTimeKind.Utc);

            offer.Author.JoinDate = DateTime.SpecifyKind(
                offer.Author.JoinDate, DateTimeKind.Utc);

            foreach (var member in offer.Members)
            {
                member.JoinDate = DateTime.SpecifyKind(
                  member.JoinDate, DateTimeKind.Utc);
            }

            return Result<OfferDetailsDto>.Success(offer);
        }
    }
}
