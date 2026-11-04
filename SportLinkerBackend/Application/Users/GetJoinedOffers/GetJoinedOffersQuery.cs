using Application.Abstractions;
using Application.Users.Dtos;

namespace Application.Users.GetJoinedOffers
{
    public sealed record GetJoinedOffersQuery() : IQuery<List<JoinedOffersDto>>
    {

    }
}
