using Domain.Abstractions;
using Domain.Abstractions.Interfaces;
using Domain.Errors;

namespace Application.Messages.Policies
{
    public class PrivateMessagingPolicy : IPrivateMessagingPolicy
    {
        private readonly IUserRepository _userRepository;
        private readonly IFriendshipRepository _friendshipRepository;

        public PrivateMessagingPolicy(IUserRepository userRepository, IFriendshipRepository friendshipRepository)
        {
            _userRepository = userRepository;
            _friendshipRepository = friendshipRepository;
        }

        public async Task<Result<bool>> CheckAsync(
            int senderId,
            int receiverId,
            CancellationToken cancellationToken)
        {
            var receiver = await _userRepository.GetUserByIdAsync(
                receiverId,
                cancellationToken);

            if (receiver is null)
            {
                return Result<bool>.Failure(UserErrors.UserNotFound);
            }

            var friendship = await _friendshipRepository.GetBetweenAsync(
                senderId,
                receiverId,
                cancellationToken);

            if (friendship is null)
            {
                return Result<bool>.Failure(
                    FriendshipErrors.FriendshipNotFound);
            }

            return Result<bool>.Success(true);
        }

    }
}
