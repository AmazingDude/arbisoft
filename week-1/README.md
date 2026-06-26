# AI Prompt Journal

A small React app to journal, search, rate, and tag AI prompts.
Built for a Week 1 frontend-fundamentals assignment.

## Stack

- **React + Vite**
- **React Router** (3 routes)
- **Context API** for global state (`useReducer` + a `usePrompts` hook)
- **Tailwind CSS v4** with a custom "Warm Espresso" theme
- **shadcn/ui-style primitives** (`Button`, `Input`, `Textarea`, `Label`) + **lucide-react** icons
- **Vitest + React Testing Library** for tests
- **ESLint** (flat config) for linting

## Getting started

```bash
npm install
npm run dev        # start the dev server
npm run lint       # lint the project (eslint .)
npm test           # watch-mode tests
npm run test:run   # single test run
npm run build      # production build
npm run preview    # preview the production build
```

## Routes

| Path           | View                                   |
| -------------- | -------------------------------------- |
| `/`            | Prompt Dashboard (search + tag filter) |
| `/prompts/new` | New Prompt form                        |
| `/prompts/:id` | Prompt Detail view                     |

## Project structure

```
src/
├── api/
│   └── promptApi.js          # Mock async "backend" (~500ms latency, in-memory db)
├── components/
│   ├── ui/                   # shadcn-style primitives
│   │   ├── button.jsx        # Button component
│   │   ├── button-variants.js# cva variants (kept separate for Fast Refresh)
│   │   ├── input.jsx
│   │   ├── textarea.jsx
│   │   └── label.jsx
│   ├── Layout.jsx            # Shared navbar/header + <Outlet/>
│   ├── PromptList.jsx        # Maps prompts -> PromptCard
│   ├── PromptCard.jsx        # Single dense list row (React.memo) w/ content preview
│   ├── PromptForm.jsx        # Controlled form, validates title + content
│   ├── SearchBar.jsx         # Controlled search input
│   ├── TagFilter.jsx         # Toggleable tag chips
│   ├── ToolDot.jsx           # 8px tool identity color dot
│   ├── StarRating.jsx        # Amber star rating display
│   ├── PromptCodeBlock.jsx   # Monospace code-block for prompt content
│   └── __tests__/
│       ├── PromptForm.test.jsx
│       └── PromptCard.test.jsx
├── context/
│   ├── prompt-context.js     # The Context object (separate file for Fast Refresh)
│   └── PromptContext.jsx     # PromptProvider: global state + CRUD (useReducer)
├── data/
│   └── seedPrompts.js        # 6 sample prompts
├── hooks/
│   └── usePrompts.js         # Wraps the context; guards usage
├── lib/
│   ├── utils.js              # cn() class-merge helper
│   └── toolColors.js         # Tool identity color map
├── pages/
│   ├── DashboardPage.jsx     # useMemo filtering + useCallback handlers
│   ├── NewPromptPage.jsx
│   └── PromptDetailPage.jsx
├── types.js                  # JSDoc Prompt typedef + PROMPT_TOOLS
├── index.css                 # Tailwind import + Warm Espresso theme tokens
├── App.jsx                   # Route table
└── main.jsx                  # Providers (Router + PromptProvider)
```

Root config: `vite.config.js`, `eslint.config.js`, `components.json`, `jsconfig.json`.

## Theme

The "Warm Espresso" palette and fonts (Inter for UI, IBM Plex Mono for prompt
content) are defined as Tailwind theme tokens in `src/index.css`. Tool identity
colors live in `src/lib/toolColors.js` and are reserved for the small dots next
to tool names (never for buttons, focus rings, or ratings).
