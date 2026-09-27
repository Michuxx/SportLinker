using Application.Abstractions.Data;
using Application.Abstractions.Security;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Infrastructure.Database;
using Infrastructure.Repositories;
using Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException("Brak connection stringa 'Database' w appsettings.json");

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));

            services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<ApplicationDbContext>());

            services.AddSingleton<ISqlConnectionFactory, SqlConnectionFactory>();
            services.AddSingleton<IPasswordHasher, PasswordHasher>();
            services.AddScoped<IUserRepository, UserRepository>();

            return services;
        }
    }
}
