using Domain.Abstractions;
using Domain.Errors;

namespace Domain.Entities
{
    public sealed class Friendship
    {
        public int Id { get; private set; }
        public int FirstUserId { get; private set; }
        public int SecondUserId { get; private set; }

        private Friendship() { }

        public static Result<Friendship> Create(int userId, int otherUserId)
        {
            if (userId <= 0 || otherUserId <= 0)
            {
                return Result<Friendship>.Failure(
                    FriendshipErrors.InvalidUserId);
            }

            if (userId == otherUserId)
            {
                return Result<Friendship>.Failure(
                    FriendshipErrors.SameUser);
            }

            var friendship = new Friendship
            {
                FirstUserId = Math.Min(userId, otherUserId),
                SecondUserId = Math.Max(userId, otherUserId)
            };

            return Result<Friendship>.Success(friendship);
        }
    }
}
