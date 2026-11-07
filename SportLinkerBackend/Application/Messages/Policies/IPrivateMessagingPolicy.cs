using Domain.Abstractions;

namespace Application.Messages.Policies
{
    public interface IPrivateMessagingPolicy
    {
        Task<Result<bool>> CheckAsync(
            int senderId,
            int receiverId,
            CancellationToken cancellationToken);
    }
}
