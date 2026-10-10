using Domain.Abstractions;

namespace Domain.Errors
{
    public static class UserErrors
    {
        public static readonly Error EmailAlreadyInUse = new(
            "EMAIL_ALREADY_IN_USE",
            "Użytkownik o podanym adresie e-mail już istnieje.");
        public static readonly Error InvalidCredentials = new(
            "INVALID_CREDENTIALS",
            "Niepoprawny email lub hasło.");
        public static readonly Error RefreshTokenExpiredOrRevoked = new(
            "REFRESH_TOKEN_EXPIRED_OR_REVOKED",
            "Token odświeżający wygasł lub został unieważniony.");

        public static readonly Error UserNotFound = new(
            "USER_NOT_FOUND",
            "Użytkownik nie istnieje.");
    }
}
