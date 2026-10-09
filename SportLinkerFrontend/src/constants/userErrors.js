export const USER_ERROR_CODES = {
  EMAIL_ALREADY_IN_USE: "EMAIL_ALREADY_IN_USE",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  REFRESH_TOKEN_EXPIRED_OR_REVOKED: "REFRESH_TOKEN_EXPIRED_OR_REVOKED",
};

export const ERROR_MESSAGES = {
  [USER_ERROR_CODES.EMAIL_ALREADY_IN_USE]:
    "Użytkownik o podanym adresie e-mail już istnieje.",
  [USER_ERROR_CODES.INVALID_CREDENTIALS]:
    "Nieprawidłowy email lub hasło.",
  [USER_ERROR_CODES.REFRESH_TOKEN_EXPIRED_OR_REVOKED]:
    "Sesja wygasła lub została unieważniona. Zaloguj się ponownie.",
  NETWORK_ERROR:
    "Nie udało się połączyć z serwerem. Sprawdź, czy backend działa.",
  DEFAULT: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.",
};
