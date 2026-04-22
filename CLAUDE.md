# CLAUDE.md

Guidance for Claude Code working in the `vp-design-system` repo.

## Project

VSee Design System — the source of truth for VSee's visual language, tokens, components, and patterns. Shipped as two things:

1. **The `@vsee/ui` package** — library source at the repo root (`src/`). Consumers install via Git URL (`bitbucket:vsee/vp-design-system#vX.Y.Z`) and `@import '@vsee/ui/tokens.css'` + `@import '@vsee/ui/styles.css'`.
2. **The docs site** — a React + React Aria Vite app at `apps/docs/` that doubles as a showcase and specification. Deployed to GitHub Pages at https://yunting-vsee.github.io/Design-System/ on push to `master`.

**Consumers:** Phoenix (`va-main`) is the primary downstream consumer. Future modules (Clinic, RPM, EMR) will consume the same tokens + components. Extraction is tracked in `docs/roadmap/npm-extraction-plan.md` (Phase 0 shipped CSS-only v0.1.0; components land in v0.2+).

## Repo layout

```
CLAUDE.md
lefthook.yml
package.json           ← @vsee/ui library manifest (v0.1.0)
tsconfig.json          ← library TS config
src/                   ← library source (single source of truth)
  tokens.css           ← @theme + brand/dark-mode overrides
  styles.css           ← typography utilities + component visual treatment
  index.ts             ← placeholder entry (v0.2+ exports components)
apps/
  docs/                ← Vite showcase app, consumes the library via alias
    src/
      index.css        ← Tailwind import + @vsee/ui imports + docs-site resets
      App.tsx          ← ~3,000-line demo site
      ...
    vite.config.ts     ← `@vsee/ui` → `../../src` alias
docs/                  ← ADRs + roadmap
.github/workflows/
  deploy.yml           ← builds apps/docs → GitHub Pages
```

## Tech stack

- **React 19** with TypeScript
- **React Aria Components 1.16+** for accessible, unstyled primitives
- **Tailwind CSS v4** via `@tailwindcss/vite` with `@theme` token block
- **CSS custom properties** as the design-token source of truth (`src/tokens.css`)
- **Lucide React** for icons
- **Vite** for build tooling
- **Internationalized dates** via `@internationalized/date`

## Commands

Docs-app commands run from `apps/docs/`:

```bash
cd apps/docs
npm run dev          # Vite dev server
npm run build        # tsc + Vite production build
npm run lint         # ESLint (flat config)
npm run preview      # preview built output
```

The library itself is CSS-only in v0.1.0; there is no build step at the repo root (`npm run build` at root is an intentional no-op). When components land in v0.2+, the library will gain its own build.

## Architecture

**Single-file demo site.** `apps/docs/src/App.tsx` (~3,000 lines) holds every component demo and doc section. Helper components (`Section`, `SubSection`, `CodeBlock`, `Swatch`, `useCopyToast`) are inline. Named handler functions organise the main areas: `FoundationsColors`, `FoundationsTypography`, `FoundationsSpacing`, `ComponentsButtons`, `ComponentsForms`, `ComponentsBadges`, `ComponentsFeedback`, `ComponentsNavigation`, `ComponentsDropdowns`, `ComponentsOthers`, `ComponentsOverlays`, `PatternsLayouts`, `PatternsTheming`, `PatternsFormio`.

**Splitting into `src/components/*.tsx` is queued** — this is the work of Phase 1 of the npm extraction roadmap. When you extract a component, pull the demo block out of `App.tsx` into `src/components/<Name>.tsx`, export from `src/index.ts`, and bump to the relevant minor version.

**Styling**

