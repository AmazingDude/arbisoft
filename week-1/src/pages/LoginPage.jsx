import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../hooks/useAuth.js";

/**
 * Login against the real FastAPI backend (POST /auth/login).
 */
export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const validate = () => {
    const next = {};
    if (!username.trim()) next.username = "Username is required";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    try {
      setSubmitting(true);
      await login(username.trim(), password);
      navigate("/", { replace: true });
    } catch (err) {
      setFormError(err.message || "Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <BookOpen className="mb-3 h-8 w-8 text-terracotta" aria-hidden="true" />
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            Sign in
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Access your AI Prompt Journal
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6 rounded-lg border border-border bg-surface p-6"
        >
          {formError && (
            <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {formError}
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="username" className="mb-2 block">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-invalid={Boolean(errors.username)}
            />
            {errors.username && (
              <p role="alert" className="text-sm text-destructive">
                {errors.username}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="mb-2 block">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && (
              <p role="alert" className="text-sm text-destructive">
                {errors.password}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          No account?{" "}
          <Link
            to="/register"
            className="font-medium text-terracotta transition-ui hover:underline"
          >
            Create one
          </Link>
        </p>
      </main>
    </div>
  );
}
