/**
 * Tool identity markers only — never used for buttons, focus rings, or ratings.
 * Chosen to be distinct from each other at 8px and to avoid the reserved
 * terracotta (#D97757) and amber (#F5A524) accent values.
 * @type {Record<import("../types.js").PromptTool, string>}
 */
export const TOOL_COLORS = {
  ChatGPT: "#22C55E",
  Claude: "#C2542E",
  Cursor: "#3B82F6",
  Codex: "#EC4899",
  Gemini: "#14B8A6",
  Other: "#9B9890",
};
