using Domain.Entities;

namespace Domain.Abstractions.Interfaces;

public interface IFriendshipRepository
{
    Task<Friendship?> GetBetweenAsync(int userId,int otherUserId, CancellationToken cancellationToken = default);

    Task<FriendRequest?> GetFriendRequestByReceiverIdAsync(int receiverId, int senderId, CancellationToken cancellationToken = default);

    Task<FriendRequest?> GetFriendRequestByIdAsync(int friendRequestId, CancellationToken cancellationToken = default);

    void AddFriendship(Friendship friendship);
    void RemoveFriendship(Friendship friendship);
    void AddFriendRequest(FriendRequest friendRequest);
    void RemoveFriendRequest(FriendRequest friendRequest);
}
