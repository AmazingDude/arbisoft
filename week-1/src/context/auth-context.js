import { createContext } from "react";

/**
 * Separated from the provider component so the provider file only exports a
 * React component — keeps React Fast Refresh (and eslint-plugin-react-refresh)
 * happy. Consumers should use the `useAuth` hook rather than this directly.
 * @type {import("react").Context<null | object>}
 */
export const AuthContext = createContext(null);
