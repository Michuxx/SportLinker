using Application.Abstractions;
using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Users.Dtos;
using Dapper;
using Domain.Abstractions;
using System.Data;

namespace Application.Users.GetUserFriendInvitations
{
    public sealed class GetUserFriendInvitationsQueryHandler : IQueryHandler<GetUserFriendInvitationsQuery, Result<List<UserFriendInvitation>>>
    {
        private readonly ISqlConnectionFactory _sqlConnectionFactory;
        private readonly ICurrentUser _currentUser;
        public GetUserFriendInvitationsQueryHandler(ICurrentUser currentUser, ISqlConnectionFactory sqlConnectionFactory)
        {
            _currentUser = currentUser;
            _sqlConnectionFactory = sqlConnectionFactory;
        }
        public async Task<Result<List<UserFriendInvitation>>> Handle(GetUserFriendInvitationsQuery request, CancellationToken cancellationToken)
        {
            using IDbConnection connection = _sqlConnectionFactory.CreateConnection();
            var userId = _currentUser.UserId;

            const string sql = """
            SELECT 
                fr.Id as FriendRequestId, 
                fr.SenderId, 
                fr.CreatedAt,
                u.PersonalData_Name as SenderUsername, 
                u.Images_ProfileImage as ImageUrl
            FROM FriendRequests fr
            INNER JOIN Users u 
                ON fr.SenderId = u.Id
            WHERE fr.ReceiverId = @UserId
            """;

            var command = new CommandDefinition(sql, new { UserId = userId }, cancellationToken: cancellationToken);
            var invitations = await connection.QueryAsync<UserFriendInvitation>(command);
            return Result<List<UserFriendInvitation>>.Success(invitations.ToList());
        }
    }
}
