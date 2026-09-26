using Application.Abstractions.Storage;
using Domain.Enums;

namespace Infrastructure.Storage
{
    public sealed class ImageStorageService : IImageStorageService
    {
        public async Task<string> UploadImageAsync(Stream fileStream, string fileName, ImageType imageType, CancellationToken cancellationToken = default)
        {
            var fileExtension = Path.GetExtension(fileName);
            var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
            var subfolder = imageType.ToString().ToLower() + "s";

            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(),"wwwroot" ,subfolder);

            if(!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            var filePath = Path.Combine(uploadPath, uniqueFileName);

            using (var fileStreamOnDisk = new FileStream(filePath, FileMode.Create))
            {
                await fileStream.CopyToAsync(fileStreamOnDisk, cancellationToken);
            }

            return $"/{subfolder}/{uniqueFileName}";
        }

        public  Task DeleteImageAsync(string fileUrl, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(fileUrl)) return Task.CompletedTask;

            var relativePath = fileUrl.TrimStart('/'); 
            var physicalPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", relativePath);

            if (File.Exists(physicalPath))
            {
                File.Delete(physicalPath);
            }

            return Task.CompletedTask;
        }
    }
}
