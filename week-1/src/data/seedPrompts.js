/**
 * Mock seed data used by the fake API layer (src/api/promptApi.js).
 * In Week 2 this can be swapped for a real backend without touching the UI.
 * @type {import("../types.js").Prompt[]}
 */
export const seedPrompts = [
  {
    id: "p1",
    title: "Refactor a React component",
    content:
      "You are a senior React engineer. Refactor the following component for readability and performance. Explain each change briefly:\n\n{{code}}",
    tool: "Claude",
    model: "claude-3.5-sonnet",
    rating: 5,
    tags: ["react", "refactor", "code-review"],
    notes: "Great for cleaning up legacy components. Add the file context inline.",
    createdAt: "2026-06-01T09:15:00.000Z",
  },
  {
    id: "p2",
    title: "Explain a bug from a stack trace",
    content:
      "Act as a debugging assistant. Given this stack trace and the relevant code, identify the most likely root cause and propose a minimal fix:\n\n{{stacktrace}}",
    tool: "ChatGPT",
    model: "gpt-4o",
    rating: 4,
    tags: ["debugging", "errors"],
    notes: "Works best when you paste the surrounding function too.",
    createdAt: "2026-06-03T14:42:00.000Z",
  },
  {
    id: "p3",
    title: "Generate unit tests",
    content:
      "Write thorough unit tests for the following function using Vitest. Cover edge cases and error paths:\n\n{{function}}",
    tool: "Cursor",
    model: "auto",
    rating: 5,
    tags: ["testing", "vitest", "react"],
    notes: "Pairs nicely with the refactor prompt.",
    createdAt: "2026-06-05T11:05:00.000Z",
  },
  {
    id: "p4",
    title: "Commit message from a diff",
    content:
      "Summarize the following git diff into a concise Conventional Commit message (type, scope, short description):\n\n{{diff}}",
    tool: "Codex",
    model: "code-davinci",
    rating: 3,
    tags: ["git", "productivity"],
    notes: "Decent, sometimes too verbose. Ask for one line only.",
    createdAt: "2026-06-08T18:20:00.000Z",
  },
  {
    id: "p5",
    title: "Brainstorm product names",
    content:
      "Brainstorm 20 short, brandable product names for: {{description}}. Group them by tone (playful, professional, technical).",
    tool: "Gemini",
    model: "gemini-1.5-pro",
    rating: 4,
    tags: ["brainstorming", "product", "naming"],
    notes: "Good divergent ideas. Filter heavily afterwards.",
    createdAt: "2026-06-12T08:00:00.000Z",
  },
  {
    id: "p6",
    title: "Summarize meeting notes",
    content:
      "Summarize the following raw meeting notes into: 1) key decisions, 2) action items with owners, 3) open questions.\n\n{{notes}}",
    tool: "Other",
    model: "local-llama",
    rating: 3,
    tags: ["productivity", "summarization"],
    notes: "Self-hosted model; quality varies with length.",
    createdAt: "2026-06-15T16:30:00.000Z",
  },
];
