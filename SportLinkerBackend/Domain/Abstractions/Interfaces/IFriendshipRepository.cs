using Domain.Entities;

namespace Domain.Abstractions.Interfaces;

public interface IFriendshipRepository
{
    Task<Friendship?> GetBetweenAsync(
        int userId,
        int otherUserId,
        CancellationToken cancellationToken = default);

    void Add(Friendship friendship);
    void Remove(Friendship friendship);
}
