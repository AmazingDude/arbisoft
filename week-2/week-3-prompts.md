---

# Week 3: Auth, RBAC, Integration & Testing

> Continuing from Week 2. Same rules, log the prompts that actually changed something, note what I caught or fixed myself, keep it in small steps instead of one giant generation. Numbering continues from wherever Week 2 left off, renumber to fit.

Before writing any code this week I went through auth fundamentals on my own first (sessions vs tokens, JWT structure, password hashing, RBAC, CORS/cookies) since a lot of this was new to me and I wanted the mental model in place before building it.

---

## 1. Password hashing + registration
**Tool:** Cursor (Auto/Composer)
**Goal:** Get password hashing and a register route working before touching login/JWT.

**Prompt used:**
```
Add authentication groundwork to the Week 2 FastAPI backend.

1. Add a hashed_password field to the User model (String column). Don't store plaintext passwords anywhere, not even temporarily in memory beyond the request.

2. Add password hashing using passlib with bcrypt (or argon2 if you prefer, explain which you choose and why). Create two helper functions: hash_password(plain: str) -> str and verify_password(plain: str, hashed: str) -> bool.

3. Add a UserCreate schema (username, email, password) for registration, separate from UserResponse (which should NEVER include the password or hash).

4. Add a POST /auth/register route: takes UserCreate, hashes the password, creates the User, returns UserResponse (no password field).

Don't add login or JWT yet, just registration and the hashing utilities. Add requirements (passlib[bcrypt] or similar) to requirements.txt.

After implementing, register a test user through /docs and confirm the response never leaks the password or hash.
```

**Result:** Went with bcrypt over argon2 since it's the more common default in passlib and needs no extra native package. Had to pin bcrypt below 4.1 since passlib hasn't kept up with newer bcrypt releases and breaks otherwise. Registration works, response never includes the password or hash, duplicate username/email returns 409.

---

## 2. Fix: password leaking in validation errors
**Tool:** Cursor (Auto/Composer)
**Goal:** Before moving to login, got entry 1's work reviewed for security issues since password handling is the one place mistakes actually matter. Found something real: FastAPI's default 422 validation errors were echoing the raw plaintext password back in the response body if another field failed (like a missing email).

**Prompt used:**
```
Fix the plaintext password leak in validation errors: change the password field in UserCreate from str to Pydantic's SecretStr, so FastAPI's 422 error responses don't echo the raw password back in the input field.

Also add basic password validation while we're in here: min_length=8 on the password field, since empty passwords currently succeed.

Note: since password is now SecretStr, the register route will need to call .get_secret_value() when passing it to hash_password(). Make sure that still works and the 7 existing tests still pass, plus confirm a 422 no longer echoes the password (test by submitting an invalid request, e.g. missing email, and checking the response body doesn't contain the raw password value).
```

**Result:** SecretStr alone didn't fully fix it, still had to add a custom validation error handler that strips the input field from all 422 responses, since Pydantic/FastAPI's default behavior echoes it regardless of field type. Also added min_length=8. Good reminder that "it works" and "it's safe" aren't the same check, and a first fix isn't always the full fix.

---

## 3. Login + JWT issuance
**Tool:** Cursor (Auto/Composer)
**Goal:** Add a login route that verifies credentials and returns a JWT, plus a dependency to decode tokens on protected routes later.

**Prompt used:**
```
Add login and JWT issuance to the Week 2 FastAPI backend, building on the registration/hashing from the previous step.

1. Add python-jose (or pyjwt, your call, explain which) to requirements.txt for encoding/decoding JWTs.
2. Add JWT config: a SECRET_KEY (load from an environment variable, with a clearly-marked insecure default for local dev only), algorithm (HS256), and token expiry (e.g. 30 minutes).
3. Add a create_access_token(data: dict) function in app/security.py that encodes a JWT containing the user's id and username, with an expiry claim.
4. Add a POST /auth/login route: takes username + password (a form or a simple JSON schema, your call), looks up the user, verifies the password with verify_password(), returns a JWT access token on success, 401 on invalid credentials.
5. Add a get_current_user dependency that extracts the JWT from the Authorization header, decodes and validates it (checking expiry and signature), fetches the corresponding User from the DB, and raises 401 if the token is missing, invalid, or expired.

Don't protect any existing routes yet, just add login and the reusable dependency.

After implementing: register a user, log in with correct credentials and confirm you get a token, log in with wrong credentials and confirm 401, and decode the returned token to confirm it contains the expected claims.
```

