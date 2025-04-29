using System.Net;
using System.Net.Mail;

using Application.Common.Interfaces;
using Infrastructure.Common.Persistence;

using Application.Common.Interfaces;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


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

        return services;
    }
    
}