using Application.Abstractions;
using Application.Abstractions.Data;
using Application.Users.Dtos;
using Dapper;
using System.Data;

namespace Application.Users.GetSports
{
    public class GetSportsQueryHandler : IQueryHandler<GetSportsQuery, List<SportDto>>
    {
        private readonly ISqlConnectionFactory _sqlConnectionFactory;
        public GetSportsQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
        {
            _sqlConnectionFactory = sqlConnectionFactory;
        }
        public async Task<List<SportDto>> Handle(GetSportsQuery query, CancellationToken cancellationToken)
        {
            using IDbConnection connection = _sqlConnectionFactory.CreateConnection();

            const string sql = @"
                SELECT Id, Name
                FROM Sports
            ";

            var sports = await connection.QueryAsync<SportDto>(sql);

            return sports.ToList();
        }
    }
}
