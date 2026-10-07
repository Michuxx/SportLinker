namespace Application.Users.LoginUser
{
    public class LoggedUserDto
    {
        public string AccessUserToken { get; set; } = default!;
        public string RefreshUserToken { get; set; } = default!;
    }
}
