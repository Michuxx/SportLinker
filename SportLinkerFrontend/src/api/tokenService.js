import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  decodeJwtPayload,
  setTokens,
  clearTokens,
} from "../utils/tokenStorage";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5139/api";

let pendingRefresh = null;

const clearSession = () => {
  clearTokens();
  window.dispatchEvent(new CustomEvent("auth:unauthorized"));
};

export const refreshAccessToken = () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearSession();
    return Promise.reject(new Error("Brak tokenu odświeżającego."));
  }

  if (pendingRefresh?.refreshToken === refreshToken) {
    return pendingRefresh.promise;
  }

  const operation = { refreshToken, promise: null };
  pendingRefresh = operation;

  operation.promise = (async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/refreshToken`, {
        refreshToken,
      });

      // Użytkownik mógł wylogować się lub zmienić konto
      // podczas oczekiwania na odpowiedź.
      if (getRefreshToken() !== refreshToken) {
        throw new Error("Sesja zmieniła się podczas odświeżania.");
      }

      const { accessUserToken, refreshUserToken } = response.data;

      if (!accessUserToken || !refreshUserToken) {
        throw new Error("Serwer zwrócił niekompletne tokeny.");
      }

      setTokens(accessUserToken, refreshUserToken);

      window.dispatchEvent(
        new CustomEvent("auth:token-refreshed", {
          detail: { token: accessUserToken },
        }),
      );

      return accessUserToken;
    } catch (error) {
      const status = error.response?.status;

      if (
        getRefreshToken() === refreshToken &&
        (status === 401 || status === 403)
      ) {
        clearSession();
      }

      throw error;
    } finally {
      if (pendingRefresh === operation) {
        pendingRefresh = null;
      }
    }
  })();

  return operation.promise;
};

export const getValidAccessToken = async () => {
  const token = getAccessToken();

  if (!token && !getRefreshToken()) {
    return null;
  }

  const payload = decodeJwtPayload(token);

  const isValid =
    typeof payload?.exp === "number" &&
    payload.exp * 1000 > Date.now() + 30_000;

  if (isValid) {
    return token;
  }

  return refreshAccessToken();
};
