using Application.Abstractions;
using Domain.Abstractions;

namespace Application.Offers.RejectPendingRequest
{
    public sealed record RejectPendingRequestCommand(int UserId, int OfferId) : ICommand<Result<bool>>
    {
    }
}