**Result:** Went with PyJWT over python-jose since it's more actively maintained. Login works, wrong credentials give a generic 401 so you can't tell if it's the username or password that's wrong. Actually decoded a returned token myself and checked the payload, it has sub (user id, stored as a string per JWT convention), username, and exp. Seeing the actual decoded payload made the header/payload/signature idea click way more than just reading about it.

---

## 4. RBAC + protecting routes
**Tool:** Cursor (Auto/Composer)
**Goal:** Actually require auth on the prompt routes, and add a role-based rule (assignment requires at least one).

**Prompt used:**
```
Wire authentication and a role-based rule into the Week 2/3 FastAPI backend, using the existing get_current_user dependency.

1. Add a GET /auth/me route that returns the current authenticated user (via Depends(get_current_user)), using UserResponse. This is mainly so I can manually test that a valid token resolves to the right user, and an invalid/missing token returns 401.

2. Add a role field to the User model (String, default "user"). Since we already have prompts.db from before, note whether this needs a fresh DB (drop/recreate is fine for local dev, same as last time) or an ALTER-style migration, explain the tradeoff briefly.

3. Protect the Prompt CRUD routes with authentication:
   - POST /prompts should use the current authenticated user as the owner (stop taking user_id as a query param, derive it from the token instead)
   - PATCH /prompts/{id} and DELETE /prompts/{id} should only succeed if the current user owns the prompt (403 if a different user tries), OR if the current user has the admin role (admins can edit/delete any prompt), this is the RBAC rule
   - GET /prompts and GET /prompts/{id} can stay open for now

4. Update existing tests to include auth: register/login a user, get a token, pass it via the Authorization header on requests that now require it. Add at least one new test specifically for the RBAC rule.

Report the full updated route list, confirm all tests pass, and manually verify the auth + RBAC behavior described.
```

**Result:** Route is fully protected now, POST/PATCH/DELETE all check the token, PATCH/DELETE specifically check ownership or admin role, 403 otherwise. Went with drop and recreate for the role column since it's local dev data, more on this below, since it came up again properly with Alembic.

---

## 5. Fix: prompts were readable by anyone
**Tool:** Cursor (Auto/Composer)
**Goal:** Realized after RBAC was working that reads (GET /prompts, GET /prompts/{id}) were still completely open, since entry 4 only locked down write actions.

I caught this one myself, not from a report, just thinking through the RBAC rule and realizing GET was never touched. For something that's supposed to be a personal prompt journal, letting anyone read anyone else's prompts by guessing an id is a real problem, not a nitpick.

**Prompt used:**
```
Tighten read access on the Prompt routes. Currently GET /prompts and GET /prompts/{id} are fully open, meaning any user can read any other user's prompts. Fix this:

1. GET /prompts/{id} - require authentication. Return 403 if the requesting user is neither the owner nor an admin.
2. GET /prompts - require authentication. Non-admin users should only see their OWN prompts. Admins should see all prompts, existing tool/tag filters should still work on top of this.
3. GET /users/{user_id}/prompts - require authentication, only the user themselves or an admin can view this.

Update tests accordingly and report the full updated route/auth table.
```

**Result:** Fixed, added tests for it. Same category of bug as the tag filter thing from week 2, something that runs fine and looks correct until you actually think through who's allowed to call it.

---

## 6. Setting up Alembic
**Tool:** Cursor (Auto/Composer)
**Goal:** Stop hand recreating the sqlite db every time a model changes. Came up because my mentor asked me directly what you do if you write a wrong migration, and I realized I didn't have real migrations at all, just create_all().

