# lobatools

Interactive tools for recruiters, hiring managers and developers, live at [lobatools.com](https://lobatools.com).

The site looks like a small desktop: each tool is an app in the dock that opens as a window. On a phone, each app opens full screen at its own URL.

## What's here

| Folder | What it is | Status |
| --- | --- | --- |
| `web/` | Desktop frontend (React, Vite, TypeScript) | In progress |
| `profile/` | Profile YAML + Pydantic loader, the single source of truth every tool reads | Planned |
| `job_match/` | Flask app: paste a job description, get an honest fit result | Planned |
| `mcp/` | Read-only MCP server so AI agents can query the profile | Planned |
| `api/` | Small read-only public API + playground | Later |

## Running the frontend

Requires Node 22 and Google Chrome (Playwright runs against it).

```sh
cd web
npm install
npm run dev
```

| Command | Does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Typecheck and build to `dist/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc -b` |
| `npm test` | Playwright tests (desktop + mobile) |

CI runs lint, typecheck, build and tests on every push and pull request.

## Principles

- Engineering quality over feature count.
- Boring infrastructure: Flask, gunicorn, Docker Compose and Caddy on a single VPS. No database, Redis, Kafka or Kubernetes until there's a real reason.
- Tools only expose the slice of the profile they need, never the raw file.
