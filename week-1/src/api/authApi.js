import { apiRequest } from "./client.js";

/**
 * Real-backend auth client (login / register / me).
 */

export const authApi = {
  async login(username, password) {
    return apiRequest("/auth/login", {
      method: "POST",
      body: { username, password },
    });
  },

  async register(username, email, password) {
    return apiRequest("/auth/register", {
      method: "POST",
      body: { username, email, password },
    });
  },

  async me(token) {
    return apiRequest("/auth/me", { token });
  },
};
