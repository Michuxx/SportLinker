using Application.Abstractions;
using Application.Abstractions.Authentication;
using Application.Abstractions.Security;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Entities;

namespace Application.Users.LoginUser
{
    public class LoginUserCommandHandler : ICommandHandler<LoginUserCommand, LoggedUserDto>
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtProvider _jwtProvider;
        private readonly IUnitOfWork _unitOfWork;

        public LoginUserCommandHandler(IPasswordHasher passwordHasher, IUserRepository userRepository, IJwtProvider jwtProvider, IUnitOfWork unitOfWork)
        {
            _passwordHasher = passwordHasher;
            _userRepository = userRepository;
            _jwtProvider = jwtProvider;
            _unitOfWork = unitOfWork;
        }

        public async Task<LoggedUserDto> Handle(LoginUserCommand command, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetUserByEmailAsync(command.email, cancellationToken);
            if (user == null || !_passwordHasher.VerifyPassword(command.password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

            var accessToken = _jwtProvider.GenerateToken(user);
            var refreshTokenValue = _jwtProvider.GenerateRefreshToken();

            var refreshToken = new RefreshToken
            {
                Token = refreshTokenValue,
                UserId = user.Id,
                CreatedOnUtc = DateTime.UtcNow,
                ExpiresOnUtc = _jwtProvider.GetRefreshTokenExpirationDate()
            };

            user.RefreshTokens.Add(refreshToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new LoggedUserDto
            {
                AccessUserToken = accessToken,
                RefreshUserToken = refreshTokenValue
            };
        }
    }
}
