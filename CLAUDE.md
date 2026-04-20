# CLAUDE.md

Guidance for Claude Code working in the `vp-design-system` repo.

## Project

VSee Design System — the source of truth for VSee's visual language, tokens, components, and patterns. Built as a React + React Aria documentation site that doubles as a component showcase. Published as GitHub Pages at https://yunting-vsee.github.io/Design-System/ (deployed automatically on push to `master`).

**Consumers:** Phoenix (`va-main`) is the primary downstream consumer. Future modules (Clinic, RPM, EMR) will consume the same tokens + components once this repo is extracted into a publishable package. Today it's a spec + showcase; the extraction work is tracked in Phoenix's super-app plan.

## Tech stack

- **React 19** with TypeScript
- **React Aria Components 1.16+** for accessible, unstyled primitives
- **Tailwind CSS v4** via `@tailwindcss/vite` with `@theme` token block
- **CSS custom properties** as the design-token source of truth (`src/index.css`)
- **Lucide React** for icons
- **Vite** for build tooling
- **Internationalized dates** via `@internationalized/date`

## Commands

All commands run from `design-system/`:

```bash
cd design-system
npm run dev          # Vite dev server
npm run build        # tsc + Vite production build
npm run lint         # ESLint (flat config)
npm run preview      # preview built output
```

## Architecture

**Single-file demo site.** `src/App.tsx` (~3,000 lines) holds every component demo and doc section. Helper components (`Section`, `SubSection`, `CodeBlock`, `Swatch`, `useCopyToast`) are inline. Named handler functions organise the main areas: `FoundationsColors`, `FoundationsTypography`, `FoundationsSpacing`, `ComponentsButtons`, `ComponentsForms`, `ComponentsBadges`, `ComponentsFeedback`, `ComponentsNavigation`, `ComponentsDropdowns`, `ComponentsOthers`, `ComponentsOverlays`, `PatternsLayouts`, `PatternsTheming`, `PatternsFormio`.

**Splitting into `src/components/*.tsx` is queued** for when the library becomes a consumable package. Don't split proactively unless adding a significant new component — the single-file layout is intentional while the audience is docs-site visitors, not package consumers.

**Styling**

- `src/index.css` — the `@theme` block defines ~86 tokens (brand, semantic colors, grey scale, typography size scale, spacing scale, radius scale). Add tokens here first; reference them from `App.css` or component `style={...}` props via `var(--token-name)`.
- `src/App.css` — component styling. Some selectors (`.btn`, `.input`, `.badge`) wrap React Aria renders with our visual treatment.
- **Tailwind v4** — arbitrary-value classes (e.g. `bg-[var(--brand)]`, `text-[var(--text-primary)]`) are common. Use them for one-off styling; promote to a named CSS class when a pattern repeats.

**Token naming — naked convention**

Tokens in this repo are intentionally **unprefixed** (`--brand`, `--sp-4`, `--text-h1-size`). This is the authoritative source. Downstream consumers (Phoenix) apply a prefix (`--vsee-*`) at build time per their ADR 0004. Don't prefix here — it breaks the copy-paste UX on the docs site and complicates Token Studio exports.

**Themes**

- `[data-brand-theme="ocean" | "purple"]` overrides brand-* tokens for white-label tenants (defined in `src/index.css`).
- `[data-mode="dark"]` overrides neutral/surface/text tokens. System preference detection is optional; explicit attribute wins.

## Branching

- `master` — default branch; autodeploys to GitHub Pages on push
- `font-testing` — WIP branch for font-dropdown experimentation (adds Google Fonts + i18n scaffolding)
- Feature branches: `feat/*`, fix branches: `fix/*`

## Deployment

`.github/workflows/deploy.yml` — GitHub Actions workflow mirrored from the Bitbucket repo to GitHub; on push to `master` or `main`, builds the Vite app and deploys to GitHub Pages. The workflow runs from `design-system/` (see `working-directory` in the YAML). **Don't change the trigger branches without coordinating with the design team** — breaking the deploy breaks the docs site.

## Pre-commit hooks

Managed by [lefthook](https://github.com/evilmartians/lefthook) (`lefthook.yml`). Two jobs:

| Job | What it runs | Blocks commit on |
|---|---|---|
| `security` | `gitleaks git --staged` | Detected credentials |
| `lint` | `cd design-system && npm run lint` | ESLint errors |

**First-time setup:** `npx lefthook install`. `gitleaks` is optional — if not installed, the job skips rather than failing.

## Bitbucket PR workflow

Same auth pattern as va-main:
- `BITBUCKET_EMAIL="an@vsee.com"` in `~/.zshrc`
- `BITBUCKET_API_TOKEN="ATATT..."` in `~/.zshrc`

Create PR:
```bash
curl -s -u "$BITBUCKET_EMAIL:$BITBUCKET_API_TOKEN" \
  -H "Content-Type: application/json" \
  -X POST "https://api.bitbucket.org/2.0/repositories/vsee/vp-design-system/pullrequests" \
  -d '{"title":"...", "source":{"branch":{"name":"..."}}, "destination":{"branch":{"name":"master"}}, "close_source_branch":true}'
```

## Key files

- `design-system/src/index.css` — design tokens, Tailwind theme, dark mode rules
- `design-system/src/App.tsx` — all component demos
- `design-system/src/App.css` — component visual styling
- `design-system/public/icons.svg` — icon spritesheet
- `.github/workflows/deploy.yml` — Pages deploy

## Out of scope (for now, queued elsewhere)

- Extracting App.tsx into `src/components/*.tsx` — Phoenix super-app plan Phase 0
- Publishing as `@vsee/phoenix-ui` npm package — Phoenix plan
- Token Studio → Figma export automation
- Automated visual regression tests
- Contributor docs for 3rd parties
