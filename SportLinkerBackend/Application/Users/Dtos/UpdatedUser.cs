namespace Application.Users.Dtos
{
    public sealed record UpdatedUser(
        int UserId,
        string Name,
        DateOnly? BirthDate,
        string? Gender,
        UserLocationDto? Location
    );
}