**Prompt used:**
```
Set up Alembic for schema migrations in the Week 2/3 FastAPI backend, since we've been hand-recreating the SQLite DB on every model change and my mentor specifically asked about proper migration practice.

1. Initialize Alembic in the project, configure it to use the existing SQLAlchemy Base/models and the SQLite DB URL from app/database.py.
2. Generate an initial migration that reflects the CURRENT state of the models as if this were the first migration, since there's no real migration history yet, this becomes migration #1.
3. If prompts.db already exists locally with data I want to keep, explain how to either stamp it as already at this migration or start fresh, my choice.
4. Show me the commands to generate a new migration in the future when I change a model.

Explain clearly: what alembic upgrade and alembic downgrade actually do, and why a bad migration gets fixed with a NEW migration rather than editing or deleting the old one, tie this back to a concrete example using this project.
```

**Result:** Alembic is in, app no longer calls create_all on startup. Stamped my existing db as already at head since I wanted to keep my test data. The explanation of why you never edit a shipped migration finally made my answer to my mentor click properly, once a migration's been applied anywhere, editing it silently desyncs everyone who already ran it, the fix is always a new migration.

---

## 7. Admin bootstrap script + manual RBAC test
**Tool:** Cursor (Auto/Composer)
**Goal:** Wanted to actually see the RBAC rule work with my own hands, not just trust the automated tests. Realized there was no way to become an admin though, since letting a user self-promote through the API would defeat the whole point of RBAC.

**Prompt used:**
```
I want to manually test the RBAC rule end-to-end, but there's currently no way to create an admin user, registration always sets role="user" (correctly, since letting users self-assign roles would break the whole point of RBAC).

1. Add a small one-off script (scripts/make_admin.py) that takes a username as an argument and sets that user's role to "admin" directly in the database. This is a manual bootstrap tool, not an API route, exactly because promoting yourself via an API would be a security hole.

2. Explain briefly in the script's docstring why this is a script and not an endpoint.

Don't add a promote-to-admin API route for now, out of scope for this assignment.
```

**Result:** Script works. Manually tested it: registered two users, made one an admin via the script, had the admin edit/delete the other user's prompt (worked), tried the same as a third regular user (got 403). Also learned something not obvious going in, a user's existing JWT doesn't pick up a role change until they log in again, since the role is baked into the token at issuance, not looked up fresh every request.

---

## 8. Wiring the frontend to real auth
**Tool:** Cursor (Auto/Composer)
**Goal:** Get the Week 1 frontend actually talking to the real backend, starting with auth only, not touching prompt CRUD yet.

**Prompt used:**
```
Wire the Week 1 React frontend (currently using a mock API) to the real Week 2/3 FastAPI backend for AUTH ONLY in this step. Don't touch prompt CRUD yet.

1. Add a login page/form calling POST /auth/login, storing the returned JWT (auth context/hook, similar pattern to usePrompts, token in memory + localStorage for persistence across reloads).
2. Add a register page/form calling POST /auth/register.
3. Add an AuthContext (mirroring PromptContext's pattern) exposing: current user, login(), register(), logout(), isAuthenticated.
4. Protect the existing routes so they redirect to /login if not authenticated.
5. Handle login/register errors with visible error states matching existing form error patterns.

Don't change promptApi.js or usePrompts yet, that's the next step.
```

**Result:** Works end to end, register, get redirected to the dashboard, refresh and stay logged in, log out and get bounced to login, bad login shows an error. First time any part of the frontend touched a real network request instead of the week 1 mock delay.

---

## 9. Wiring the real CRUD, removing the mock
**Tool:** Cursor (Auto/Composer)
**Goal:** Replace promptApi.js's mock functions with real fetch calls, attach the JWT, remove the seed data since prompts now come from the actual database.

