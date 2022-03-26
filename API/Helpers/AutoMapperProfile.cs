using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<AppUser, MemberDto>()
            .ForMember(dest => dest.PhotoUrl,
                opts =>
                    opts.MapFrom(src =>
                        src.Photos.FirstOrDefault(a => a.IsMain).Url))
            .ForMember(dest => dest.Age,
                opts =>
                    opts.MapFrom(src =>
                        src.DateOfBirth.CalculateAge()));
        CreateMap<Photo, PhotoDto>().ReverseMap();
        CreateMap<MemberUpdateDto, AppUser>();
        CreateMap<RegisterDto, AppUser>();
    }
}