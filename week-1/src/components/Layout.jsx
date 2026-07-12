import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth.js";

const navLinkClass = ({ isActive }) =>
  cn(
    "select-none rounded-md px-3 py-1.5 text-sm font-medium transition-ui",
    isActive
      ? "bg-surface text-text-primary"
      : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
  );

/**
 * Shared shell for authenticated routes: header/nav on top, the active route
 * renders into <Outlet />.
 */
export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="flex select-none items-center gap-2 text-text-primary transition-ui hover:text-terracotta"
          >
            <BookOpen className="h-5 w-5 text-terracotta" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-tight sm:text-base">
              AI Prompt Journal
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="flex items-center gap-1">
              <NavLink to="/" end className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/prompts/new" className={navLinkClass}>
                New Prompt
              </NavLink>
            </nav>

            <div className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />

            <span className="hidden text-sm text-text-secondary sm:inline">
              {user?.username}
            </span>
            <Button
              type="button"
              variant="ghost"
              onClick={handleLogout}
              className="h-8 px-3 text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border py-4">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="text-center text-xs text-text-secondary">
            Week 1 — frontend fundamentals
          </p>
        </div>
      </footer>
    </div>
  );
}
