
using Application.Abstractions;
using Application.Abstractions.Security;
using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Entities;
using Domain.ValueObjects.User;

namespace Application.Users.CreateUser
{
    internal sealed class CreateUserCommandHandler : ICommandHandler<CreateUserCommand>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPasswordHasher _passwordHasher;

        public CreateUserCommandHandler(IUserRepository userRepository, IUnitOfWork unitOfWork, IPasswordHasher passwordHasher)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _passwordHasher = passwordHasher;
        }

        public async Task Handle(CreateUserCommand command, CancellationToken cancellationToken)
        {
            var personalData = new PersonalData(command.name, null, null, null);
            var user = new User
            {
                PersonalData = personalData,
                PasswordHash = _passwordHasher.HashPassword(command.password)
            };

            user.ChangeEmail(command.email);

            _userRepository.AddUser(user);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}
