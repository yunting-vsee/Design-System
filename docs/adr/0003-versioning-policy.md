# 0003 — Versioning policy: strict semver with long pre-1.0

**Status:** Accepted
**Date:** 2026-04-19
**Deciders:** An Nguyen

## Context

`@vsee/ui` ships iteratively as components extract from the docs-app `App.tsx` into the library. Consumers (Phoenix + future modules) need predictable upgrade behavior. The design system's API surface is still young; breaking changes are expected early.

## Decision

Adopt strict **semver** with a **long, explicit pre-1.0 phase**.

### Pre-1.0 (`0.x.y`)

- **Breaking changes between minors are expected and fine.** `0.1.0 → 0.2.0` may rename tokens, change prop signatures, etc.
- **Patches are bug-only.** `0.1.0 → 0.1.1` cannot include API changes.
- **Consumers pin exact tags** (no caret ranges). Upgrades are manual and explicit.
- Move fast; refactor aggressively.

### When to hit 1.0

All three conditions must hold:
1. API is stable across ≥3 real consumers (Phoenix shell + 2 module repos)
2. No major rewrites planned in the next quarter
3. Team agrees the shape is commitment-worthy

Don't rush 1.0. Reference points: shadcn/ui was 0.x for ~18 months; Radix Primitives took ~2 years. Industry norm for design systems is 1–2 years pre-1.0.

### Post-1.0 (`1.x.y` and beyond)

Strict semver:

| Bump | Rules |
|---|---|
| **major** (`1.x → 2.0`) | Removed export; changed prop signature; renamed/removed token; added required prop; changed CSS class consumers might target |
| **minor** (`1.0 → 1.1`) | New component; new optional prop; new variant; new token in a new category — backward-compatible |
| **patch** (`1.0.0 → 1.0.1`) | Bug fix, a11y fix, visual tweak, internal refactor |

Consumers switch to caret ranges (`"^1.0.0"`) post-1.0 for automatic minor/patch pickup.

### Design-system nuance

- **Token value changes** are NOT formally a semver break (API shape unchanged) but produce visual shift. Flag clearly in CHANGELOG. Consider whether a default theme change deserves a major bump based on downstream impact.
- **CSS class name changes** that consumers might target externally are breaking (major).
- **Adding a new component to the export barrel** is always a minor.

## Considered alternatives

### "Zero-ver" / no version discipline

Rejected: consumers can't tell if an update is safe. Blocks any kind of automated update policy.

### Auto-increment on every commit (per-commit versions)

Rejected: too much noise; consumers get flooded with versions. Tag-based semver is calmer.

### CalVer (calendar versioning)

Rejected: doesn't communicate breakage risk to consumers — an API change in January looks the same as a patch in March.

## Consequences

**Positive**
- Consumers have a predictable contract
- Pre-1.0 phase protects iteration speed
- Post-1.0, caret ranges + strict semver lower consumer upgrade cost

**Negative**
- Pinning exact tags pre-1.0 means consumers have manual upgrade work. Counter-weight: acceptable price for the iteration freedom.
- Hitting 1.0 requires a deliberate, possibly-controversial team decision.

## Rename vs. version bump

The package name does NOT change except in rare cases:

- **Company rebrand.** `@vsee/*` → new scope.
- **Scope split.** If `@vsee/ui` outgrows itself into multiple packages, the ORIGINAL keeps its name; split-off packages get new names.
- **Semantic re-identification.** The thing is no longer a UI library. Extremely unlikely.

Otherwise: use major bumps for breaking changes. Keep the name stable.
