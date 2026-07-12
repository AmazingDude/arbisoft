import { apiRequest } from "./client.js";

/**
 * Real FastAPI prompt client.
 *
 * Keeps the same method surface the mock had (getAll / getById / create /
 * update / remove) so PromptContext and the UI stay unchanged. Backend JSON
 * uses snake_case + numeric ids; we map to the frontend Prompt shape here.
 */

/** Map a PromptResponse from the API into the frontend Prompt typedef. */
function fromApi(row) {
  return {
    id: String(row.id),
    title: row.title,
    content: row.content,
    tool: row.tool,
    model: row.model ?? "",
    rating: row.rating,
    tags: Array.isArray(row.tags) ? [...row.tags] : [],
    notes: row.notes ?? "",
    createdAt:
      typeof row.created_at === "string"
        ? row.created_at
        : new Date(row.created_at).toISOString(),
    userId: row.user_id,
  };
}

/** Body fields the backend create/update schemas accept. */
function toApiBody(data) {
  const body = {};
  if (data.title !== undefined) body.title = data.title;
  if (data.content !== undefined) body.content = data.content;
  if (data.tool !== undefined) body.tool = data.tool;
  if (data.model !== undefined) body.model = data.model || null;
  if (data.rating !== undefined) body.rating = Number(data.rating);
  if (data.tags !== undefined) body.tags = data.tags;
  if (data.notes !== undefined) body.notes = data.notes || null;
  return body;
}

export const promptApi = {
  /** @returns {Promise<import("../types.js").Prompt[]>} */
  async getAll(token) {
    const rows = await apiRequest("/prompts", { token });
    return rows.map(fromApi);
  },

  /** @returns {Promise<import("../types.js").Prompt>} */
  async getById(token, id) {
    const row = await apiRequest(`/prompts/${id}`, { token });
    return fromApi(row);
  },

  /**
   * @param {string} token
   * @param {Omit<import("../types.js").Prompt, "id" | "createdAt" | "userId">} data
   * @returns {Promise<import("../types.js").Prompt>}
   */
  async create(token, data) {
    const row = await apiRequest("/prompts", {
      method: "POST",
      token,
      body: toApiBody(data),
    });
    return fromApi(row);
  },

  /**
   * @param {string} token
   * @param {string} id
   * @param {Partial<import("../types.js").Prompt>} updates
   * @returns {Promise<import("../types.js").Prompt>}
   */
  async update(token, id, updates) {
    const row = await apiRequest(`/prompts/${id}`, {
      method: "PATCH",
      token,
      body: toApiBody(updates),
    });
    return fromApi(row);
  },

  /**
   * @param {string} token
   * @param {string} id
   * @returns {Promise<{ id: string }>}
   */
  async remove(token, id) {
    await apiRequest(`/prompts/${id}`, { method: "DELETE", token });
    return { id: String(id) };
  },
};
