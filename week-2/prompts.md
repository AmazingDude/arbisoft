# Week 2: Prompts REST API (FastAPI + SQLAlchemy)

> Same rules as Week 1: log meaningful prompts, note anything I had to fix or push back on, keep steps small instead of one giant generation.

---

## Entry 1 - Week 2 kickoff notes

**Tool:** N/A (self-study, no AI prompt)  
**Goal:** Get the mental model in place before touching Week 2 code.

**Notes:**

Not tied to one prompt. Revised HTTP/REST/CRUD fundamentals and FastAPI basics on my own before starting, since I lean on AI a lot and wanted the mental model in place first.

Decided to stick with FastAPI + SQLAlchemy instead of switching to Prisma partway through, mainly because I'd already started making sense of SQLAlchemy and switching tools mid-way would've reset that, not because Prisma is worse in general.

---

## Entry 2 - FastAPI skeleton + health check

**Tool:** Cursor (Auto/Composer)  
**Goal:** Basic project structure before adding any DB or routes. Just confirm the server runs.

**Prompt used:**

Set up a FastAPI project structure (`app/main.py`, `routers/`, `models/`, `schemas/`), CORS enabled for the Week 1 Vite frontend, a `GET /health` route, `requirements.txt`. No DB or CRUD yet.

**Result:**

- Skeleton created
- `/health` returns `{"status": "ok"}`
- Confirmed working in browser and via `/docs`

**Review notes:**

Nothing to fix. Ran it myself before moving on.

---

## Entry 3 - SQLAlchemy models + relationship + .gitignore

**Tool:** Cursor (Auto/Composer)  
**Goal:** User and Prompt models with a real relationship (one-to-many), matching the Week 1 data shape. Also needed a `.gitignore` since none existed yet for this folder.

**Prompt used:**

Add User model, Prompt model matching Week 1's fields (title, content, tool, model, rating, tags, notes, created_at) plus `user_id` FK, wire up `User.prompts` / `Prompt.owner` relationship, SQLite for local dev, `.gitignore` for Python (venv, `__pycache__`, `.db` files, etc.).

**Result:**

- Models + `database.py` (engine, SessionLocal, `get_db`) added
- Tags stored as a comma-separated string rather than a separate join table
- Reasoning: Week 1 already treats tags as a flat `string[]`, no need for a full tag entity/catalog at this scale
- Tables verified created via `python -m scripts.init_db`

**Review notes:**

Read through the FK + `relationship()` / `back_populates` wiring in both model files before moving on. Wanted to actually understand this instead of trusting it blindly since it's the core ORM concept for this week.

---

## Entry 4 - Pydantic schemas + tag conversion

**Tool:** Cursor (Auto/Composer)  
**Goal:** Request/response schemas for Prompt (Create/Update/Response) with validation, plus figuring out where the tags list-to-string conversion should live.

**Prompt used:**

`PromptBase` / Create / Update / Response schemas. Title + content required and non-empty, rating 1-5, tags as `list[str]` in the API even though it's a string in the DB.

**Result:**

- Schemas added
- Tag conversion split:
  - **Read (DB to API):** `field_validator(mode="before")` on the base schema
  - **Write (API to DB):** explicit in route logic via `set_tags_list()`
- Made sense once I saw it: one validator covers create/update/response without repeating logic, but persistence-side conversion stays visible at the point it actually happens

**Review notes:**

None needed, but worth remembering why read/write aren't symmetric here if asked.

---

## Entry 5 - CRUD routes + filtering + nested user route

**Tool:** Cursor (Auto/Composer)  
**Goal:** Full CRUD for Prompt (POST / GET / GET one / PATCH / DELETE), plus two extras beyond the minimum: filtering by tool/tag on the list endpoint, and a nested `GET /users/{id}/prompts`.

**Prompt used:**

Standard CRUD set with 404 helpers, PATCH using `exclude_unset` for partial updates, tag/tool query filters on the list route.

**Result:**

- All 6 routes working
- Verified manually through `/docs` (created a user, created/edited/deleted prompts through the actual UI, not just trusting the report)

**Review notes / corrections:**

Found a real bug on my own read-through: `Prompt.tags.contains(tag)` was doing a plain substring match on the comma-separated column, so filtering by `"react"` also matched `"reactive"`. Not something the AI flagged. I caught it by thinking through what `.contains()` actually does on a raw string column. Fixed in the next entry.

---

## Entry 6 - Tag filter bug fix

**Tool:** Cursor (Auto/Composer)  
**Goal:** Fix the substring-match bug from Entry 5 so tag filtering matches whole tags only.

**Prompt used:**

Fix the tag filter to match exact tokens, not substrings, using padded-comma matching at the SQL level (`,tag,` pattern) so it stays a single WHERE clause instead of pulling everything into Python.

**Result:**

- Fixed using `func.concat(",", Prompt.tags, ",")` compared against `,{tag},`
- Manually verified: created a prompt tagged `"react"` and one tagged `"reactive"`, confirmed `GET /prompts?tag=react` only returns the first

**Review notes:**

Good example of a bug that ran fine and returned plausible-looking results. It just quietly returned wrong data for certain inputs. Glad I read the query logic instead of only testing the happy path.

---

## Entry 7 - Ruff linter setup

**Tool:** Cursor (Auto/Composer)  
**Goal:** Assignment requires a clean lint pass on the backend. Nothing was configured yet.

**Prompt used:**

Set up ruff (`requirements-dev.txt`, `pyproject.toml` config, E/F/I rules), fix all findings to zero.

**Result:**

- One real finding (not just style): an `F821` undefined-name issue in `user.py` caused by a forward type reference to `Prompt`
- Fixed with a `TYPE_CHECKING`-guarded import instead of just silencing the rule
- Lint command documented in README

**Review notes:**

Checked that the fix was a real pattern (avoiding circular imports) and not just suppressing the warning.

---

## Entry 8 - Pytest test suite

**Tool:** Cursor (Auto/Composer)  
**Goal:** Cover creation, validation, and error paths for the Prompts API, including a regression test for the Entry 6 tag bug so it can't silently come back.

**Prompt used:**

Tests for:

1. Successful create
2. Empty-title validation error
3. Out-of-range rating validation error
4. 404 on missing prompt
5. Partial update via PATCH
6. Delete + confirm 404 after
7. Regression test for tag filtering excluding `"reactive"` when filtering by `"react"`

Used a separate test DB via dependency override, not the real `prompts.db`.

**Result:**

- 7/7 passing
- In-memory SQLite with `StaticPool` for the test DB
- `get_db` overridden via `dependency_overrides`
- Fresh tables created/dropped per test
- Tag regression test specifically confirmed passing. `GET /prompts?tag=react` correctly excludes `"reactive"`

**Review notes:**

Opened the fixture file myself after. The StaticPool + dependency override pattern for swapping the DB in tests without touching route code is a genuinely reusable thing to remember, not just FastAPI-specific.
