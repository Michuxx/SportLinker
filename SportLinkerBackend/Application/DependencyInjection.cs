using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            var assembly = typeof(DependencyInjection).Assembly;

            services.AddMediatR(conf => conf.RegisterServicesFromAssembly(assembly));

            services.AddAutoMapper(cfg => cfg.AddMaps(assembly));

            services.AddValidatorsFromAssembly(assembly);

            return services;
        }
    }
}
