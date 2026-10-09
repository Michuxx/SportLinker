using Application.Abstractions;

namespace Application.Users.GetUserData
{
    public class GetUserDataQueryHandler : IQueryHandler<GetUserDataQuery, Result<UserDataDto>>
    {
        public async Task<Result<UserDataDto>> Handle(GetUserDataQuery query, CancellationToken cancellationToken)
        {

        }
    }
}
