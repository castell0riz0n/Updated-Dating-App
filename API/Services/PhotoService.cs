using API.Helpers;
using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services;

public class PhotoService: IPhotoService
{
    private readonly Cloudinary _cloudinary;
    private readonly IOptions<CloudinarySettings> _config;
    public PhotoService(IOptions<CloudinarySettings> config)
    {
        _config = config;

        var acc = new Account(_config.Value.CloudName, _config.Value.ApiKey, _config.Value.ApiSecret);
        _cloudinary = new Cloudinary(acc);
    }
    public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
    {
        var uploadRes = new ImageUploadResult();

        if (file.Length > 0)
        {
            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
            };

            uploadRes = await _cloudinary.UploadAsync(uploadParams);
        }

        return uploadRes;
    }

    public async Task<DeletionResult> DeletePhotoAsync(string publicId)
    {
        var delParams = new DeletionParams(publicId);

        var result = await _cloudinary.DestroyAsync(delParams);

        return result;
    }
}