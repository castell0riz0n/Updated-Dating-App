﻿using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPhotoService _photoService;
    private readonly IMapper _mapper;

    public UsersController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _photoService = photoService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
    {
        var gender = await _unitOfWork.UserRepository.GetUserGenderAsync(User.GetUsername());
        userParams.CurrentUsername = User.GetUsername();
        if (string.IsNullOrEmpty(userParams.Gender))
        {
            userParams.Gender = gender == "male" ? "female" : "male";
        }

        var users = await _unitOfWork.UserRepository.GetMembersAsync(userParams);
        Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
        return Ok(users);
    }

    [HttpGet("{username}", Name = "GetUser")]
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        var currentUsername = User.GetUsername();
        return await _unitOfWork.UserRepository.GetMemberAsync(username,
            isCurrentUser: currentUsername == username
        );
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto input)
    {
        var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

        _mapper.Map(input, user);
        _unitOfWork.UserRepository.Update(user);
        if (await _unitOfWork.Complete())
        {
            return NoContent();
        }

        return BadRequest("Failed to update user info");
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {
        var user = await
            _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());
        var result = await _photoService.AddPhotoAsync(file);
        if (result.Error != null) return BadRequest(result.Error.Message);
        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };
        user.Photos.Add(photo);
        if (await _unitOfWork.Complete())
        {
            return CreatedAtRoute("GetUser", new { username =
                user.UserName }, _mapper.Map<PhotoDto>(photo));
        }
        return BadRequest("Problem addding photo");
    }

    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

        var photo = user.Photos.FirstOrDefault(a => a.Id == photoId);
        if (photo.IsMain)
        {
            return BadRequest("This is already your main photo");
        }

        var currentMain = user.Photos.FirstOrDefault(a => a.IsMain);
        if (currentMain != null)
        {
            currentMain.IsMain = false;
        }

        photo.IsMain = true;

        if (await _unitOfWork.Complete())
        {
            return NoContent();
        }

        return BadRequest("Failed to set Main photo");
    }

    [HttpDelete("delete-photo/{photoId}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
        var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());
        var photo = user.Photos.FirstOrDefault(a => a.Id == photoId);
        if (photo == null)
        {
            return NotFound();
        }

        if (photo.IsMain)
        {
            return BadRequest("You can not delete your main photo");
        }

        if (photo.PublicId != null)
        {
            var deleteRes = await _photoService.DeletePhotoAsync(photo.PublicId);
            if (deleteRes.Error != null)
            {
                return BadRequest(deleteRes.Error.Message);
            }
        }

        user.Photos.Remove(photo);
        if (await _unitOfWork.Complete())
        {
            return Ok();
        }

        return BadRequest("Problem deleting photo");
    }
}