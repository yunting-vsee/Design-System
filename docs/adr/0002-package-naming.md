# 0002 — Package naming: `@vsee/ui`

**Status:** Accepted
**Date:** 2026-04-19
**Deciders:** An Nguyen

## Context

The repo is `bitbucket.org/vsee/vp-design-system` (the `vp-` prefix signals "VSee Platform" family, parallel to `vc-` for VSee Clinic). The package name is separate from the repo slug and needs its own decision. Phoenix's token convention is `--vsee-*` (va-main ADR 0004), so the package name should align.

## Decision

Package name: **`@vsee/ui`**

Consumer imports:
```ts
import { Button, Switch, Select } from '@vsee/ui'
import '@vsee/ui/tokens.css'
```

Install:
```json
"@vsee/ui": "bitbucket:vsee/vp-design-system#v0.1.0"
```

## Considered alternatives

| Name | Rejected because |
|---|---|
| `@vsee/design-system` | Longer; tautological for a library that IS a design system |
| `@vsee/phoenix-ui` | Codename lock-in — Phoenix retires in 2–3 years, forcing a rename |
| `@vsee/ds` | Acronym — hostile to newcomers |
| `@vsee/vp-ui` | Leaks repo-prefix (`vp-`) into consumer imports; unneeded context |
| `@vp/design-system` | Fragments scope from `@vsee/*`; new npm org to maintain |

## Why `@vsee/ui`

- **Aligns with token prefix.** Tokens are `--vsee-*`; package is `@vsee/*`. Consistent mental model.
- **Precedent in the ecosystem.** `@chakra-ui/react`, `@radix-ui/*`, `@adobe/react-spectrum`, `@primer/react` — short scoped packages where "ui" carries the meaning.
- **Scope-neutral.** Phoenix, Clinic module, RPM, EMR — all install the same package. Name doesn't privilege any one consumer.
- **Short in imports.** `@vsee/ui` is ~8 chars of scope+name — trivial in import paths.

## Consequences

**Positive**
- Terse, readable imports
- Survives product rebrands (VSee is stable; Phoenix codename isn't)
- Matches CSS custom property convention

**Negative**
- "ui" is generic — doesn't immediately signal "design system" to newcomers. Mitigated by the README of the package itself.

## Revisit when

- VSee the company rebrands (scope change: `@vsee/*` → `@xcorp/*` or similar)
- Scope splits (`@vsee/ui-core` + `@vsee/ui-clinic` + `@vsee/ui-charts`) — original keeps name; new packages get new names
