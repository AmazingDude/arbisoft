import { useContext } from "react";
import { AuthContext } from "../context/auth-context.js";

/**
 * Thin wrapper around AuthContext — same pattern as usePrompts.
 *
 * @returns {{
 *   user: { id: number, username: string, email: string, role: string } | null,
 *   token: string | null,
 *   isAuthenticated: boolean,
 *   isLoading: boolean,
 *   login: (username: string, password: string) => Promise<void>,
 *   register: (username: string, email: string, password: string) => Promise<void>,
 *   logout: () => void,
 * }}
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used within a <AuthProvider>");
  }
  return ctx;
}
