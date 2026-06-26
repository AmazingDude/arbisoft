import { Link, NavLink, Outlet } from "react-router-dom";

/**
 * Shared shell for every route: header/nav on top, the active route renders
 * into <Outlet />. Using a layout route keeps the navbar mounted across
 * navigations instead of re-rendering it per page.
 */
export default function Layout() {
  return (
    <div className="app">
      <header>
        <h1>
          <Link to="/">AI Prompt Journal</Link>
        </h1>
        <nav>
          <NavLink to="/">Dashboard</NavLink>
          {" | "}
          <NavLink to="/prompts/new">New Prompt</NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <small>Week 1 — frontend fundamentals</small>
      </footer>
    </div>
  );
}
