using Application.Abstractions;
using Domain.Abstractions;

namespace Application.Offers.CancelRequest
{
    public sealed record CancelRequestCommand(int OfferId) : ICommand<Result<bool>>
    {
    }
}
