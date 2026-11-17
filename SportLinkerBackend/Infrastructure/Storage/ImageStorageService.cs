using Application.Abstractions.Storage;
using Domain.Enums;
using Microsoft.AspNetCore.Hosting;
using SkiaSharp;

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
            int maxSize = GetMaxWidthForImageType(imageType);

            var uniqueFileName = $"{Guid.NewGuid()}.webp";
            var subfolder = imageType.ToString().ToLowerInvariant() + "s";

            using var input = new MemoryStream();
            await fileStream.CopyToAsync(input, cancellationToken);
            input.Position = 0;

            using var source = DecodeOrientedBitmap(input);

            var scale = Math.Min(
                (double)maxSize / source.Width,
                (double)maxSize / source.Height);

            var width = Math.Max(1, (int)Math.Round(source.Width * scale));
            var height = Math.Max(1, (int)Math.Round(source.Height * scale));

            using var resized = source.Resize(
                source.Info.WithSize(width, height),
                new SKSamplingOptions(SKCubicResampler.Mitchell))
                ?? throw new InvalidOperationException("Nie udało się przeskalować obrazu.");

            cancellationToken.ThrowIfCancellationRequested();

            using var image = SKImage.FromBitmap(resized);
            using var encoded = image.Encode(SKEncodedImageFormat.Webp, 75)
                ?? throw new InvalidOperationException("Nie udało się zapisać obrazu jako WebP.");

            var uploadPath = Path.Combine(GetWebRootPath(), subfolder);

            if(!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            var filePath = Path.Combine(uploadPath, uniqueFileName);

            try
            {
                await using var output = new FileStream(
                    filePath, FileMode.CreateNew, FileAccess.Write,
                    FileShare.None, 81920, useAsync: true);
                using var encodedStream = encoded.AsStream();
                await encodedStream.CopyToAsync(output, cancellationToken);
            }
            catch
            {
                File.Delete(filePath);
                throw;
            }

            return $"/{subfolder}/{uniqueFileName}";
        }

        private static SKBitmap DecodeOrientedBitmap(Stream input)
        {
            using var codec = SKCodec.Create(input)
                ?? throw new InvalidDataException("Nie udało się odczytać obrazu.");
            var bitmap = SKBitmap.Decode(codec)
                ?? throw new InvalidDataException("Nie udało się odczytać obrazu.");

            if (codec.EncodedOrigin == SKEncodedOrigin.TopLeft)
            {
                return bitmap;
            }

            // WebP nie przenosi tutaj metadanych EXIF, więc obrót stosujemy do pikseli.
            using (bitmap)
            {
                var width = bitmap.Width;
                var height = bitmap.Height;
                var swapDimensions = codec.EncodedOrigin is
                    SKEncodedOrigin.LeftTop or SKEncodedOrigin.RightTop or
                    SKEncodedOrigin.RightBottom or SKEncodedOrigin.LeftBottom;

                var matrix = codec.EncodedOrigin switch
                {
                    SKEncodedOrigin.TopRight => new SKMatrix(-1, 0, width, 0, 1, 0, 0, 0, 1),
                    SKEncodedOrigin.BottomRight => new SKMatrix(-1, 0, width, 0, -1, height, 0, 0, 1),
                    SKEncodedOrigin.BottomLeft => new SKMatrix(1, 0, 0, 0, -1, height, 0, 0, 1),
                    SKEncodedOrigin.LeftTop => new SKMatrix(0, 1, 0, 1, 0, 0, 0, 0, 1),
                    SKEncodedOrigin.RightTop => new SKMatrix(0, -1, height, 1, 0, 0, 0, 0, 1),
                    SKEncodedOrigin.RightBottom => new SKMatrix(0, -1, height, -1, 0, width, 0, 0, 1),
                    SKEncodedOrigin.LeftBottom => new SKMatrix(0, 1, 0, -1, 0, width, 0, 0, 1),
                    _ => SKMatrix.Identity
                };

                var oriented = new SKBitmap(bitmap.Info.WithSize(
                    swapDimensions ? height : width,
                    swapDimensions ? width : height));

                try
                {
                    using var canvas = new SKCanvas(oriented);
                    canvas.SetMatrix(matrix);
                    canvas.DrawBitmap(bitmap, 0, 0, new SKSamplingOptions(SKFilterMode.Nearest));
                    return oriented;
                }
                catch
                {
                    oriented.Dispose();
                    throw;
                }
            }
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
