import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

/**
 * Wraps authenticated app routes. Unauthenticated visitors are sent to /login;
 * while the stored token is being validated we show a quiet loading state so
 * we don't flash the login page on every reload.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-text-secondary">
        Checking session…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
