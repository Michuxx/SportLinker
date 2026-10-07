using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Abstractions.Interfaces
{
    public interface IUserRepository
    {
        void AddUser(User user);
        Task<User?> GetUserByEmailAsync(string email, CancellationToken cancellationToken);
    }
}
