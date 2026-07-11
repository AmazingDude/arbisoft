const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

/**
 * Real-backend auth client. Prompt CRUD still uses the mock in promptApi.js;
 * only login / register / me hit FastAPI for now.
 */

async function parseError(response) {
  let detail = "Something went wrong";
  try {
    const body = await response.json();
    if (typeof body.detail === "string") {
      detail = body.detail;
    } else if (Array.isArray(body.detail) && body.detail[0]?.msg) {
      detail = body.detail[0].msg;
    }
  } catch {
    // keep default message
  }
  const error = new Error(detail);
  error.status = response.status;
  return error;
}

export const authApi = {
  async login(username, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw await parseError(response);
    return response.json();
  },

  async register(username, email, password) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) throw await parseError(response);
    return response.json();
  },

  async me(token) {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw await parseError(response);
    return response.json();
  },
};
