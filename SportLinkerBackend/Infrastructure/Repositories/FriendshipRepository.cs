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

    public void Add(Friendship friendship) =>
        dbContext.Friendships.Add(friendship);

    public void Remove(Friendship friendship) =>
        dbContext.Friendships.Remove(friendship);

    public Task<FriendRequest?> GetFriendRequestByReceiverIdAsync(
        int receiverId,
        CancellationToken cancellationToken = default)
    {
        return dbContext.FriendRequests.FirstOrDefaultAsync(
            r => r.ReceiverId == receiverId,
            cancellationToken);
    }
}
