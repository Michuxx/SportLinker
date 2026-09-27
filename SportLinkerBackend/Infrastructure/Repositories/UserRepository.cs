using Domain.Abstractions.Interfaces;
using Domain.Entities;
using Infrastructure.Database;

namespace Infrastructure.Repositories
{
    internal sealed class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _dbContext;
        public UserRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public void AddUser(User user)
        {
            _dbContext.Users.Add(user);
        }
    }
}
