using Application.Abstractions.Behaviors;
using Application.Messages.Policies;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            var assembly = typeof(DependencyInjection).Assembly;

            services.AddMediatR(conf => {
                conf.RegisterServicesFromAssembly(assembly);
                conf.AddOpenBehavior(typeof(ValidationBehavior<,>));
                });

            services.AddAutoMapper(cfg => cfg.AddMaps(assembly));

            services.AddValidatorsFromAssembly(assembly);

            services.AddScoped<IPrivateMessagingPolicy, PrivateMessagingPolicy>();

            return services;
        }
    }
}
