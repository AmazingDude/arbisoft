import { seedPrompts } from "../data/seedPrompts.js";

/**
 * Fake API layer.
 *
 * Everything here pretends to be a network call: each method is async and
 * resolves after a short delay. Keeping this isolated behind a tiny module
 * means Week 2 can replace the bodies with real `fetch(...)` calls and the
 * Context/UI above it won't need to change.
 */

const LATENCY_MS = 500;

// In-memory "database". Cloned from seed so we never mutate the seed array.
let db = seedPrompts.map((p) => ({ ...p, tags: [...p.tags] }));

const delay = (ms = LATENCY_MS) => new Promise((res) => setTimeout(res, ms));

const clone = (prompt) => ({ ...prompt, tags: [...prompt.tags] });

const makeId = () =>
  `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

export const promptApi = {
  /** @returns {Promise<import("../types.js").Prompt[]>} */
  async getAll() {
    await delay();
    return db.map(clone);
  },

  /** @returns {Promise<import("../types.js").Prompt>} */
  async getById(id) {
    await delay();
    const found = db.find((p) => p.id === id);
    if (!found) throw new Error(`Prompt "${id}" not found`);
    return clone(found);
  },

  /**
   * @param {Omit<import("../types.js").Prompt, "id" | "createdAt">} data
   * @returns {Promise<import("../types.js").Prompt>}
   */
  async create(data) {
    await delay();
    const newPrompt = {
      ...data,
      tags: [...(data.tags ?? [])],
      id: makeId(),
      createdAt: new Date().toISOString(),
    };
    db = [newPrompt, ...db];
    return clone(newPrompt);
  },

  /**
   * @param {string} id
   * @param {Partial<import("../types.js").Prompt>} updates
   * @returns {Promise<import("../types.js").Prompt>}
   */
  async update(id, updates) {
    await delay();
    const idx = db.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error(`Prompt "${id}" not found`);
    const merged = {
      ...db[idx],
      ...updates,
      tags: updates.tags ? [...updates.tags] : [...db[idx].tags],
      id: db[idx].id,
      createdAt: db[idx].createdAt,
    };
    db = db.map((p) => (p.id === id ? merged : p));
    return clone(merged);
  },

  /**
   * @param {string} id
   * @returns {Promise<{ id: string }>}
   */
  async remove(id) {
    await delay();
    const exists = db.some((p) => p.id === id);
    if (!exists) throw new Error(`Prompt "${id}" not found`);
    db = db.filter((p) => p.id !== id);
    return { id };
  },
};
