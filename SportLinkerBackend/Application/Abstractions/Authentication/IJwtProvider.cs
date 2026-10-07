using Domain.Entities;

namespace Application.Abstractions.Authentication
{
    public interface IJwtProvider
    {
        string GenerateToken(User user);
        string GenerateRefreshToken();
    }
}
