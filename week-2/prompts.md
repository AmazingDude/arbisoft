# Prompts Log - Week 1: AI Prompt Journal

> Log of significant AI prompts used during Week 1 (Frontend Fundamentals), per internship AI Coding Ground Rules: review AI plans before implementing, document corrections to AI output, prefer small verifiable steps.

---

## Entry 1 - Project Scaffold

**Date:** 2026-06-26
**Tool:** Cursor (Auto/Composer)
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

**Date:** 2026-06-26 (to be filled in after running)
**Tool:** Cursor (Auto/Composer)
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
**Tool:** GLM 5.2
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

## Entry 5 - Loading/Error State Verification

**Date:** 2026-06-26
**Tool:** GLM 5.2
**Goal:** Confirm the Dashboard and Prompt Detail pages actually show a loading state and an error/not-found state, per the Week 1 "error handling" topic, without making unnecessary changes.

**Prompt used:** Asked to check (not modify) whether both pages show a loading state during the mock fetch delay and an error/not-found state if a prompt can't be found, with instruction not to touch anything else if both already worked.

**Result:** Both already implemented correctly. Dashboard shows "Loading prompts..." during the fetch and a `role="alert"` error message if the mock API's status is "error". Prompt Detail shows "Loading..." then "Prompt not found." with a link back to the dashboard for a bad id, no crash or blank page. No code changes made.

**Review notes / corrections:** Flagged one design note (not a bug): the detail page reads from the already-loaded context list rather than calling `getById` directly, so it never surfaces a true per-prompt fetch failure, a missing id just falls through to "Prompt not found." Decided this is acceptable for now since it still satisfies "no blank page or crash"; deferred a dedicated per-prompt fetch error state as a possible Week 2 addition once a real API exists.

---

## Entry 6 - Tool Identity Color Fix

**Date:** 2026-06-26
**Tool:** GLM 5.2
**Goal:** Fix tool dot colors that were either too similar to each other (Cursor and Codex both blue) or collided with reserved accent colors (Claude reused the terracotta button color, Gemini reused the amber rating color).

