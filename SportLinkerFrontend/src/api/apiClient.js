import axios from "axios";
import { getAccessToken, decodeJwtPayload } from "../utils/tokenStorage";
import { refreshAccessToken } from "./tokenService";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5139/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getTokenUserId = (token) => {
  const payload = decodeJwtPayload(token);
  const userId = payload?.id ?? payload?.sub;

  return userId == null ? null : String(userId);
};

const isAuthEndpoint = (url) => {
  const path = (url ?? "").toLowerCase();

  return (
    path.includes("/users/login") ||
    path.includes("/users/register") ||
    path.includes("/users/refreshtoken")
  );
};

// Dołączenie aktualnego tokenu przed wysłaniem żądania.
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  const userId = getTokenUserId(token);

  // Nie ponawiamy żądania poprzedniego użytkownika
  // po wylogowaniu lub zmianie konta.
  if (config._retry && config._authUserId !== userId) {
    throw new axios.CanceledError("Sesja użytkownika zmieniła się.");
  }

  config._authUserId = userId;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

// Jedna próba ponowienia żądania po odpowiedzi 401.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;

    if (!request || error.response?.status !== 401) {
      throw error;
    }

    // Błędne logowanie nie powinno uruchamiać refreshu.
    // Nie ponawiamy też żądania drugi raz.
    if (isAuthEndpoint(request.url) || request._retry) {
      throw error;
    }

    const currentToken = getAccessToken();
    const currentUserId = getTokenUserId(currentToken);

    if (request._authUserId !== currentUserId) {
      throw new axios.CanceledError("Sesja użytkownika zmieniła się.");
    }

    request._retry = true;

    const rejectedAuthorization = request.headers.Authorization;

    // SignalR lub inne żądanie HTTP mogło już odświeżyć token.
    const wasAlreadyRefreshed =
      currentToken && rejectedAuthorization !== `Bearer ${currentToken}`;

    const token = wasAlreadyRefreshed
      ? currentToken
      : await refreshAccessToken();

    request.headers.Authorization = `Bearer ${token}`;

    return apiClient(request);
  },
);

export default apiClient;
