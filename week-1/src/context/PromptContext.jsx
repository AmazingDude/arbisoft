import { useCallback, useEffect, useReducer, useRef } from "react";
import { promptApi } from "../api/promptApi.js";
import { useAuth } from "../hooks/useAuth.js";
import { PromptContext } from "./prompt-context.js";

/**
 * Why a Context + reducer here:
 * - Prompt state is global (dashboard, detail, form all read/write it), so it
 *   lives in one place instead of being prop-drilled or re-fetched per route.
 * - A reducer keeps the async lifecycle (loading/error/success) explicit and
 *   predictable: every transition is a named action, which is easy to test.
 * - CRUD methods are wrapped in useCallback so their identity is stable. That
 *   matters because they get passed down to memoized children (PromptCard).
 *
 * Network work is delegated to promptApi (real FastAPI). Auth token comes from
 * AuthContext; ownership is derived server-side from the JWT (no user_id).
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
    case "RESET":
      return { ...initialState };
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

export function PromptProvider({ children }) {
  const { token, isAuthenticated, logout } = useAuth();
  const [state, dispatch] = useReducer(promptReducer, initialState);
  // Ignore stale responses after logout / user switch on a shared browser.
  const tokenRef = useRef(token);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const handleAuthFailure = useCallback(
    (err) => {
      if (err?.status === 401) {
        logout();
      }
    },
    [logout]
  );

  const isCurrentSession = useCallback(
    (requestToken) => Boolean(requestToken) && tokenRef.current === requestToken,
    []
  );

  // Fetch only when logged in; clear list on logout so the next user
  // never sees a previous session's prompts in memory.
  useEffect(() => {
    if (!isAuthenticated || !token) {
      dispatch({ type: "RESET" });
      return undefined;
    }

    let cancelled = false;
    const requestToken = token;
    dispatch({ type: "FETCH_START" });

    (async () => {
      try {
        const data = await promptApi.getAll(requestToken);
        if (cancelled || tokenRef.current !== requestToken) return;
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        if (cancelled || tokenRef.current !== requestToken) return;
        handleAuthFailure(err);
        dispatch({ type: "FETCH_ERROR", error: err.message });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token, handleAuthFailure]);

  const fetchPrompts = useCallback(async () => {
    const requestToken = tokenRef.current;
    if (!requestToken) return;
    dispatch({ type: "FETCH_START" });
    try {
      const data = await promptApi.getAll(requestToken);
      if (!isCurrentSession(requestToken)) return;
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      if (!isCurrentSession(requestToken)) return;
      handleAuthFailure(err);
      dispatch({ type: "FETCH_ERROR", error: err.message });
    }
  }, [handleAuthFailure, isCurrentSession]);

  const addPrompt = useCallback(
    async (data) => {
      const requestToken = tokenRef.current;
      if (!requestToken) {
        throw new Error("Not authenticated");
      }
      try {
        const created = await promptApi.create(requestToken, data);
        if (isCurrentSession(requestToken)) {
          dispatch({ type: "ADD", payload: created });
        }
        return created;
      } catch (err) {
        if (isCurrentSession(requestToken)) {
          handleAuthFailure(err);
        }
        throw err;
      }
    },
    [handleAuthFailure, isCurrentSession]
  );

  const updatePrompt = useCallback(
    async (id, updates) => {
      const requestToken = tokenRef.current;
      if (!requestToken) {
        throw new Error("Not authenticated");
      }
      try {
        const updated = await promptApi.update(requestToken, id, updates);
        if (isCurrentSession(requestToken)) {
          dispatch({ type: "UPDATE", payload: updated });
        }
        return updated;
      } catch (err) {
        if (isCurrentSession(requestToken)) {
          handleAuthFailure(err);
        }
        throw err;
      }
    },
    [handleAuthFailure, isCurrentSession]
  );

  const removePrompt = useCallback(
    async (id) => {
      const requestToken = tokenRef.current;
      if (!requestToken) {
        throw new Error("Not authenticated");
      }
      try {
        await promptApi.remove(requestToken, id);
        if (isCurrentSession(requestToken)) {
          dispatch({ type: "REMOVE", id });
        }
      } catch (err) {
        if (isCurrentSession(requestToken)) {
          handleAuthFailure(err);
        }
        throw err;
      }
    },
    [handleAuthFailure, isCurrentSession]
  );

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
