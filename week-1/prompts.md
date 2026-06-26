# Prompts Log - Week 1: AI Prompt Journal

> Log of significant AI prompts used during Week 1 (Frontend Fundamentals), per internship AI Coding Ground Rules: review AI plans before implementing, document corrections to AI output, prefer small verifiable steps.

---

## Entry 1 - Project Scaffold

**Date:** 2026-06-26
**Tool:** Cursor (Auto)
**Goal:** Scaffold the AI Prompt Journal app - routing, Context/reducer state, custom hook, mock API layer, base components.

**Prompt used:**

```
I'm building a small React app called "AI Prompt Journal" for a Week 1 frontend fundamentals assignment. Stack: React + Vite, React Router, Vitest + React Testing Library for testing, Context API for state (no Redux).

Scaffold the project structure with:

ROUTES (3):
- "/" - Prompt Dashboard (list view with search + tag filter)
- "/prompts/new" - New Prompt Form
- "/prompts/:id" - Prompt Detail view

DATA MODEL:
type Prompt = {
  id: string;
  title: string;
  content: string;
  tool: "ChatGPT" | "Claude" | "Cursor" | "Codex";
  model: string;
  rating: number;
  tags: string[];
  notes: string;
  createdAt: string;
}

COMPONENTS:
- Layout (shared nav/header across routes)
- PromptList + PromptCard
- PromptForm (controlled inputs, validation: title + content required)
- SearchBar + TagFilter

ARCHITECTURE:
- A PromptContext providing global prompt state (CRUD operations)
- A custom hook `usePrompts` that wraps the context and exposes a mock async fetch (simulate ~500ms delay, return loading/error/success states)
- Use useMemo for the filtered/searched list, useCallback for handlers passed down to PromptCard

Generate folder structure, mock seed data, Context + custom hook with full CRUD + mock async behavior, routing setup, and basic unstyled components. Explain briefly why you structured the Context/hook the way you did.
```

**Result:** Generated full folder structure (`src/api`, `context`, `hooks`, `data`, `components`, `pages`), 6-item seed data, `PromptContext` built on `useReducer` (idle/loading/success/error state machine), `usePrompts` hook wrapping the context, mock API module (`promptApi.js`) simulating network delay, 3 routes wired under a shared `Layout`, and 2 initial tests for `PromptForm`. ESLint clean, no errors.

**Review notes:** Read through `usePrompts.js`, `PromptContext.jsx`, and `promptApi.js` in full before proceeding - confirmed the reducer-based state machine and the mock-API seam (so Week 2 can swap in real `fetch` calls without touching the Context/UI layer). No corrections needed at this stage; structure matched the request.

---

## Entry 2 - Expanded Test Coverage

**Date:** 2026-06-26
**Tool:** Cursor
**Goal:** Reach 3+ unit tests (per Week 1 assignment) and cover at least 2 components (per mentor's ask) - PromptForm currently has 2 tests, PromptCard has 0.

**Prompt used:**

```
Add more test coverage to this project using Vitest + React Testing Library:

1. In PromptForm.test.jsx, add one more test case beyond the existing 2 - test that the form calls onSubmit with the correct data when all required fields are filled in validly.

2. Create a new PromptCard.test.jsx (following the same import/setup patterns as PromptForm.test.jsx) with 2 tests:
   - Renders the prompt's title, tool, and rating correctly given a sample prompt prop
   - Calls onDelete with the correct prompt id when the delete button is clicked (use vi.fn() as the mock)

Make sure all tests pass after adding these.
```

**Result:** 5 tests passing across 2 files. PromptForm now has 3 tests (added one covering full-field submission with the correct normalized payload). New PromptCard.test.jsx has 2 tests (render check + onDelete callback check).

**Review notes / corrections:**

- `PromptCard` renders a `<Link>` from react-router-dom, so the test needed `MemoryRouter` wrapped around it to provide router context - added a `renderCard` helper for this.
- The rating renders inline as `" · ★★★★"` inside one span, so an exact text match failed; switched to a regex matcher (`/★{4}/`) derived from `prompt.rating` instead of a literal string match.
- React Router v7 future-flag warnings appeared in test output - confirmed these are just deprecation notices, not actual failures.

---

## Entry 3 - Warm Espresso Styling (Tailwind + shadcn + lucide-react)

**Date:** 2026-06-26
**Tool:** GLM 5.2 for Design
**Goal:** Move from unstyled components to a finished visual design (Tailwind CSS, lucide-react icons, shadcn/ui primitives) using a "Warm Espresso" design direction: warm near-black palette, terracotta accent, monospace prompt content, per-tool color dots, no purple/glassmorphism/gradients.

**Prompt used:** Full design-token prompt specifying color tokens (background #151413, surface #1F1D1B, accent terracotta #D97757, amber #F5A524 for ratings), typography (Inter for UI, IBM Plex Mono for prompt content), a 5-tool color-dot system, Linear-style 150ms ease-out micro-interactions, explicit ban on purple/glassmorphism/gradients/blur, and Notion-style detail page layout.

**Result:** Tailwind CSS v4 set up via `@tailwindcss/vite`. shadcn/ui-style primitives added manually (Button, Input, Textarea, Label) under `src/components/ui/`. lucide-react icons added (BookOpen, Search, Trash2, ArrowLeft). New shared components: `ToolDot.jsx`, `StarRating.jsx`, `PromptCodeBlock.jsx`. All 5 tests still passing, production build succeeds.

**Review notes / corrections:** Cross-checked this output against separate feedback from ChatGPT (button contrast, hover state values, 150ms animations) - confirmed all of those were already specified in the original prompt and present in the implementation, so no rework was needed there. Decided to defer the suggested app rename (e.g. "Forge", "PromptKit") to a later, separate commit rather than mixing branding changes into the styling commit.

---

## Entry 4 - Scrollbar Layout Shift Fix

**Date:** 2026-06-26
**Tool:** GLM 5.2
**Goal:** Fix a layout shift bug where toggling a tag filter (shrinking the list below viewport height) caused the scrollbar to disappear and the content area to jump horizontally.

**Prompt used:** Add `scrollbar-gutter: stable` to reserve scrollbar space permanently, and theme the scrollbar itself (track/thumb/hover colors) to match the Warm Espresso palette instead of using the default OS scrollbar.

**Result:** `scrollbar-gutter: stable` added to `html`. Custom themed scrollbar added for both Firefox (`scrollbar-width`/`scrollbar-color`) and Chromium/Safari (`::-webkit-scrollbar`), using existing `@theme` CSS variables so it stays in sync with the design tokens. Build succeeds.

**Review notes / corrections:** None needed - confirmed the fix targets the correct scroll container (the page root, since the app currently scrolls at the `html` level, not an inner container).

---

## Entry 5 - _(next step)_

**Date:**
**Tool:**
**Goal:**
**Prompt used:**
**Result:**
**Review notes / corrections:**