**Prompt used:**
```
Wire the real Prompt CRUD to the FastAPI backend, replacing the mock functions in promptApi.js.

1. Rewrite promptApi.js to make real fetch calls (GET/POST/PATCH/DELETE), attaching the JWT as a Bearer token on every request.
2. Remove remaining references to the old mock user_id, the backend now derives ownership from the token.
3. Handle real error cases the mock never had: network failure, 401 (should log out and redirect to /login), 403, 404, 500. Reuse existing loading/error UI patterns.
4. Remove the seed/mock data import.

Confirm end-to-end manually: register, create a prompt, see it in the dashboard, edit it, delete it, log out, log back in and confirm prompts persist since it's a real db now.
```

**Result:** Fully working, created a prompt, saw it in the dashboard, edited it, deleted it, logged out and back in and confirmed things persist.

---

## 10. Fix: stale session race condition
**Tool:** Cursor (Auto/Composer)
**Goal:** Asked for a security review after entry 9 since it was a bigger change. It found a real race condition on its own: if you logged out and back in quickly, an in-flight request from the old session could land after the new one started and briefly show the wrong user's data.

**Result:** Fixed by ignoring responses if the session/token changed while a request was still in flight. Wouldn't have thought to test for this myself, this is the kind of bug that only shows up with a real network involved, the week 1 mock's fixed delay never could have surfaced it.

---

## 11. Small UX fixes
**Tool:** Cursor (Auto/Composer)
**Goal:** A few things that came up while actually using the app: cursor wasn't a pointer on some buttons, clicking a prompt row only worked if you hit the title exactly, and there was no way to tell when a prompt was saved.

**Result:** Made the whole row clickable instead of just the title, bigger hit target, especially on mobile. Made sure the delete button doesn't also trigger navigation, needed an actual structural fix, moving delete outside the row's link wrapper as a sibling instead of relying only on stopPropagation, since the two were fighting each other. Added cursor-pointer across all interactive elements. Added created-at dates to the list (relative, like "2d ago") and the full date on the detail page.

---

## 12. Edit prompt feature
**Tool:** Cursor (Auto/Composer)
**Goal:** Realized the backend already supported PATCH but the frontend never exposed a way to actually edit a prompt.

**Prompt used:**
```
Add prompt editing to the frontend, using the existing PATCH /prompts/{id} endpoint.

1. Reuse PromptForm for both create and edit, add an optional initialData prop, pre-fill fields, change submit text to "Save changes".
2. Add an Edit button on the detail page, navigating to /prompts/:id/edit.
3. Add an EditPromptPage that loads the existing prompt, renders PromptForm with initialData, calls the update function on submit.
4. Reuse existing validation, loading, and error-state patterns.

Confirm manually: edit an existing prompt's title and tags, save, confirm changes show up on both the detail view and dashboard.
```

**Result:** Works, pre-fills the form, saves changes, reflects on both the detail view and dashboard list.

---

## 13. Integration test
**Tool:** Cursor (Auto/Composer)
**Goal:** Assignment requires at least one integration test covering the full happy path end to end, not just isolated unit tests.

**Prompt used:**
```
Add one integration test to the backend test suite that exercises the full happy path in a single test, register -> login -> create a prompt -> read it back -> update it -> delete it, all as one connected user journey, not separate isolated tests like the existing ones.

1. Register a new user
2. Log in, capture the JWT
3. Create a prompt using that token
4. Fetch it back, confirm the data matches
5. Update it, confirm the change persisted
6. Delete it, confirm a subsequent GET returns 404

This should be ONE test function representing a realistic user session, name it clearly (e.g. test_full_user_journey_integration).
```

**Result:** Passes, and it also naturally re-checks that the registration response never leaks the password, since that assertion is part of the same chain. All existing tests plus this one pass together.

---

That's Week 3 done: JWT auth, one RBAC rule (owner or admin), real frontend to backend connection with full CRUD and login, well over the required 5 API tests, and the integration test above. Caught two real bugs myself along the way (the cross-user read leak and the logout race condition) rather than just accepting whatever got generated.
