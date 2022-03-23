using API.Data;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationService(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddScoped<ITokenService, TokenService>();
        services.AddDbContext<DataContext>(opts =>
        {
            opts.UseSqlite(configuration.GetConnectionString("DefaultConnection"));
        });

        return services;
    }
}