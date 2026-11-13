using Application.Abstractions.Messaging;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Messaging.Presence
{
    public class UserLastSeenWriter(ApplicationDbContext dbContext) : IUserLastSeenWriter
    {
        public async Task UpdateAsync(int userId, DateTime lastSeenAtUtc, CancellationToken cancellationToken)
        {
            await dbContext.Users
                .Where(x =>
                    x.Id == userId
                    && (x.LastSeenAt == null ||
                        x.LastSeenAt < lastSeenAtUtc))
                .ExecuteUpdateAsync(x => x.SetProperty(
                        z => z.LastSeenAt, 
                        (DateTime?)lastSeenAtUtc), 
                    cancellationToken);
        }
    }
}
