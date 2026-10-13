using Application.Abstractions;
using Application.Users.Dtos;

namespace Application.Users.GetSports
{
    public sealed record GetSportsQuery : IQuery<List<SportDto>>
    {
    }
}
  