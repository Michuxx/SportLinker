using Application.Abstractions.Authentication;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Authentication
{
    internal sealed class CurrentUser(IHttpContextAccessor httpContextAccessor) : ICurrentUser
    {
        public int UserId 
        {    
            get
            {
                var value = httpContextAccessor.HttpContext?.User.FindFirst("id")?.Value;
                if (!int.TryParse(value, out var userId) || userId <= 0)
                {
                    throw new UnauthorizedAccessException(
                        "Nie można ustalić zalogowanego użytkownika.");
                }

                return userId;
            } 
        }
    }
}
