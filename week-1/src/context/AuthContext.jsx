import { useCallback, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi.js";
import { AuthContext } from "./auth-context.js";

const TOKEN_KEY = "auth_token";

/**
 * Auth state lives here (mirrors PromptProvider): one place for token + user,
 * CRUD-style methods for login/register/logout, and a hydrate-on-mount effect
 * that restores a session from localStorage across reloads.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const persistSession = useCallback((nextToken, nextUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  // Restore session from localStorage on first load.
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const stored = localStorage.getItem(TOKEN_KEY);
      if (!stored) {
        setIsLoading(false);
        return;
      }

      try {
        const me = await authApi.me(stored);
        if (!cancelled) {
          setToken(stored);
          setUser(me);
        }
      } catch {
        if (!cancelled) clearSession();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  const login = useCallback(
    async (username, password) => {
      const { access_token } = await authApi.login(username, password);
      const me = await authApi.me(access_token);
      persistSession(access_token, me);
    },
    [persistSession]
  );

  const register = useCallback(
    async (username, email, password) => {
      await authApi.register(username, email, password);
      // Auto-login after a successful register so the user lands in the app.
      await login(username, password);
    },
    [login]
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

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
}
