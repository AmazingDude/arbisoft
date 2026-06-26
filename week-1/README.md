# AI Prompt Journal

A small React app to journal, search, rate, and tag AI prompts.
Built for a Week 1 frontend-fundamentals assignment.

## Stack

- **React + Vite**
- **React Router** (3 routes)
- **Context API** for global state
- **Vitest + React Testing Library** for tests

## Getting started

```bash
npm install
npm run dev        # start the dev server
npm test           # watch-mode tests
npm run test:run   # single test run
```

## Routes

| Path             | View                                    |
| ---------------- | --------------------------------------- |
| `/`              | Prompt Dashboard (search + tag filter)  |
| `/prompts/new`   | New Prompt form                         |
| `/prompts/:id`   | Prompt Detail view                      |

## Project structure

```
src/
├── api/
│   └── promptApi.js        # Mock async "backend" (~500ms latency, in-memory db)
├── components/
│   ├── Layout.jsx          # Shared navbar/header + <Outlet/>
│   ├── PromptList.jsx      # Maps prompts -> PromptCard
│   ├── PromptCard.jsx      # Single prompt summary (React.memo)
│   ├── PromptForm.jsx      # Controlled form, validates title + content
│   ├── SearchBar.jsx       # Controlled search input
│   ├── TagFilter.jsx       # Toggleable tag buttons
│   └── __tests__/
│       └── PromptForm.test.jsx
├── context/
│   └── PromptContext.jsx   # Global state + CRUD (useReducer)
├── data/
│   └── seedPrompts.js      # 6 sample prompts
├── hooks/
│   └── usePrompts.js       # Wraps the context; guards usage
├── pages/
│   ├── DashboardPage.jsx   # useMemo filtering + useCallback handlers
│   ├── NewPromptPage.jsx
│   └── PromptDetailPage.jsx
├── types.js                # JSDoc Prompt typedef + PROMPT_TOOLS
├── App.jsx                 # Route table
└── main.jsx                # Providers (Router + PromptProvider)
```

## Week 2

The `src/api/promptApi.js` module is the only thing pretending to be a
network layer. Replace its method bodies with real `fetch(...)` calls and the
Context/UI above it stays the same.
