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
        CreateMap<Message, MessageDto>()
            .ForMember(dest => dest.SenderPhotoUrl,
                opt => opt.MapFrom(
                    src => src.Sender.Photos.FirstOrDefault(a => a.IsMain).Url))
            .ForMember(dest => dest.RecipientPhotoUrl,
                opt => opt.MapFrom(
                    src => src.Recipient.Photos.FirstOrDefault(a => a.IsMain).Url));
        //
        // CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d , DateTimeKind.Utc));
    }
}