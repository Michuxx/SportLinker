import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import authService from "../api/authService";
import {
  getStoredUser,
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  getUserFromToken,
} from "../utils/tokenStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getAccessToken());
  const [user, setUser] = useState(() => {
    const stored = getStoredUser();
    if (!stored) return null;
    const currentToken = stored.token || stored.accessToken || stored.accessUserToken;
    const decoded = currentToken ? getUserFromToken(currentToken) : null;
    return {
      ...stored,
      ...(decoded || {}),
      id: stored.id || decoded?.id,
      email: stored.email || decoded?.email,
      role: stored.role || decoded?.role,
    };
  });
  const [isLoading, setIsLoading] = useState(false);

  // Weryfikacja i ciche odświeżanie tokena przy starcie aplikacji
  useEffect(() => {
    const initAuth = async () => {
      const stored = getStoredUser();
      const savedToken = getAccessToken();
      const savedRefreshToken = getRefreshToken();

      if (savedToken) {
        const decodedUser = getUserFromToken(savedToken);
        if (decodedUser) {
          const merged = {
            ...stored,
            ...decodedUser,
            id: stored?.id || decodedUser.id,
            email: stored?.email || decodedUser.email,
          };
          setUser(merged);
          setToken(savedToken);
          return;
        }
      }

      // Jeśli accessToken wygasł lub nie został zdekodowany, ale mamy refreshToken:
      if (savedRefreshToken) {
        try {
          const data = await authService.refreshToken(savedRefreshToken);
          const updatedUser = setTokens(data.accessUserToken, data.refreshUserToken);
          setToken(data.accessUserToken);
          const decodedUser = getUserFromToken(data.accessUserToken);
          setUser({
            ...updatedUser,
            ...(decodedUser || {}),
            id: updatedUser.id || decodedUser?.id,
          });
          return;
        } catch {
          clearTokens();
          setToken(null);
          setUser(null);
          return;
        }
      }

      // Jeśli w localStorage jest już zapisany user z tokenem:
      if (stored && savedToken) {
        setUser(stored);
        setToken(savedToken);
        return;
      }

      if (!stored) {
        clearTokens();
        setToken(null);
        setUser(null);
      }
    };

    initAuth();
  }, []);

  // Nasłuchiwanie na zdarzenia z interceptora Axios
  useEffect(() => {
    const handleTokenRefreshed = (event) => {
      const newToken = event.detail?.token;
      if (newToken) {
        setToken(newToken);
        const decodedUser = getUserFromToken(newToken);
        const currentStored = getStoredUser();
        setUser({
          ...currentStored,
          ...(decodedUser || {}),
          id: currentStored?.id || decodedUser?.id,
        });
      }
    };

    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener("auth:token-refreshed", handleTokenRefreshed);
    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:token-refreshed", handleTokenRefreshed);
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login({ email, password });
      const updatedUser = setTokens(data.accessUserToken, data.refreshUserToken);
      setToken(data.accessUserToken);
      const decodedUser = getUserFromToken(data.accessUserToken);
      setUser({
        ...updatedUser,
        ...(decodedUser || {}),
        id: updatedUser.id || decodedUser?.id,
      });
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async ({ email, password, name }) => {
    setIsLoading(true);
    try {
      const data = await authService.register({ email, password, name });
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      register,
      logout,
    }),
    [user, token, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
