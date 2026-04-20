# 0001 — Package distribution via Bitbucket Git URL

**Status:** Accepted
**Date:** 2026-04-19
**Deciders:** An Nguyen

## Context

`vp-design-system` needs to be consumable by Phoenix (`va-main`) and future VSee module repos. VSee has no private npm registry today. The published docs site (GitHub Pages) is the public face; the Bitbucket repo is the source of truth. `@vc/library` (the existing VSee shared code) already uses Git URLs as its distribution mechanism, so the pattern is known.

## Decision

Distribute `@vsee/ui` as a **Git URL dependency**:

```json
"@vsee/ui": "bitbucket:vsee/vp-design-system#v0.1.0"
```

Consumers install with standard `npm install`. npm clones the tagged ref, runs the package's `prepare` script (which builds the library), and hoists `dist/` into `node_modules`. No registry auth, no tarball upload step. A tag push is the only "publish" action.

Repo shape to support this: the library's `package.json` must live at repo root. The existing Vite docs app moves from `design-system/` to `apps/docs/`. Library source at `src/` at root.

## Considered alternatives

### npm registry (public `@vsee/*` on npmjs.com)

Rejected: package is internal for now; public npm would leak early iterations to anyone. Revisit when 3rd-party marketplace contributors enter scope (Phase 4 of super-app plan).

### Verdaccio self-hosted private registry

Rejected for v0.1.0: real infra (Docker container, subdomain, auth). Worth revisiting when consumer count exceeds 4 repos OR semver ranges become important for upgrade ergonomics (post-1.0).

### Bitbucket Downloads tarball

Rejected: private-repo downloads need per-consumer auth tokens that don't fit npm's install flow. Non-standard, more fragile than Git URL.

### Published to GitHub Packages

Rejected: would require mirroring from Bitbucket to GitHub for hosting; splits identity across two SaaS. Contradicts va-main ADR 0003 (stay on Bitbucket).

## Consequences

**Positive**
- Zero infrastructure cost
- Works today with existing Bitbucket SSH / API token auth
- Matches `@vc/library` pattern — team familiarity
- Tag push = publish, no CI gating required at first

**Negative**
- `npm install` slower than tarball download (clones + builds on consumer side)
- No semver range resolution (consumers pin exact tags pre-1.0 — acceptable, see ADR 0003)
- Each consumer needs Bitbucket SSH access (true already for VSee team members)

**Neutral**
- Build runs via `prepare` script on consumer install — consumer machine builds the lib. Acceptable for internal consumers; revisit if 3rd parties enter.

## Revisit when

- 4+ repos consuming `@vsee/ui` → Verdaccio becomes worth the infra lift
- 3rd-party marketplace modules need access → public npm required
- Install time becomes a real pain point in CI
