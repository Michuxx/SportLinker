using Application.Abstractions;
using Domain.Abstractions;

namespace Application.Offers.DeleteRejectionRequest
{
    public sealed record DeleteRejectionRequestCommand(int OfferId) : ICommand<Result<bool>>
    {
    }
}
