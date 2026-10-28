using Application.Abstractions;
using Domain.Abstractions;

namespace Application.Offers.AcceptPendingRequest
{
    public sealed record AcceptPendingRequestCommand(int UserId, int OfferId) : ICommand<Result<bool>>
    {
    }
}
