using Application.Abstractions;
using Application.Users.Dtos;

namespace Application.Users.SentOfferRequests
{
    public sealed record SentOfferRequestsQuery() : IQuery<List<SentOfferRequestDto>>
    {
    }
}