- `src/tokens.css` — single source of truth for the `@theme` block (~86 tokens: brand, semantic colors, grey scale, typography size scale, spacing scale, radius scale) plus brand-theme and dark-mode selector overrides. Add tokens here first; reference them via `var(--vsee-token-name)`.
- `src/styles.css` — typography utility classes (`.text-h1`…`.text-display`) + component visual treatment (`.btn`, `.input`, `.badge`, etc.). Some selectors wrap React Aria renders with our visual layer.
- `apps/docs/src/index.css` — docs-site shell only: Tailwind import, `@vsee/ui` imports, base resets (`html`/`body`/focus/scrollbar). Consumers bring their own resets.
- **Tailwind v4** — arbitrary-value classes (e.g. `bg-[var(--vsee-brand)]`, `text-[var(--vsee-text-primary)]`) are common. Use them for one-off styling; promote to a named CSS class when a pattern repeats.

**Token naming — `--vsee-*` prefix at source**

Tokens are prefixed **at source** (`--vsee-brand`, `--vsee-sp-4`, `--vsee-text-h1-size`) — see ADR 0004. This matches the Phoenix convention (va-main ADR 0004) and ships as-is via `@vsee/ui/tokens.css` — no build-time transform needed. Downstream consumers `@import` the stylesheet and get the final names directly. If a future consumer needs a different prefix (white-label Phase 4), we can publish a second `tokens.raw.css` export at that point rather than carrying a transform today.

**Themes**

- `[data-theme="blue" | "purple"]` overrides brand-* tokens for white-label tenants (defined in `src/tokens.css`).
- `[data-mode="dark"]` overrides neutral/surface/text tokens. System preference detection is optional; explicit attribute wins.

## Branching

- `master` — default branch; autodeploys to GitHub Pages on push
- Branch prefix matches the commit type of the primary change: `feat/*`, `fix/*`, `docs/*`, `refactor/*`, `chore/*`, `test/*`, `style/*`

## Commit convention

Scoped conventional commits: `<type>(<scope>): <subject>`.

```
feat(button):  add xl-destructive variant
fix(tokens):   restore --vsee-brand-dark for blue theme in dark mode
refactor(app): split FoundationsColors into its own file
docs(adr):     0005 — component extraction order
chore(deps):   bump react-aria to 1.17
test(visual):  regenerate token-screen parity snapshots
style(docs):   tighten code-block spacing
```

Types: `feat` / `fix` / `refactor` / `docs` / `style` / `chore` / `test`.

Scopes — pick the one that matches the change:
- `tokens` — `src/tokens.css`
- `styles` — `src/styles.css` (utilities, visual treatment)
- `button` / `input` / `badge` / ... — single-component changes (once extracted in Phase 1+)
- `app` — `apps/docs/src/App.tsx` and other docs-site React code
- `docs` — `docs/adr/`, `docs/roadmap/`, `README.md`, this file
- `tooling` — lefthook, lint config, deploy workflow, package manifests
- `deps` — dependency bumps
- `visual` — Playwright visual tests

