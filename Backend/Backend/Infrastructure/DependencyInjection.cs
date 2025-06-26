using System.Net;
using System.Net.Mail;

using Infrastructure.Common.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Application.Common.Interfaces;
using PokeApiNet;


namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddHttpContextAccessor()
            .AddServices()
            .AddPersistence(configuration);

        return services;
    }
    
    private static IServiceCollection AddServices(this IServiceCollection services)
    {
        //services.AddSingleton<IDateTimeProvider, SystemDateTimeProvider>();

        return services;
    }

    private static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {
        
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(configuration.GetSection("DbSettings")["ConnectionString"])
                .EnableSensitiveDataLogging()
        );

        services.AddScoped<IAppDbContext, AppDbContext>();
        services.AddScoped<PokeApiClient, CustomPokeApiClient.CustomPokeApiClient>();

        return services;
    }
    
}