using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikeRepository : ILikeRepository
{
    private readonly DataContext _context;

    public LikeRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<UserLike> GetUserLike(int sourceId, int likedUserId)
    {
        return await _context.Likes.FindAsync(sourceId, likedUserId);
    }

    public async Task<AppUser> GetUserWithLikes(int userId)
    {
        return await _context.Users.Include(a => a.LikedUser)
            .FirstOrDefaultAsync(a => a.Id == userId);
    }

    public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams)
    {
        var users = _context.Users.OrderBy(a => a.UserName).AsQueryable();
        var likes = _context.Likes.AsQueryable();

        if (likesParams.Predicate == "liked")
        {
            likes = likes.Where(a => a.SourceUserId == likesParams.UserId);
            users = likes.Select(a => a.LikedUser);
        }

        if (likesParams.Predicate == "likedBy")
        {
            likes = likes.Where(a => a.LikedUserId == likesParams.UserId);
            users = likes.Select(a => a.SourceUser);
        }

        var likedUsers = users.Select(a => new LikeDto
        {
            Username = a.UserName,
            KnownAs = a.KnownAs,
            Age = a.DateOfBirth.CalculateAge(),
            PhotoUrl = a.Photos.FirstOrDefault(b => b.IsMain).Url,
            City = a.City,
            Id = a.Id
        });

        return await PagedList<LikeDto>.CreateAsync(likedUsers, likesParams.PageNumber, likesParams.PageSize);
    }
}