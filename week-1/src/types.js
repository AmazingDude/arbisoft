// Shared data-model definitions.
// This is a plain-JS project, so the "type" lives as a JSDoc typedef.
// It gives editor autocomplete/IntelliSense without needing TypeScript,
// and documents the shape that the Context, API, and forms all rely on.

/**
 * The set of AI tools a prompt can be associated with.
 * @typedef {"ChatGPT" | "Claude" | "Cursor" | "Codex" | "Gemini" | "Other"} PromptTool
 */

/** @type {PromptTool[]} */
export const PROMPT_TOOLS = [
  "ChatGPT",
  "Claude",
  "Cursor",
  "Codex",
  "Gemini",
  "Other",
];

/**
 * @typedef {Object} Prompt
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {PromptTool} tool
 * @property {string} model
 * @property {number} rating        // 1-5
 * @property {string[]} tags
 * @property {string} notes
 * @property {string} createdAt      // ISO string
 */

export {};