Rules:
- Subject in imperative mood, lowercase after the colon, no trailing period, soft-wrapped at ~72 chars.
- Body (optional) explains *why*, not *what* — the diff shows what.
- One concern per commit. Tooling change, feature change, and docs change get separate commits even if they land together.
- Mirrors the `va-main` (Phoenix) convention so downstream consumers read the same shape.
- Applies going forward; historic unscoped commits stay as-is (rewriting history isn't worth the churn).

## Changelog

`CHANGELOG.md` at the repo root is a running journal of library and docs-site changes. **Every commit and every merge to `master` updates it, in the same commit that introduces the change.** Opening a PR does not itself trigger an entry — the commits inside the PR already carry theirs.

Format (match existing entries — it's intentionally informal, not Keep-a-Changelog):

- Date header at column 0 — e.g. `Apr 22`. Same-day commits append under the existing header; a new day opens a new block.
- Topic sub-heading indented two spaces — e.g. `Buttons`, `Color tokens`, `Login pattern`.
- Bullets under the topic describe the change. Terse. Past or present tense, whichever reads cleaner. No version numbers.

Skip only for truly trivial, non-behavioural edits (formatter-only commits, pure comment/typo fixes). When unsure, write the entry — it's cheaper than missing one.

## Deployment

`.github/workflows/deploy.yml` — GitHub Actions workflow mirrored from the Bitbucket repo to GitHub; on push to `master` or `main`, builds the Vite app and deploys to GitHub Pages. The workflow runs from `apps/docs/` (see `working-directory` in the YAML). **Don't change the trigger branches without coordinating with the design team** — breaking the deploy breaks the docs site.

## Pre-commit hooks

Managed by [lefthook](https://github.com/evilmartians/lefthook) (`lefthook.yml`). Two jobs:

| Job | What it runs | Blocks commit on |
|---|---|---|
| `security` | `gitleaks git --staged` | Detected credentials |
| `lint` | `cd apps/docs && npm run lint` | ESLint errors |

**First-time setup:** `npx lefthook install`. `gitleaks` is optional — if not installed, the job skips rather than failing.

## Bitbucket PR workflow

**Full reference:** [`docs/bitbucket-pr-workflow.md`](docs/bitbucket-pr-workflow.md) — read/write/create/comment/merge via API, auth setup, common errors, cheat sheet.

Same auth pattern as va-main. Export these in your shell profile — `~/.zshrc` on macOS, `~/.bashrc` (Git Bash) on Windows:
- `BITBUCKET_EMAIL="your@vsee.com"` — Atlassian account email
- `BITBUCKET_API_TOKEN="ATATT..."` — token from https://id.atlassian.com/manage-profile/security/api-tokens (needs `read:*:bitbucket` + `write:pullrequest:bitbucket` scopes)

Create PR (REST API uses the email as Basic-auth username):
```bash
curl -s -u "$BITBUCKET_EMAIL:$BITBUCKET_API_TOKEN" \
  -H "Content-Type: application/json" \
  -X POST "https://api.bitbucket.org/2.0/repositories/vsee/vp-design-system/pullrequests" \
  -d '{"title":"...", "source":{"branch":{"name":"..."}}, "destination":{"branch":{"name":"master"}}, "close_source_branch":true}'
```

Push over git-HTTPS with the same API token — **the username must be the static literal `x-bitbucket-api-token-auth`** (not the email, not the Bitbucket username, and not `x-token-auth` which is the legacy App-Password convention):
```bash
git remote set-url bitbucket \
  "https://x-bitbucket-api-token-auth:${BITBUCKET_API_TOKEN}@bitbucket.org/vsee/vp-design-system.git"
git push bitbucket <branch>
```
The PR-creation `-u email:token` pattern above and the git-HTTPS `x-bitbucket-api-token-auth:token` pattern use the **same** token — only the username differs. App Passwords (the older mechanism) are being retired by Atlassian on 2026-06-09; API tokens are the forward path.

## Key files

- `src/tokens.css` — design tokens, Tailwind theme, brand + dark mode overrides
- `src/styles.css` — typography + component visual styling
- `src/index.ts` — library entry (placeholder in v0.1.0)
- `package.json` — `@vsee/ui` library manifest
- `apps/docs/src/App.tsx` — all component demos
- `apps/docs/src/index.css` — docs-site shell (Tailwind + library imports + resets)
- `apps/docs/vite.config.ts` — `@vsee/ui` alias wiring
- `apps/docs/public/icons.svg` — icon spritesheet
- `.github/workflows/deploy.yml` — Pages deploy
- `docs/roadmap/npm-extraction-plan.md` — phased rollout plan
- `docs/adr/` — decision records

## Out of scope (for now, queued elsewhere)

- Component extraction into `src/components/*.tsx` — Phase 1 of the npm roadmap
- Library build pipeline + tsdx/unbuild setup — lands with the first component in v0.2+
- Token Studio → Figma export automation
- Automated visual regression tests
- Contributor docs for 3rd parties
