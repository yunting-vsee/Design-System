# 0004 — Tokens prefixed with `--vsee-*` at source

**Status:** Accepted
**Date:** 2026-04-20
**Deciders:** An Nguyen
**Supersedes:** the earlier (unwritten) "naked token" convention in `src/index.css`.

## Context

Phoenix (va-main) consumes design tokens with the `--vsee-*` prefix per va-main ADR 0004. When this repo was first scoped, the working assumption was:

- Keep tokens naked here (`--brand`, `--sp-4`, `--text-h1-size`).
- Phoenix (and future consumers) apply a `--vsee-*` prefix at build time via a `scripts/prefix-tokens.mjs` transform.

Motivation for the naked convention was optionality: if a future consumer wanted a different prefix (`@acme/ui` white-labelling, Token Studio export hygiene), they could transform to their own prefix at their build step.

In practice, the optionality is speculative (no non-VSee consumer is planned before Phase 4 of the super-app roadmap, 18+ months out) while the cost of the transform is concrete:

- Every consumer needs to run `prefix-tokens.mjs` or copy its logic.
- Any token reference in `src/App.css`, `src/App.tsx`, or component CSS would have to be transformed too — not just the `@theme` block. Catching every reference at build time is a drift risk.
- "What you see in the source is not what the consumer imports" is a readability cost forever, paid by everyone reading the code.

## Decision

Prefix tokens **at source** in this repo. Canonical names are `--vsee-brand`, `--vsee-sp-4`, `--vsee-text-h1-size`, `--vsee-surface-panel`, etc.

Consumers import the stylesheet unchanged:

```css
@import '@vsee/ui/tokens.css';
```

…and use `var(--vsee-brand)` directly. No transform step.

## Considered alternatives

### Keep naked + transform at build (original plan)

Rejected for the reasons above: speculative benefit, concrete cost, drift risk across multiple files.

### Keep naked + publish a pre-transformed artifact

Rejected: same transform logic, just moved from consumer build to library build. Doesn't address the "source doesn't match the artifact" readability cost.

### Prefix as `--ds-*` or `--t-*` (generic)

Rejected: every consumer would need a remap. `--vsee-*` is already the stable company brand; the design system is specifically for VSee products; naming it vaguely gains nothing.

### Per-theme prefix (`--light-*` / `--dark-*`)

Rejected: themes are switched via `[data-mode]` attribute, not by picking a different token namespace. Adding a prefix tier duplicates every token.

## Consequences

**Positive**
- One-line consumer install path (`@import '@vsee/ui/tokens.css'`)
- Source and shipped artifact are identical
- No build-time transform to maintain, version, or debug
- Aligns with va-main ADR 0004 (Phoenix tokens are `--vsee-*`) — no conversion layer between the two repos

**Negative**
- Tokens in the docs-site copy-paste UX carry the `--vsee-` prefix. Someone copying CSS for an unrelated project sees `var(--vsee-brand)` instead of `var(--brand)`. Acceptable — if you're not using `@vsee/ui`, you shouldn't be copy-pasting its tokens anyway. Rewrite is trivial (`--vsee-X` → whatever your scheme is).
- If a future white-label consumer genuinely needs a different prefix, we will publish `tokens.raw.css` (naked) alongside `tokens.css` (prefixed) at that point — pay the cost once it's real, not before.

## Migration

One-time mechanical rename across the repo:

- `src/index.css` — rewrite the `@theme` block with prefixed names
- `src/App.css` — rewrite all `var(--X)` references
- `src/App.tsx` — rewrite any inline `var(--X)` in `style={...}`
- `README.md` / component docs — update examples

Tracked as a separate PR (agent-driven mechanical rename) to keep this ADR's conceptual commit clean.

## Revisit when

- White-label marketplace (Phase 4 of super-app plan) adds a non-VSee consumer who needs a different prefix → publish `tokens.raw.css` alongside, don't retroactively unprefix.
- VSee the company rebrands → search-replace `--vsee-*` to the new prefix, bump major per ADR 0003.
