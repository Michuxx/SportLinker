using Microsoft.AspNetCore.Http.HttpResults;
using SportLinkerBackend.Models;

namespace SportLinkerBackend.Services
{
    public class UserService
    {
        public User SetIdForNewUser(User user)
        {
            user.Id = Guid.NewGuid();
            return user; 
        }
    }
}
