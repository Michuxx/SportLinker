import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "../utils/tokenStorage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5139/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor dołączający token JWT do każdego żądania
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// Interceptor odpowiedzi: obsługa 401 i silent refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jeśli brak odpowiedzi lub błąd inny niż 401, przekazujemy dalej
    if (!error.response || error.response.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // Endpointy, dla których nie próbujemy odświeżać tokena
    const isAuthEndpoint =
      originalRequest.url?.includes("/users/login") ||
      originalRequest.url?.includes("/users/register") ||
      originalRequest.url?.includes("/users/refreshToken");

    if (isAuthEndpoint || originalRequest._retry) {
      clearTokens();
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      return Promise.reject(error);
    }

    const currentRefreshToken = getRefreshToken();
    if (!currentRefreshToken) {
      clearTokens();
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Jeśli proces odświeżania już trwa, kolejka czeka na nowy token
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Bezpośrednie wywołanie axios, aby uniknąć pętli w interceptorze
      const response = await axios.post(`${API_BASE_URL}/users/refreshToken`, {
        refreshToken: currentRefreshToken,
      });

      const { accessUserToken, refreshUserToken } = response.data;
      setTokens(accessUserToken, refreshUserToken);

      // Powiadomienie kontekstu React o zaktualizowanym tokenie
      window.dispatchEvent(
        new CustomEvent("auth:token-refreshed", {
          detail: { token: accessUserToken },
        })
      );

      processQueue(null, accessUserToken);

      originalRequest.headers.Authorization = `Bearer ${accessUserToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearTokens();
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
