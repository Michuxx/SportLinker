import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import authService from "../api/authService";
import {
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
    const initialToken = getAccessToken();
    return initialToken ? getUserFromToken(initialToken) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Weryfikacja i ciche odświeżanie tokena przy starcie aplikacji
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = getAccessToken();
      const savedRefreshToken = getRefreshToken();

      if (savedToken) {
        const decodedUser = getUserFromToken(savedToken);
        if (decodedUser) {
          setUser(decodedUser);
          setToken(savedToken);
          return;
        }
      }

      // Jeśli accessToken wygasł lub nie istnieje, ale mamy refreshToken:
      if (savedRefreshToken) {
        try {
          const data = await authService.refreshToken(savedRefreshToken);
          setTokens(data.accessUserToken, data.refreshUserToken);
          setToken(data.accessUserToken);
          const decodedUser = getUserFromToken(data.accessUserToken);
          setUser(decodedUser);
        } catch {
          // Refresh token również wygasł lub jest nieważny
          clearTokens();
          setToken(null);
          setUser(null);
        }
      } else {
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
        setUser(decodedUser);
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
      setTokens(data.accessUserToken, data.refreshUserToken);
      setToken(data.accessUserToken);
      const decodedUser = getUserFromToken(data.accessUserToken);
      setUser(decodedUser);
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
