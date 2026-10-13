using Application.Abstractions.Storage;
using Domain.Enums;
using Microsoft.AspNetCore.Hosting;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace Infrastructure.Storage
{
    public sealed class ImageStorageService : IImageStorageService
    {
        private readonly IWebHostEnvironment _environment;

        public ImageStorageService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        private string GetWebRootPath() =>
            _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");

        public async Task<string> UploadImageAsync(Stream fileStream, string fileName, ImageType imageType, CancellationToken cancellationToken = default)
        {
            int maxWidth = GetMaxWidthForImageType(imageType);

            var fileExtension = Path.GetExtension(fileName);
            var uniqueFileName = $"{Guid.NewGuid()}.webp";
            var subfolder = imageType.ToString().ToLower() + "s";

            var uploadPath = Path.Combine(GetWebRootPath(), subfolder);

            if(!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            var filePath = Path.Combine(uploadPath, uniqueFileName);

            using (var image = await Image.LoadAsync(fileStream, cancellationToken))
            {
                image.Mutate(x => x.Resize(new ResizeOptions
                {
                    Size = new Size(maxWidth, maxWidth),
                    Mode = ResizeMode.Max 
                }));
                await image.SaveAsWebpAsync(filePath, cancellationToken);
            }

            return $"/{subfolder}/{uniqueFileName}";
        }

        public  Task DeleteImageAsync(string fileUrl, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(fileUrl)) return Task.CompletedTask;

            var relativePath = fileUrl.TrimStart('/'); 
            var physicalPath = Path.Combine(GetWebRootPath(), relativePath);

            if (File.Exists(physicalPath))
            {
                File.Delete(physicalPath);
            }

            return Task.CompletedTask;
        }

        private int GetMaxWidthForImageType(ImageType imageType)
        {
            return imageType switch
            {
                ImageType.Profile => 400,
                ImageType.Background => 1920,
                _ => throw new ArgumentOutOfRangeException(nameof(imageType), $"Unsupported image type: {imageType}")
            };
        }
    }
}
