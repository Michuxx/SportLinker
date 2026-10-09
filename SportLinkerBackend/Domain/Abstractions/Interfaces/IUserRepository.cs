using Domain.Entities;

namespace Domain.Abstractions.Interfaces
{
    public interface IUserRepository
    {
        void AddUser(User user);
        Task<User?> GetUserByEmailAsync(string email, CancellationToken cancellationToken);
        Task<bool> IsUserWithEmailExists(string email, CancellationToken cancellationToken);
        Task<RefreshToken?> GetRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken);
    }
}
