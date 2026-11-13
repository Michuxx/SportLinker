using Domain.Abstractions.Interfaces;
using Domain.Entities;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal sealed class FriendshipRepository(ApplicationDbContext dbContext)
    : IFriendshipRepository
{
    public Task<Friendship?> GetBetweenAsync(
        int userId,
        int otherUserId,
        CancellationToken cancellationToken = default)
    {
        var firstUserId = Math.Min(userId, otherUserId);
        var secondUserId = Math.Max(userId, otherUserId);

        return dbContext.Friendships.FirstOrDefaultAsync(
            f => f.FirstUserId == firstUserId
                && f.SecondUserId == secondUserId,
            cancellationToken);
    }

    public void AddFriendship(Friendship friendship) =>
        dbContext.Friendships.Add(friendship);
    public void RemoveFriendship(Friendship friendship) =>
        dbContext.Friendships.Remove(friendship);
    public void AddFriendRequest(FriendRequest friendRequest) =>
        dbContext.FriendRequests.Add(friendRequest);
    public void RemoveFriendRequest(FriendRequest friendRequest) =>
        dbContext.FriendRequests.Remove(friendRequest);

    public Task<FriendRequest?> GetFriendRequestByReceiverIdAsync(
        int receiverId,
        int senderId,
        CancellationToken cancellationToken = default)
    {
        return dbContext.FriendRequests.FirstOrDefaultAsync(r => 
            (r.SenderId == senderId && r.ReceiverId == receiverId)
            || (r.SenderId == receiverId && r.ReceiverId == senderId),
            cancellationToken);
    }

    public Task<FriendRequest?> GetFriendRequestByIdAsync(
        int friendRequestId,
        CancellationToken cancellationToken = default)
    {
        return dbContext.FriendRequests.FirstOrDefaultAsync(
            r => r.Id == friendRequestId,
            cancellationToken);
    }

    public Task<List<int>> GetFriendIdsAsync(
    int userId,
    CancellationToken cancellationToken)
    {
        return dbContext.Friendships
            .AsNoTracking()
            .Where(friendship =>
                friendship.FirstUserId == userId ||
                friendship.SecondUserId == userId)
            .Select(friendship =>
                friendship.FirstUserId == userId
                    ? friendship.SecondUserId
                    : friendship.FirstUserId)
            .Distinct()
            .ToListAsync(cancellationToken);
    }
}
