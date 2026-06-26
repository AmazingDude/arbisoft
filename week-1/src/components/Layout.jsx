import { Link, NavLink, Outlet } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinkClass = ({ isActive }) =>
  cn(
    "rounded-md px-3 py-1.5 text-sm font-medium transition-ui",
    isActive
      ? "bg-surface text-text-primary"
      : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
  );

/**
 * Shared shell for every route: header/nav on top, the active route renders
 * into <Outlet />. Using a layout route keeps the navbar mounted across
 * navigations instead of re-rendering it per page.
 */
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-text-primary transition-ui hover:text-terracotta"
          >
            <BookOpen className="h-5 w-5 text-terracotta" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-tight sm:text-base">
              AI Prompt Journal
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/prompts/new" className={navLinkClass}>
              New Prompt
            </NavLink>
          </nav>
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
