using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationService(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddScoped<LogUserActivity>();
        services.Configure<CloudinarySettings>(configuration.GetSection("CloudinarySettings"));
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IPhotoService, PhotoService>();
        services.AddScoped<ILikeRepository, LikeRepository>();
        services.AddScoped<IMessageRepository, MessageRepository>();
        services.AddDbContext<DataContext>(opts =>
        {
            opts.UseSqlite(configuration.GetConnectionString("DefaultConnection"));
        });
        services.AddAutoMapper(typeof(AutoMapperProfile));

        return services;
    }
}