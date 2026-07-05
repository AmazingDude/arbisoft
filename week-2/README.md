# Week 2 — Prompts API

FastAPI backend for the Prompt Library (Week 1 frontend).

## Setup

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs: http://127.0.0.1:8000/docs

## Development

Install runtime and dev dependencies:

```bash
pip install -r requirements-dev.txt
```

### Lint

```bash
ruff check app/ scripts/
```

Auto-fix import order and other safe fixes:

```bash
ruff check app/ scripts/ --fix
```

Configuration lives in `pyproject.toml` (rules: E, F, I; line length 88).

## Database

Tables are created on app startup. You can also run:

```bash
python -m scripts.init_db
```
