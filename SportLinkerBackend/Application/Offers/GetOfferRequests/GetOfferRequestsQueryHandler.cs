using Application.Abstractions;
using Application.Abstractions.Data;
using Application.Offers.Dtos;
using Dapper;
using System.Data;

namespace Application.Offers.GetOfferRequests
{
    public sealed class GetOfferRequestsQueryHandler : IQueryHandler<GetOfferRequestsQuery, List<OfferRequestDto>>
    {
        private readonly ISqlConnectionFactory _sqlConnectionFactory;
        public GetOfferRequestsQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
        {
            _sqlConnectionFactory = sqlConnectionFactory;
        }
        public async Task<List<OfferRequestDto>> Handle(GetOfferRequestsQuery query, CancellationToken cancellationToken)
        {
            using IDbConnection connection = _sqlConnectionFactory.CreateConnection();

            const string sql = """
                SELECT
                    r.UserId,
                    u.Images_ProfileImage AS UserImage,
                    u.PersonalData_Name AS Name
                FROM OfferRequests r
                INNER JOIN Users u 
                ON u.Id = r.UserId
                WHERE r.OfferId = @OfferId
                AND r.Status = 'Pending';
                """;

            var command = new CommandDefinition(
                sql,
                new { query.OfferId },
                cancellationToken: cancellationToken);

            var participants = await connection.QueryAsync<OfferRequestDto>(command);
            return participants.ToList();

        }
    }
}
