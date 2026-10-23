using Application.Abstractions;

namespace Application.Users.UpdateFavouriteSports
{
    public sealed record UpdateFavouriteSportsCommand( List<int> SportIds) : ICommand<Result<List<int>>>;
}
