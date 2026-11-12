using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Security;
using Application.Abstractions.Storage;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Infrastructure.Authentication;
using Infrastructure.Database;
using Infrastructure.Messaging.Outbox;
using Infrastructure.Messaging.RabbitMq;
using Infrastructure.Repositories;
using Infrastructure.Security;
using Infrastructure.Storage;
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

            services.AddHttpContextAccessor();

            services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<ApplicationDbContext>());

            services.AddSingleton<ISqlConnectionFactory, SqlConnectionFactory>();
            services.AddSingleton<IPasswordHasher, PasswordHasher>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IImageStorageService, ImageStorageService>();
            services.AddScoped<IOfferRepository, OfferRepository>();
            services.AddScoped<IFriendshipRepository, FriendshipRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<MessageSentDispatcher>();

            services.AddSingleton<IJwtProvider, JwtProvider>();
            services.AddSingleton<ICurrentUser, CurrentUser>();
            services.AddSingleton<IOutboxPublisher, RabbitMqOutboxPublisher>();

            services.Configure<RabbitMqOptions>(configuration.GetSection(RabbitMqOptions.SectionName));
            services.AddHostedService<OutboxProcessor>();
            services.AddHostedService<MessageSentConsumer>();

            return services;
        }
    }
}
