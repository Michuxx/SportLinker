import { ERROR_MESSAGES, USER_ERROR_CODES } from "../constants/userErrors";

/**
 * Pobiera maszynowy kod błędu z odpowiedzi backendu.
 * Obsługuje formaty:
 * - error.response.data.message.code
 * - error.response.data.code
 */
export const getErrorCode = (error) => {
  return (
    error?.response?.data?.message?.code ||
    error?.response?.data?.code ||
    null
  );
};

/**
 * Pobiera czytelny komunikat błędu dopasowany do kodu błędu z backendu.
 */
export const getErrorMessage = (error, defaultFallback = ERROR_MESSAGES.DEFAULT) => {
  if (error?.code === "ERR_NETWORK" || !error?.response) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  const code = getErrorCode(error);
  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }

  // Fallback: treść tekstowa przesłana bezpośrednio przez backend
  const backendMessage =
    error?.response?.data?.message?.message ||
    (typeof error?.response?.data?.message === "string"
      ? error?.response?.data?.message
      : null) ||
    error?.response?.data?.title;

  if (backendMessage) {
    return backendMessage;
  }

  if (error?.response?.status === 401) {
    return ERROR_MESSAGES[USER_ERROR_CODES.INVALID_CREDENTIALS];
  }

  return defaultFallback;
};
