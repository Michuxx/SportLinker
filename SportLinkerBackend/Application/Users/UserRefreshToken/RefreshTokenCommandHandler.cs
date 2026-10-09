using Application.Abstractions;
using Application.Abstractions.Authentication;
using Application.Users.LoginUser;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Entities;

namespace Application.Users.UserRefreshToken
{
    public class RefreshTokenCommandHandler : ICommandHandler<RefreshTokenCommand, LoggedUserDto>
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtProvider _jwtProvider;
        private readonly IUnitOfWork _unitOfWork;

        public RefreshTokenCommandHandler(IUserRepository userRepository, IJwtProvider jwtProvider, IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _jwtProvider = jwtProvider;
            _unitOfWork = unitOfWork;
        }
        public async Task<LoggedUserDto> Handle(RefreshTokenCommand command, CancellationToken cancellationToken)
        {
            var existingToken = await _userRepository.GetRefreshTokenAsync(command.refreshToken, cancellationToken);

            if(existingToken is null || !existingToken.IsActive)
            {
                throw new UnauthorizedAccessException("Nieprawidłowy lub wygasły token odświeżający.");
            }

            var user = existingToken.User;

            existingToken.RevokedOnUtc = DateTime.UtcNow;

            var newAccessToken = _jwtProvider.GenerateToken(user);
            var newRefreshToken = _jwtProvider.GenerateRefreshToken();

            var newRefreshTokenEntity = new RefreshToken
            {
                Token = newRefreshToken,
                UserId = user.Id,
                CreatedOnUtc = DateTime.UtcNow,
                ExpiresOnUtc = _jwtProvider.GetRefreshTokenExpirationDate()
            };

            user.RefreshTokens.Add(newRefreshTokenEntity);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            return new LoggedUserDto
            {
                AccessUserToken = newAccessToken,
                RefreshUserToken = newRefreshToken
            };
        }


    }
}
