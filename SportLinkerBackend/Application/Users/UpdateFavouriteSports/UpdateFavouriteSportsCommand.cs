using Application.Abstractions;

namespace Application.Users.UpdateFavouriteSports
{
    public sealed record UpdateFavouriteSportsCommand(int UserId, List<int> SportIds) : ICommand<Result<List<int>>>;
}
