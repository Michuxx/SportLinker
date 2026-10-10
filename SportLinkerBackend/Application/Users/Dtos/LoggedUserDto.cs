namespace Application.Users.Dtos
{
    public class LoggedUserDto
    {
        public string AccessUserToken { get; set; } = default!;
        public string RefreshUserToken { get; set; } = default!;
    }
}
