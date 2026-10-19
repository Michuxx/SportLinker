using Application.Abstractions;
using Application.Users.Dtos;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Domain.Errors;
using Domain.ValueObjects.Location;

namespace Application.Users.UpdateUserData
{
    public sealed class UpdateUserProfileCommandHandler : ICommandHandler<UpdateUserProfileCommand, Result<UpdatedUser>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateUserProfileCommandHandler(IUserRepository userRepository, IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<UpdatedUser>> Handle(UpdateUserProfileCommand command, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetUserByIdAsync(command.UserId, cancellationToken);
            if (user == null)
            {
                return Result<UpdatedUser>.Failure(UserErrors.UserNotFound);
            }

            Location? newLocation = command.Location is not null
                ? new Location(command.Location.Lat, command.Location.Long, command.Location.Country, command.Location.State, null, command.Location.Name, null, null, null)
                : null;

            Gender? newGender = command.Gender?.Trim().ToLowerInvariant() switch
            {
                "male" => Gender.Male,
                "female" => Gender.Female,
                "other" => Gender.Other,
                "notdisclosed" or null or "" => null,
                _ => user.PersonalData.Gender
            };

            user.UpdateBasicInfo(command.Name.Trim(), command.BirthDate, newGender, newLocation);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var updatedLocationDto = user.Location is not null
                ? new UserLocationDto
                {
                    Lat = user.Location.Coordinates.Latitude,
                    Long = user.Location.Coordinates.Longitude,
                    Country = user.Location.Country,
                    State = user.Location.State,
                    Name = user.Location.Name,
                    DisplayLabel = !string.IsNullOrWhiteSpace(user.Location.Name) && !string.IsNullOrWhiteSpace(user.Location.State)
                        ? $"{user.Location.Name}, {user.Location.State}"
                        : user.Location.Name ?? user.Location.State
                }
                : null;

            return Result<UpdatedUser>.Success(new UpdatedUser(
                user.Id,
                user.PersonalData.Name,
                user.PersonalData.BirthDate,
                user.PersonalData.Gender?.ToString(),
                updatedLocationDto
            ));
        }
    }
}
