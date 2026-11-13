namespace Application.Abstractions.Messaging
{
    public interface IUserLastSeenWriter
    {
        Task UpdateAsync(int userId, DateTime lastSeenAtUtc, CancellationToken cancellationToken);
    }
}
