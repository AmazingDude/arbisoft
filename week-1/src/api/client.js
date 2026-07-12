export const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
export const TOKEN_KEY = "auth_token";

const FALLBACK_BY_STATUS = {
  401: "Session expired. Please sign in again.",
  403: "You don't have permission to do that.",
  404: "Not found.",
  500: "Server error. Please try again.",
};

/**
 * Turn a FastAPI / network failure into an Error with a `.status` field
 * so callers can branch (e.g. logout on 401).
 */
export async function parseError(response) {
  let detail = FALLBACK_BY_STATUS[response.status] || "Something went wrong";
  try {
    const body = await response.json();
    if (typeof body.detail === "string") {
      detail = body.detail;
    } else if (Array.isArray(body.detail) && body.detail[0]?.msg) {
      detail = body.detail[0].msg;
    }
  } catch {
    // keep status fallback
  }
  const error = new Error(detail);
  error.status = response.status;
  return error;
}

/**
 * Authenticated JSON request helper used by auth + prompt API modules.
 *
 * @param {string} path - Absolute path on the API, e.g. "/prompts"
 * @param {{
 *   method?: string,
 *   token?: string | null,
 *   body?: unknown,
 * }} [options]
 */
export async function apiRequest(path, { method = "GET", token, body } = {}) {
  const headers = {};
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    const error = new Error("Network error. Check your connection and try again.");
    error.status = 0;
    throw error;
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
