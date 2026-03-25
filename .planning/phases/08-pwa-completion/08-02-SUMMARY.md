---
phase: 08-pwa-completion
plan: 02
subsystem: pwa
tags: [serwist, service-worker, offline, pwa, css-modules, nextjs]

# Dependency graph
requires:
  - phase: 08-01
    provides: sw.ts with Serwist v9 runtime caching strategies
provides:
  - /offline route — branded offline fallback page
  - SW fallbacks config — navigation requests that fail offline serve /offline from precache
affects: [08-03, 08-04, pwa-offline-experience]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Serwist v9 fallbacks.entries: precached URL + document destination matcher for offline nav fallback"
    - "precacheEntries spread pattern: [...(self.__SW_MANIFEST ?? []), '/offline'] to extend manifest with manual entries"

key-files:
  created:
    - src/app/offline/page.tsx
    - src/app/offline/offline.module.css
  modified:
    - src/app/sw.ts

key-decisions:
  - "Use fallbacks.entries in Serwist constructor (not PrecacheFallbackPlugin directly) — constructor handles plugin wiring automatically"
  - "Spread /offline into precacheEntries array alongside __SW_MANIFEST (no additionalPrecacheEntries option exists in Serwist v9)"
  - "Server component for /offline — no interactivity needed, no 'use client' directive required"

patterns-established:
  - "Offline page: semantic main > header + section structure, CSS Module with Rotter palette tokens"

requirements-completed: [PWA-03]

# Metrics
duration: 10min
completed: 2026-03-24
---

# Phase 08 Plan 02: Offline Fallback Page Summary

**Branded /offline route with Serwist v9 fallbacks config so failed navigations show a Rotter-themed page instead of the browser error screen**

## BLOCKING ISSUES

None

## Performance

- **Duration:** 10 min
- **Started:** 2026-03-24T18:35:00Z
- **Completed:** 2026-03-24T18:45:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Created /offline route as a server component with Rotter header blue (#71B7E6) header, "You're offline" message, and a "Try Again" anchor to /
- Wired Serwist v9 `fallbacks.entries` in sw.ts so document navigation failures serve the precached /offline page
- Build succeeds with /offline listed as a static route; built public/sw.js contains offline references

## Task Commits

1. **Task 1: Offline fallback page** - `17dd746` (feat)
2. **Task 2: Wire offline fallback into service worker** - `69b6893` (feat)

## Files Created/Modified

- `src/app/offline/page.tsx` — Server component at /offline with Rotter-themed header, offline message, retry link
- `src/app/offline/offline.module.css` — CSS Module with #71B7E6 header, #000099 title, #3293CD retry button
- `src/app/sw.ts` — Added /offline to precacheEntries and fallbacks.entries config in Serwist constructor

## Decisions Made

- Serwist v9 does not have `additionalPrecacheEntries` — spread `/offline` into the `precacheEntries` array as `[...(self.__SW_MANIFEST ?? []), "/offline"]`
- `fallbacks.entries` uses `request.destination === "document"` as matcher to only intercept navigation requests (not API or asset requests)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] additionalPrecacheEntries does not exist in Serwist v9**
- **Found during:** Task 2 (Wire offline fallback into service worker)
- **Issue:** Plan specified `additionalPrecacheEntries: ["/offline"]` but Serwist v9 SerwistOptions has no such field — only `precacheEntries`
- **Fix:** Spread `/offline` into `precacheEntries`: `[...(self.__SW_MANIFEST ?? []), "/offline"]`
- **Files modified:** src/app/sw.ts
- **Verification:** `npx tsc --noEmit` passes, build succeeds, offline appears in built sw.js
- **Committed in:** `69b6893` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking — wrong API option in plan)
**Impact on plan:** Required API correction; behavior is identical to what plan intended.

## Issues Encountered

- Stale `.next` lock from prior build attempt; retried once and build succeeded.

## Evidence (§16)

- /offline route exists on disk `[CODE:src/app/offline/page.tsx:1]`
- CSS uses #71B7E6 header color `[CODE:src/app/offline/offline.module.css:5]`
- `npx tsc --noEmit` exits 0 — TypeScript clean `[CODE:verified in shell]`
- `pnpm build` exit 0 with `/offline` listed as static route `[CODE:build output]`
- `grep "offline" public/sw.js` returns 2 matches — offline wired into built SW `[CODE:public/sw.js]`

## Investigation Evidence (§17)

All verdicts PASS — no investigation needed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- /offline page and SW fallback wiring complete
- Plan 08-03 (install prompt / PWA installability) already completed in parallel
- Plan 08-04 can proceed

---
*Phase: 08-pwa-completion*
*Completed: 2026-03-24*
