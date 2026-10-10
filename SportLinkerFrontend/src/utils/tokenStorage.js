const USER_STORAGE_KEY = "user";

/**
 * Pobiera obiekt usera zapisany w localStorage
 * @returns {any | null}
 */
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Zapisuje lub aktualizuje obiekt usera w localStorage
 * @param {any} userData
 * @returns {any}
 */
export const setStoredUser = (userData) => {
  if (!userData) {
    clearTokens();
    return null;
  }
  const existing = getStoredUser() || {};
  const merged = { ...existing, ...userData };
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(merged));
  // Usuwamy ewentualne stare osobne klucze
  localStorage.removeItem("sportlinker_access_token");
  localStorage.removeItem("sportlinker_refresh_token");
  return merged;
};

/**
 * Pobiera token dostępowy (access token) z obiektu usera
 * @returns {string | null}
 */
export const getAccessToken = () => {
  const user = getStoredUser();
  if (!user) return null;
  return user.token || user.accessToken || user.accessUserToken || null;
};

/**
 * Pobiera token odświeżający (refresh token) z obiektu usera
 * @returns {string | null}
 */
export const getRefreshToken = () => {
  const user = getStoredUser();
  if (!user) return null;
  return user.refreshToken || user.refreshUserToken || null;
};

/**
 * Aktualizuje tokeny w obiekcie usera w localStorage bez dodawania osobnych kluczy
 * @param {string} accessToken
 * @param {string} refreshToken
 * @returns {any}
 */
export const setTokens = (accessToken, refreshToken) => {
  const existing = getStoredUser() || {};
  const decoded = accessToken ? decodeJwtPayload(accessToken) : null;

  const updatedUser = {
    ...existing,
    id: existing.id || decoded?.id || decoded?.sub,
    email: existing.email || decoded?.email,
    role: existing.role || decoded?.role,
    token: accessToken || existing.token,
    accessToken: accessToken || existing.accessToken,
    accessUserToken: accessToken || existing.accessUserToken,
    ...(refreshToken
      ? { refreshToken, refreshUserToken: refreshToken }
      : {}),
  };

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  // Czyścimy stare osobne klucze, jeśli jeszcze wiszą w localStorage
  localStorage.removeItem("sportlinker_access_token");
  localStorage.removeItem("sportlinker_refresh_token");
  return updatedUser;
};

/**
 * Czyści usera i wszystkie tokeny z localStorage
 */
export const clearTokens = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem("sportlinker_access_token");
  localStorage.removeItem("sportlinker_refresh_token");
};

/**
 * Dekoduje payload z tokena JWT
 * @param {string} token
 * @returns {any | null}
 */
export const decodeJwtPayload = (token) => {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
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

/**
 * Wyciąga dane użytkownika z tokena JWT
 * @param {string} token
 * @returns {{ id: any, email: string, role: string } | null}
 */
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
