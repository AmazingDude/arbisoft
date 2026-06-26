import { createContext, useCallback, useEffect, useReducer } from "react";
import { promptApi } from "../api/promptApi.js";

/**
 * Why a Context + reducer here:
 * - Prompt state is global (dashboard, detail, form all read/write it), so it
 *   lives in one place instead of being prop-drilled or re-fetched per route.
 * - A reducer keeps the async lifecycle (loading/error/success) explicit and
 *   predictable: every transition is a named action, which is easy to test.
 * - CRUD methods are wrapped in useCallback so their identity is stable. That
 *   matters because they get passed down to memoized children (PromptCard).
 *
 * The actual "network" work is delegated to promptApi (the mock). This file
 * only cares about state transitions, so swapping in a real backend later is
 * a one-file change.
 */

const initialState = {
  prompts: [],
  status: "idle", // "idle" | "loading" | "success" | "error"
  error: null,
};

function promptReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, status: "loading", error: null };
    case "FETCH_SUCCESS":
      return { ...state, status: "success", prompts: action.payload };
    case "FETCH_ERROR":
      return { ...state, status: "error", error: action.error };
    case "ADD":
      return { ...state, prompts: [action.payload, ...state.prompts] };
    case "UPDATE":
      return {
        ...state,
        prompts: state.prompts.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case "REMOVE":
      return {
        ...state,
        prompts: state.prompts.filter((p) => p.id !== action.id),
      };
    default:
      return state;
  }
}

export const PromptContext = createContext(null);

export function PromptProvider({ children }) {
  const [state, dispatch] = useReducer(promptReducer, initialState);

  // Mock async "fetch" — simulates hitting an API on mount and exposes
  // loading/error/success via state.status.
  const fetchPrompts = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const data = await promptApi.getAll();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", error: err.message });
    }
  }, []);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const addPrompt = useCallback(async (data) => {
    const created = await promptApi.create(data);
    dispatch({ type: "ADD", payload: created });
    return created;
  }, []);

  const updatePrompt = useCallback(async (id, updates) => {
    const updated = await promptApi.update(id, updates);
    dispatch({ type: "UPDATE", payload: updated });
    return updated;
  }, []);

  const removePrompt = useCallback(async (id) => {
    await promptApi.remove(id);
    dispatch({ type: "REMOVE", id });
  }, []);

  const value = {
    prompts: state.prompts,
    status: state.status,
    error: state.error,
    isLoading: state.status === "loading",
    fetchPrompts,
    addPrompt,
    updatePrompt,
    removePrompt,
  };

  return (
    <PromptContext.Provider value={value}>{children}</PromptContext.Provider>
  );
}
