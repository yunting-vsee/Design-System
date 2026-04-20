# NPM Package Extraction — Phased Roadmap

**Last updated:** 2026-04-19
**Owner:** Phoenix team + Yunting (design)

## Why

`vp-design-system` is currently a Vite docs app. Phoenix and future VSee module repos can't install it as a library — they copy-paste from the docs site today. Extracting it into a consumable npm package unlocks a shared source of truth for tokens and components.

See:
- [ADR 0001 — Package distribution](../adr/0001-package-distribution.md)
- [ADR 0002 — Package naming `@vsee/ui`](../adr/0002-package-naming.md)
- [ADR 0003 — Versioning policy](../adr/0003-versioning-policy.md)

## Phase 0 — ship tokens + base CSS (~3 days)

**Goal:** Phoenix imports tokens from `@vsee/ui` instead of duplicating them locally.

- [ ] Restructure repo: library at root; `design-system/` → `apps/docs/`
- [ ] Add `scripts/prefix-tokens.mjs` — transforms naked `--X` to `--vsee-X` at build time
- [ ] Root `package.json` — name `@vsee/ui`, version `0.1.0`, main/types/files fields, `prepare` script
- [ ] Library entry `src/tokens.ts` (or `src/index.ts` exporting just the CSS paths)
- [ ] Library publishes: `tokens.css` (prefixed) + `styles.css` (renamed from current `App.css`)
- [ ] Tag `v0.1.0`, push
- [ ] Phoenix consumes via Git URL; imports `@vsee/ui/tokens.css`; deletes duplicate `--vsee-*` tokens

## Phase 1 — primitive extraction (~2–3 weeks)

**Goal:** Phoenix's `src/components/common/*` primitives are replaced by `@vsee/ui` imports.

Order follows va-main's ADR 0001 RAC migration order:

- [ ] `0.2.0` — Switch + Checkbox
- [ ] `0.3.0` — Select
- [ ] `0.4.0` — Menu + Tooltip
- [ ] `0.5.0` — Dialog + Drawer
- [ ] `0.6.0` — DatePicker + ComboBox
- [ ] `0.7.0` — any remaining primitives (Tabs, Tag, Avatar, Breadcrumb)

Each extraction:
1. Pull demo code from `apps/docs/src/App.tsx` into `src/components/<Name>.tsx`
2. Typed props, thin wrapper over React Aria Components
3. Export from `src/index.ts` barrel
4. Tag new minor version
5. Phoenix migrates the corresponding `src/components/common/X.tsx` to the package import

## Phase 2 — patterns + compositions (~4–6 weeks)

- [ ] `PatternsLayouts` (Sidebar + Content, Header + Content, etc.)
- [ ] `PatternsTheming` (brand theme switcher)
- [ ] `PatternsFormio` (Form.io + React Aria integration)
- [ ] `PatientCard`, `OrdersTable` — composed medical patterns
- [ ] First clinic-specific patterns (Triage Board, Patient Summary)

## Phase 3 — 1.0 release

Preconditions (from ADR 0003):
1. API stable across 3+ consumers (Phoenix shell + 2 modules)
2. No breaking changes planned for ≥60 days
3. Team agrees on commitment

Phase 3 cuts when all three are met. Consumers switch to `"^1.0.0"`.

## Phase 4 — 3rd-party marketplace (aligned with Phoenix super-app plan Phase 4)

- [ ] Publish to public npm (`@vsee/ui`)
- [ ] License-gating at runtime (optional)
- [ ] Public docs (migrate from current GH Pages)
- [ ] Contributor guide for external module authors

## Ownership

| Area | Owner |
|---|---|
| Token definitions, `@theme` block, component API decisions | Yunting + design team |
| Library build pipeline, publish, release tagging | Phoenix team (initially); can transfer later |
| Individual component extractions | Design team primarily; Phoenix contributes back when needed |
| Consumption in Phoenix | Phoenix team |
| Marketplace SDK (Phase 4) | TBD — likely a dedicated tooling owner |

## Known risks

- **Single-maintainer bottleneck** — Yunting is the sole dev on design system today. Extraction work needs shared ownership.
- **React major-version coupling** — design system and Phoenix must stay on compatible React majors. Propose policy: design system doesn't bump React major without a heads-up PR to Phoenix.
- **Breaking-change discipline** — pre-1.0 is forgiving; post-1.0 every break costs a major bump. Team muscle-memory needed around this.

## Open decisions

- Release tagging owner: design team vs Phoenix team?
- Beta cadence: weekly tag cuts during Phase 1? monthly in Phase 2?
- Translation of docs site — currently English + some VN; design-system i18n story vs consumer i18n story not yet aligned.
