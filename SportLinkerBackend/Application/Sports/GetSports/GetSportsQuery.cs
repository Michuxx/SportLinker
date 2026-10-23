using Application.Abstractions;
using Application.Sports.Dtos;

namespace Application.Sports.GetSports
{
    public sealed record GetSportsQuery : IQuery<List<SportDto>>
    {
    }
}
  