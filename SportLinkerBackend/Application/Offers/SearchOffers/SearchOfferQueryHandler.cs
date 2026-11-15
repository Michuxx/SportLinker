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

            if(query.SportId is int sportId)
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
