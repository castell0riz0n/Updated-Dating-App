﻿using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class UserRepository: IUserRepository
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public UserRepository(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public void Update(AppUser user)
    {
        _context.Entry(user).State = EntityState.Modified;
    }

    public async Task<bool> SaveAllAsync()
    {
        return (await _context.SaveChangesAsync()) > 0;
    }

    public async Task<IEnumerable<AppUser>> GetUsersAsync()
    {
        return await _context.Users.Include(a => a.Photos).ToListAsync();
    }

    public async Task<AppUser> GetUserByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<AppUser> GetUserByUsernameAsync(string username)
    {
        return await _context.Users.Include(a => a.Photos).SingleOrDefaultAsync(a => a.UserName == username.ToLower());
    }

    public async Task<IEnumerable<MemberDto>> GetMembersAsync()
    {
        return await _context.Users.ProjectTo<MemberDto>(_mapper.ConfigurationProvider).ToListAsync();
    }

    public async Task<MemberDto> GetMemberAsync(string username)
    {
        return await _context.Users.Where(a => a.UserName == username.ToLower())
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
    }
}