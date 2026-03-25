---
phase: 01-foundation-and-design-system
plan: 01
subsystem: infra
tags: [next.js, serwist, pwa, service-worker, css-modules, typescript]

# Dependency graph
requires: []
provides:
  - Next.js 16.2.1 project scaffold with TypeScript and App Router
  - Serwist PWA shell (sw.ts, next.config.ts withSerwist wrapper, public/manifest.json)
  - globals.css with complete Rotter CSS custom property design tokens
  - Base layout.tsx with MultiRotter metadata and manifest link
affects: [02-design-tokens-and-typography, 03-layout-components, all subsequent plans]

# Tech tracking
tech-stack:
  added:
    - next 16.2.1 (App Router, webpack mode)
    - react 19.2.4
    - @serwist/next ^9.5.7 (PWA service worker)
    - serwist ^9.5.7 (SW runtime)
    - typescript ^5
  patterns:
    - CSS custom properties as design tokens (--rotter-* variables in globals.css)
    - webpack mode required (next build --webpack) due to Serwist incompatibility with Turbopack
    - sw.ts uses static Serwist import (no top-level await) for TypeScript compatibility

key-files:
  created:
    - package.json
    - tsconfig.json
    - next.config.ts
    - src/app/sw.ts
    - src/app/layout.tsx
    - src/app/page.tsx
    - src/app/globals.css
    - public/manifest.json
    - .gitignore
  modified: []

key-decisions:
  - "Use --webpack flag for next dev/build because Serwist uses webpack config API not compatible with Next.js 16 Turbopack default"
  - "Add webworker to tsconfig.json lib array for ServiceWorkerGlobalScope type definitions"
  - "Use static Serwist import in sw.ts instead of dynamic await import to avoid top-level await TypeScript config requirement"

patterns-established:
  - "Pattern: All Next.js build/dev commands use --webpack flag (Serwist + Turbopack incompatible)"
  - "Pattern: CSS design tokens live in globals.css as --rotter-* custom properties; never hardcode hex values in components"

requirements-completed: [DSGN-01, LYOT-05]

# Metrics
duration: 5min
completed: 2026-03-22
---

# Phase 01 Plan 01: Next.js Scaffold with Serwist PWA Shell Summary

**Next.js 16.2.1 App Router project bootstrapped with Serwist PWA service worker, manifest, and complete Rotter CSS design token system in globals.css**

## BLOCKING ISSUES

None

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-22T20:22:07Z
- **Completed:** 2026-03-22T20:27:03Z
- **Tasks:** 1 (Task 0: Scaffold Next.js project with Serwist PWA shell)
- **Files modified:** 9 files created

## Accomplishments

- Scaffolded Next.js 16.2.1 project with TypeScript, App Router, src-dir layout via create-next-app
- Installed and configured Serwist (@serwist/next + serwist) with sw.ts entry point and withSerwist next.config.ts wrapper
- Created public/manifest.json with MultiRotter identity (name, short_name, theme_color: #71B7E6)
- Populated globals.css with 30+ Rotter CSS custom properties covering all colors, typography, and layout constants
- `npm run build` passes with zero TypeScript errors and zero warnings

## Task Commits

Each task was committed atomically:

1. **Task 0: Scaffold Next.js project with Serwist PWA shell** - `6d127b4` (feat)

## Files Created/Modified

- `package.json` - Project dependencies: next 16.2.1, @serwist/next, serwist; dev scripts use --webpack flag
- `tsconfig.json` - TypeScript config with webworker lib added for ServiceWorkerGlobalScope
- `next.config.ts` - Next.js config wrapped with withSerwist (swSrc: src/app/sw.ts, swDest: public/sw.js)
- `src/app/sw.ts` - Serwist service worker with defaultCache and addEventListeners
- `src/app/layout.tsx` - Root layout with MultiRotter metadata (title, description, manifest link)
- `src/app/page.tsx` - Minimal homepage placeholder
- `src/app/globals.css` - Complete Rotter design token system as CSS custom properties
- `public/manifest.json` - PWA manifest with MultiRotter identity and #71B7E6 theme color
- `.gitignore` - Standard Next.js gitignore with Serwist-generated sw.js added

## Decisions Made

- **webpack mode required:** Next.js 16 uses Turbopack by default, but @serwist/next injects webpack configuration that is incompatible. Resolved by adding `--webpack` flag to all build/dev scripts.
- **webworker lib in tsconfig:** `ServiceWorkerGlobalScope` type lives in the webworker TypeScript lib, not `dom`. Added `"webworker"` to `tsconfig.json` lib array.
- **Static import in sw.ts:** Used `import { Serwist } from "serwist"` (static) instead of `new (await import("serwist")).Serwist(...)` (dynamic top-level await) to avoid needing `"module": "esnext"` and `"target": "es2022"` just for the service worker file.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Next.js 16 Turbopack incompatibility with Serwist webpack config**
- **Found during:** Task 0 (first build attempt)
- **Issue:** Next.js 16 enables Turbopack by default; Serwist injects webpack config causing build failure with "ERROR: This build is using Turbopack, with a webpack config and no turbopack config"
- **Fix:** Added `--webpack` flag to `dev` and `build` scripts in package.json to force webpack mode
- **Files modified:** package.json
- **Verification:** `npm run build` exits successfully with "webpack" mode displayed
- **Committed in:** 6d127b4 (Task 0 commit)

**2. [Rule 3 - Blocking] ServiceWorkerGlobalScope type missing from default tsconfig lib**
- **Found during:** Task 0 (TypeScript compilation)
- **Issue:** TypeScript error: "Cannot find name 'ServiceWorkerGlobalScope'" — the webworker types are not included in the default dom+esnext lib set
- **Fix:** Added `"webworker"` to the `lib` array in tsconfig.json
- **Files modified:** tsconfig.json
- **Verification:** TypeScript compilation succeeds with zero errors
- **Committed in:** 6d127b4 (Task 0 commit)

**3. [Rule 3 - Blocking] Top-level await in original sw.ts example incompatible with TypeScript config**
- **Found during:** Task 0 (TypeScript compilation)
- **Issue:** The plan's sw.ts example used `new (await import("serwist")).Serwist(...)` — top-level await requires `"module": "esnext"` and `"target": "ES2022"` minimum, which would affect the entire project tsconfig
- **Fix:** Replaced dynamic import with static `import { Serwist } from "serwist"` — functionally equivalent, no config change required
- **Files modified:** src/app/sw.ts
- **Verification:** TypeScript compilation succeeds; build output includes bundled SW
- **Committed in:** 6d127b4 (Task 0 commit)

---

**Total deviations:** 3 auto-fixed (all blocking)
**Impact on plan:** All three fixes were necessary to compile and build. No scope changes; all deliverables match the plan.

## Issues Encountered

- create-next-app with `--use-pnpm` failed ("packages field missing or empty") — used `--use-npm` instead and installed dependencies with `npm install`. This is a pnpm workspace configuration issue specific to this environment.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Next.js project is scaffolded and builds cleanly
- Serwist PWA shell is fully configured; service worker will be generated on each build
- globals.css design tokens are ready for all subsequent phases to reference
- Plan 01-02 (design tokens and typography) can proceed immediately

## Self-Check: PASSED

All files verified present and commit 6d127b4 confirmed in git log.

---
*Phase: 01-foundation-and-design-system*
*Completed: 2026-03-22*
