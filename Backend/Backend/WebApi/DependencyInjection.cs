using System.Reflection;
using Microsoft.Extensions.DependencyInjection;

namespace WebApi;

public static class DependencyInjection
{
    public static IServiceCollection AddPresentation(this IServiceCollection services)
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddProblemDetails();
        
        services.AddSwaggerGen(c =>
        {
            // c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
            // {
            //     Title = "PokemonApi",
            //     Version = "v1",
            //     Description = "This APi provides several Endpoints for our Pokemon Arena Game",
            // });
            // var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
            // var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            // c.IncludeXmlComments(xmlPath);
        });
        


        return services;
    }
}