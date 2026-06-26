import { useContext } from "react";
import { PromptContext } from "../context/PromptContext.jsx";

/**
 * Thin wrapper around PromptContext.
 *
 * Components never touch the Context object directly — they call usePrompts().
 * Two benefits:
 *  1. A clear, single import surface (`import { usePrompts }`) for all prompt
 *     state + CRUD, so the Context internals can change freely.
 *  2. A guard that throws a helpful error if used outside <PromptProvider>,
 *     which catches a very common React mistake early.
 *
 * @returns {{
 *   prompts: import("../types.js").Prompt[],
 *   status: "idle" | "loading" | "success" | "error",
 *   error: string | null,
 *   isLoading: boolean,
 *   fetchPrompts: () => Promise<void>,
 *   addPrompt: (data: Omit<import("../types.js").Prompt, "id" | "createdAt">) => Promise<import("../types.js").Prompt>,
 *   updatePrompt: (id: string, updates: Partial<import("../types.js").Prompt>) => Promise<import("../types.js").Prompt>,
 *   removePrompt: (id: string) => Promise<void>,
 * }}
 */
export function usePrompts() {
  const ctx = useContext(PromptContext);
  if (ctx === null) {
    throw new Error("usePrompts must be used within a <PromptProvider>");
  }
  return ctx;
}
