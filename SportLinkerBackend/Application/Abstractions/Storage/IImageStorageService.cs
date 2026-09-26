using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Abstractions.Storage
{
    public interface IImageStorageService
    {
        Task<string> UploadImageAsync(Stream fileStream, string fileName, ImageType imageType, CancellationToken cancellationToken = default);
        Task DeleteImageAsync(string fileUrl, CancellationToken cancellationToken = default);
    }
}
