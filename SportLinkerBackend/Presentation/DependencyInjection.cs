using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Presentation.Hubs;


namespace Presentation
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddPresentation(this IServiceCollection services)
        {
            services.AddSignalR();
            services.AddSingleton<IUserIdProvider, JwtUserIdProvider>();
            return services;
        }
    }
}
