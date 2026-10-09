const ACCESS_TOKEN_KEY = "sportlinker_access_token";
const REFRESH_TOKEN_KEY = "sportlinker_refresh_token";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const setAccessToken = (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const setRefreshToken = (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token);

export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) setAccessToken(accessToken);
  if (refreshToken) setRefreshToken(refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const decodeJwtPayload = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const getUserFromToken = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  // Sprawdzenie wygaśnięcia tokena
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    return null;
  }

  return {
    id: payload.id || payload.sub,
    email: payload.email,
    role: payload.role,
  };
};
