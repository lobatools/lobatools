---
name: web
description: Conventions for the lobatools desktop frontend in web/ (React 18 + Vite + TypeScript + CSS Modules). Use for ANY work in web/ — adding or changing components, tools/apps, styling, colours, notes, settings, window/dock behaviour, Playwright tests, lint or CI.
---

# web/ — frontend conventions

React 18 + Vite + TypeScript + CSS Modules. These are design-pattern rules, not preferences — follow them and keep them consistent. (The project `.claude/CLAUDE.md` still applies: no explanatory comments, reuse existing code, strong typing, PT-BR for any Portuguese strings.)

## Folder layout — group by concern, never by "it looks like the OS"

```
src/
  main.tsx  App.tsx  meta.ts  types.ts   # entry, build metadata, shared types
  styles/global.css                      # palette tokens + global utilities
  shell/     # the OS chrome / visual frame: Desktop, MobileShell, MenuBar, Dock, Window
  system/    # state, no visuals: WindowManager (reducer), SettingsContext
  hooks/     # reusable behaviour, no CSS: useDrag, useResize, useClock, useIsPortrait, useHashRoute
  ui/        # shared visual primitives: BrandMark, AppIcon, TextFile (monospace .txt layout)
  apps/      # what runs inside windows
    registry.tsx   # the app list (single source of truth for apps)
    roadmap.ts     # coming-soon checklists (shared tasks by reference, done flags)
    tools/         # one component per tool: Welcome, ComingSoon, Readme, WhyAWolf, Notes, Settings
```

Decide placement by what a file *is* (chrome / state / behaviour / primitive / app), not where it happens to render. `MobileShell` is chrome → `shell/`, not a "mobile" bucket.

## Components

- **`export function Component()`**, not `const Component = () => {}`. Function declarations hoist, so a file reads headline-first: main export on top, private helper components below it (see `shell/Desktop.tsx`). Use `const` arrows only for inline callbacks/hooks.
- **Flat `Component.tsx` + `Component.module.css` side by side** within a concern folder. Promote to a per-component folder with an `index.ts` barrel **only when a component needs 3+ files** (first candidate: the real Job Match tool → `apps/tools/job-match/`). Don't create `index.ts` soup for 2-file components.
- Tools receive `ToolProps` (`{ app }`) and are registered in `apps/registry.tsx`. `kind: 'file'` = a .txt on the desktop (and listed in Notes on mobile, needs an `excerpt`); `kind: 'folder'` = phone-only (Notes). Every app opens from `#<app-id>` via `useHashRoute`.

## Styling & palette

- CSS Modules per component. **Colours come only from CSS variables in `styles/global.css` — never hard-code a hex in a component.** No cream/beige backgrounds.
- Tokens: `--ink #17171A` (text/toggles/secondary) · `--paper #FFFFFF` (windows) · `--mist #F1F2F4` (title bars/surfaces) · `--postit #FFE066` · `--accent #EC6B43` (logo, app icons, the one main action per screen, small highlights — an accent, never a background; **small text on orange must be ink**) · `--hand #EC6B43` (Caveat handwriting) · wallpaper `--wall-*` (default Aubergine).
- **Notes = white ruled notebook paper**: use the global `.notepaper` + `.notetape` classes (ruled lines, orange margin, tape, soft shadow), slight rotation, handwriting in `--hand`. When "Calm things down" (reduce motion) is on, flatten the rotation (inline `transform: rotate(0)`).
- Fonts: Hanken Grotesk (UI) + Caveat (handwriting) from Google Fonts; `ui-monospace` stack for code/`readme`.
- App tiles render via `ui/AppIcon` (self-coloured SVG tiles); the wolf mark via `ui/BrandMark`.

## State & data

- Window state lives in `system/WindowManager` (reducer + context). Settings in `system/SettingsContext` (persisted to localStorage, applied via `data-wallpaper` / `data-reduce-motion` on `<html>`).
- The app list is `apps/registry.tsx`; coming-soon checklists are `apps/roadmap.ts` (define a shared task object once and reuse it across apps by reference so ticking it updates every note).

## Tests, lint & CI

- **Tests:** Playwright, split into `desktop` / `mobile` projects. Target by **role/text**, not CSS-module class names or file paths. Runs against **Google Chrome** (`channel: 'chrome'`) because Chromium won't install on this macOS 13 arm64 machine (CI installs Chrome on Ubuntu). `npm test`. Add/adjust a test for any new behaviour.
- **Lint & types:** `npm run lint` (ESLint flat config, `eslint.config.js`) and `npm run typecheck` (`tsc -b`). No hard-coded colours, no unused vars (prefix intentionally-unused args with `_`). Keep lint at 0 errors; the 2 react-refresh warnings on the context files are an accepted provider+hook pattern.
- **CI:** `.github/workflows/ci.yml` runs on every push and PR — `npm ci` → lint → typecheck → build → Playwright tests. All must pass; don't merge red.