**Prompt used:** Reassign all 5 tool dot colors to be mutually distinct and never match the reserved terracotta (#D97757) or amber (#F5A524) accents: ChatGPT #22C55E, Claude #C2542E, Cursor #3B82F6, Codex #EC4899, Gemini #14B8A6.

**Result:** Centralized the mapping in `src/lib/toolColors.js` as the single source of truth (`ToolDot.jsx` reads from it directly, no edit needed there). Aligned matching `--color-tool-*` CSS variables in `src/index.css`. Verified via grep that none of the 5 new tool colors match either reserved accent anywhere in `src`.

**Review notes / corrections:** None needed, fix was applied cleanly and verified against the actual codebase rather than just asserted.

---

## Entry 7 - Form Spacing & Select-None Scoping

**Date:** 2026-06-26
**Tool:** GLM 5.2
**Goal:** Fix cramped label-to-input spacing in PromptForm, and apply `select-none` only to non-editable UI chrome (never to form inputs or saved prompt content, since copying prompts back out is the app's core use case).

**Prompt used:** Add consistent ~8px gap between each form field's label and input (Title, Content, Tool, Model, Rating, Tags, Notes). Apply `select-none` to nav wordmark, nav links, button labels, and field labels only, explicitly excluding all inputs/textareas, prompt content displays, and the notes display.

**Result:** Labels were rendering `inline`, which is why `mb-2` alone wasn't creating a visible gap; fix added `block` alongside `mb-2` across all 7 labels. `select-none` applied centrally through shared primitives (`ui/button.jsx`, `ui/label.jsx`, `Layout.jsx`) rather than scattered per-component, so it can't drift out of sync later. Verified content/notes text still selectable, nav/buttons/labels are not. Build passes.

**Review notes / corrections:** None needed, scoping was correct on the first pass. Noted one item left out of scope (the detail page's "Back to dashboard" arrow link) to address as a small follow-up rather than assuming it should be included.

---

## Entry 8 - Form UX, ESLint Setup, Content Preview, Router Warnings

**Date:** 2026-06-26
**Tool:** Cursor (Auto/Composer)
**Goal:** Multiple related polish items in one pass - reduce textarea emptiness in PromptForm, fix native rating spinner styling, add a content preview to dashboard list rows, set up the missing ESLint config/script (required by the assignment but absent until now), and silence React Router v7 future-flag console warnings.

**Prompt used:** Combined prompt covering: cap Content/Notes textarea default height (~140px) with realistic placeholders; investigate rating number-input spinner styling; add a single-line truncated content preview (first ~70 chars, monospace) to each list row between the tool/meta row and tags; add ESLint config + `"lint"` script and fix all findings to zero problems; opt into `v7_startTransition`/`v7_relativeSplatPath` on the router.

**Result:** Textareas resized with placeholders added. Native spinner/select styling fixed via `color-scheme: dark` on `html` (more robust than styling `::-webkit-inner-spin-button` directly). Content preview added to `PromptCard.jsx` via a new `getContentPreview` helper. ESLint v9 installed with a flat config; `npm run lint` now passes with 0 problems. Router future flags added to both the app's `BrowserRouter` and the test file's `MemoryRouter`, console warnings gone. All 5 tests still pass, build succeeds.

**Review notes / corrections:** Reaching zero lint problems required two structural refactors, not just rule fixes - confirmed both make sense rather than accepting blindly:

- `button.jsx` was exporting a non-component (`buttonVariants`) alongside the component, which a lint rule flags; moved variants to a separate `button-variants.js` file.
- `PromptContext.jsx` was exporting both the context object and the provider component from one file, same category of issue; split the raw context into `context/prompt-context.js`.
  Both are standard React Fast Refresh-related lint rules (a file should export either only components or only non-components for HMR to work reliably) - verified this is a legitimate convention, not the AI working around the rule by disabling it.

Also corrected tool attribution on Entries 1 and 2 above: originally logged as "Claude Code", actual tool in use is Cursor's Auto/Composer mode, not Claude Code specifically.

---

## Entry 9 - Week 2 kickoff notes

Not tied to one prompt, just a note before starting: revised HTTP/REST/CRUD fundamentals and FastAPI basics on my own before touching code, since I lean on AI a lot and wanted the mental model in place first. Decided to stick with FastAPI + SQLAlchemy instead of switching to Prisma partway through, mainly because I'd already started making sense of SQLAlchemy and switching tools mid-way would've reset that, not because Prisma is worse in general.

---

# Week 2: Prompts REST API (FastAPI + SQLAlchemy)

> Same rules as Week 1: log meaningful prompts, note anything I had to fix or push back on, keep steps small instead of one giant generation.

---

## Entry 10 - FastAPI skeleton + health check

**Date:** 2026-07-04
**Tool:** Cursor (Auto/Composer)
**Goal:** Basic project structure before adding any DB or routes, just confirm the server runs.

**Prompt used:** Set up a FastAPI project structure (app/main.py, routers/, models/, schemas/), CORS enabled for the Week 1 Vite frontend, a GET /health route, requirements.txt. No DB or CRUD yet.

**Result:** Skeleton created, `/health` returns `{"status": "ok"}`, confirmed working in browser and via `/docs`.

**Review notes:** Nothing to fix, ran it myself before moving on.

---

## Entry 11 - SQLAlchemy models + relationship + .gitignore

**Date:** 2026-07-04
**Tool:** Cursor (Auto/Composer)
**Goal:** User and Prompt models with a real relationship (one-to-many), matching the Week 1 data shape. Also needed a .gitignore since none existed yet for this folder.

**Prompt used:** Add User model, Prompt model matching Week 1's fields (title, content, tool, model, rating, tags, notes, created_at) plus user_id FK, wire up User.prompts / Prompt.owner relationship, SQLite for local dev, .gitignore for Python (venv, pycache, .db files etc).

**Result:** Models + database.py (engine, SessionLocal, get_db) added. Tags stored as a comma-separated string rather than a separate join table, reasoning: Week 1 already treats tags as a flat string[], no need for a full tag entity/catalog at this scale. Tables verified created via `python -m scripts.init_db`.

**Review notes:** Read through the FK + relationship() / back_populates wiring in both model files before moving on, wanted to actually understand this instead of trusting it blindly since it's the core ORM concept for this week.

---

## Entry 12 - Pydantic schemas + tag conversion

**Date:** 2026-07-04
**Tool:** Cursor (Auto/Composer)
**Goal:** Request/response schemas for Prompt (Create/Update/Response) with validation, plus figuring out where the tags list<->string conversion should live.

**Prompt used:** PromptBase/Create/Update/Response schemas, title+content required and non-empty, rating 1-5, tags as list[str] in the API even though it's a string in the DB.

**Result:** Schemas added. Tag conversion split: read direction (DB -> API) handled by a `field_validator(mode="before")` on the base schema, write direction (API -> DB) handled explicitly in route logic via `set_tags_list()`. Made sense once I saw it: one validator covers create/update/response without repeating logic, but persistence-side conversion stays visible at the point it actually happens.

**Review notes:** None needed, but worth remembering why read/write aren't symmetric here if asked.

---

## Entry 13 - CRUD routes + filtering + nested user route

**Date:** 2026-07-04
**Tool:** Cursor (Auto/Composer)
**Goal:** Full CRUD for Prompt (POST/GET/GET one/PATCH/DELETE), plus two extras beyond the minimum: filtering by tool/tag on the list endpoint, and a nested GET /users/{id}/prompts.

**Prompt used:** Standard CRUD set with 404 helpers, PATCH using exclude_unset for partial updates, tag/tool query filters on the list route.

**Result:** All 6 routes working, verified manually through /docs (created a user, created/edited/deleted prompts through the actual UI, not just trusting the report).

**Review notes / corrections:** Found a real bug on my own read-through: `Prompt.tags.contains(tag)` was doing a plain substring match on the comma-separated column, so filtering by "react" also matched "reactive". Not something the AI flagged, I caught it by thinking through what `.contains()` actually does on a raw string column. Fixed in the next entry.

---

## Entry 14 - Tag filter bug fix

**Date:** 2026-07-05
**Tool:** Cursor (Auto/Composer)
**Goal:** Fix the substring-match bug from Entry 13 so tag filtering matches whole tags only.

**Prompt used:** Fix the tag filter to match exact tokens, not substrings, using padded-comma matching at the SQL level (",tag," pattern) so it stays a single WHERE clause instead of pulling everything into Python.

**Result:** Fixed using `func.concat(",", Prompt.tags, ",")` compared against `,{tag},`. Manually verified: created a prompt tagged "react" and one tagged "reactive", confirmed `GET /prompts?tag=react` only returns the first.

**Review notes:** Good example of a bug that ran fine and returned plausible-looking results, it just quietly returned wrong data for certain inputs. Glad I read the query logic instead of only testing the happy path.

---

## Entry 15 - Ruff linter setup

**Date:** 2026-07-05
**Tool:** Cursor (Auto/Composer)
**Goal:** Assignment requires a clean lint pass on the backend, nothing was configured yet.

**Prompt used:** Set up ruff (requirements-dev.txt, pyproject.toml config, E/F/I rules), fix all findings to zero.

**Result:** One real finding (not just style): an `F821` undefined-name issue in `user.py` caused by a forward type reference to `Prompt`, fixed with a `TYPE_CHECKING`-guarded import instead of just silencing the rule. Lint command documented in README.

**Review notes:** Checked that the fix was a real pattern (avoiding circular imports) and not just suppressing the warning.

---

## Entry 16 - Pytest test suite

**Date:** 2026-07-05
**Tool:** Cursor (Auto/Composer)
**Goal:** Cover creation, validation, and error paths for the Prompts API, including a regression test for the Entry 14 tag bug so it can't silently come back.

**Prompt used:** Tests for: successful create, empty-title validation error, out-of-range rating validation error, 404 on missing prompt, partial update via PATCH, delete + confirm 404 after, and a regression test for tag filtering excluding "reactive" when filtering by "react". Used a separate test DB via dependency override, not the real prompts.db.

**Result:** _(fill in once run: final test count and pass/fail status)_

**Review notes:** _(fill in: anything that needed fixing)_

---
