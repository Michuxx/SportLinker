using Application.Abstractions;
using Application.Abstractions.Data;
using Application.Offers.Dtos;
using Application.Offers.Enums;
using Dapper;
using Domain.Enums;
using System.Data;

namespace Application.Offers.SearchOffers
{
    public sealed class SearchOfferQueryHandler : IQueryHandler<SearchOfferQuery, OffersPageDto>
    {
        private readonly ISqlConnectionFactory _sqlConnectionFactory;
        public SearchOfferQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
        {
            _sqlConnectionFactory = sqlConnectionFactory;
        }
        public async Task<OffersPageDto> Handle(SearchOfferQuery query, CancellationToken cancellationToken)
        {
            var connection = _sqlConnectionFactory.CreateConnection();
            OfferSearchLocationDto? userLocation = null;
            if (query.UserId is int userId && query.Location is null)
            {
                userLocation = await GetUserLocation(
                    userId,
                    connection,
                    cancellationToken);
            }

            var parameters = new DynamicParameters();

            parameters.Add("UserCountry", userLocation?.Country);
            parameters.Add("UserState", userLocation?.State);
            parameters.Add("UserCity", userLocation?.City);

            parameters.Add(
                "Offset",
                ((long)query.Page - 1) * query.PageSize);

            parameters.Add("PageSize", query.PageSize);

            var filters = BuildFilters(query, parameters);
            var orderBy = BuildOrderBy(query);

            const string fromSql = """
                FROM Offers o
                INNER JOIN Locations l ON l.Id = o.LocationId
                INNER JOIN Sports s ON s.Id = o.SportId
                INNER JOIN Users author ON author.Id = o.AuthorId
                CROSS APPLY (
                    SELECT COUNT(*) AS CurrentPeople
                    FROM OfferParticipants op
                    WHERE op.OfferId = o.Id
                ) participants
                """;

            var sql = $"""
                SELECT COUNT(*)
                {fromSql}
                {filters};

                SELECT
                    o.Id AS OfferId,
                    o.Title,
                    o.Description,
                    o.SportId,
                    s.Name AS SportName,
                    o.Level,
                    o.PlanningDate AS [Date],
                    l.City,
                    l.State,
                    participants.CurrentPeople,
                    o.MaxPeople,
                    o.Mode,
                    o.AuthorId,
                    author.PersonalData_Name AS AuthorName,
                    CASE
                        WHEN @UserCity IS NOT NULL
                             AND l.Country = @UserCountry
                             AND l.State = @UserState
                             AND l.City = @UserCity
                            THEN 0

                        WHEN @UserState IS NOT NULL
                             AND l.Country = @UserCountry
                             AND l.State = @UserState
                            THEN 1

                        ELSE 2
                    END AS LocationPriority
                {fromSql}
                {filters}
                {orderBy}
                OFFSET @Offset ROWS
                FETCH NEXT @PageSize ROWS ONLY;
                """;

            var command = new CommandDefinition(
                sql,
                parameters,
                cancellationToken: cancellationToken);

            using var results = await connection.QueryMultipleAsync(command);

            var totalCount = await results.ReadSingleAsync<int>();
            var items = (await results.ReadAsync<OfferListItem>()).ToList();

            foreach (var item in items)
            {
                item.Date = DateTime.SpecifyKind(
                    item.Date,
                    DateTimeKind.Utc);
            }

            return new OffersPageDto(
                items,
                totalCount,
                query.Page,
                query.PageSize);
        }

        private static string BuildFilters(SearchOfferQuery query, DynamicParameters parameters)
        {
            var conditions = new List<string>
            {
                "o.Availability = @Availability",
                "o.PlanningDate >= @Now",
            };

            parameters.Add("Availability", AvailabilityEnum.Available.ToString());
            parameters.Add("Now", DateTime.UtcNow);

            if (query.SportId is int sportId)
            {
                conditions.Add("o.SportId = @SportId");
                parameters.Add("SportId", sportId);
            }

            if (query.DateFrom is { } dateFrom)
            {
                conditions.Add("o.PlanningDate >= @DateFrom");
                parameters.Add("DateFrom", dateFrom.UtcDateTime);
            }

            if (query.DateToExclusive is { } dateTo)
            {
                conditions.Add("o.PlanningDate < @DateToExclusive");
                parameters.Add("DateToExclusive", dateTo.UtcDateTime);
            }

            if (query.Location is { } location)
            {
                conditions.Add("l.Country = @Country");
                parameters.Add("Country", location.Country);

                if (!string.IsNullOrWhiteSpace(location.State))
                {
                    conditions.Add("l.State = @State");
                    parameters.Add("State", location.State);
                }

                if (!string.IsNullOrWhiteSpace(location.City))
                {
                    conditions.Add("l.City = @City");
                    parameters.Add("City", location.City);
                }
            }

            if (query.MinParticipants is int minParticipants)
            {
                conditions.Add("participants.CurrentPeople >= @MinParticipants");
                parameters.Add("MinParticipants", minParticipants);
            }

            if (query.MaxParticipants is int maxParticipants)
            {
                conditions.Add("o.MaxPeople <= @MaxPeople");
                parameters.Add("MaxPeople", maxParticipants);
            }

            if (query.Level is LevelEnum level)
            {
                conditions.Add("o.level = @Level");
                parameters.Add("Level", level.ToString());
            }

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                conditions.Add("(o.Title LIKE @Search OR o.Description LIKE @Search)");
                parameters.Add("Search", $"%{query.Search.Trim()}%");
            }

            return "Where " + string.Join("\nAND ", conditions);
        }

        private static string BuildOrderBy(SearchOfferQuery query)
        {
            var direction = query.SortOrder switch
            {
                SortOrderEnum.ASC => "ASC",
                SortOrderEnum.DESC => "DESC",
                _ => throw new ArgumentOutOfRangeException(nameof(query.SortOrder))
            };

            var selectedOrder = query.SortOption switch
            {
                SortOptionsEnum.Players =>
                    $"participants.CurrentPeople {direction}",

                SortOptionsEnum.Location =>
                    $"l.Country {direction}, l.State {direction}, l.City {direction}",

                SortOptionsEnum.Sport =>
                    $"s.Name {direction}",

                _ => throw new ArgumentOutOfRangeException(
                    nameof(query.SortOption))
            };

            return $"""
                ORDER BY
                    LocationPriority ASC,
                    {selectedOrder},
                    o.Id ASC
                """;
        }

        private static async Task<OfferSearchLocationDto?> GetUserLocation(int userId, IDbConnection connection, CancellationToken cancellationToken)
        {
            const string sql = """
                SELECT
                    l.Country,
                    l.State,
                    l.City
                FROM Users u
                INNER JOIN Locations l ON l.Id = u.LocationId
                WHERE u.Id = @UserId;
                """;

            var command = new CommandDefinition(
               sql,
               new { UserId = userId },
               cancellationToken: cancellationToken);

            var location = await connection.QuerySingleOrDefaultAsync<OfferSearchLocationDto>(command);
            return location;
        }
    }
}
