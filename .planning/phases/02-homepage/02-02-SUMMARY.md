---
phase: 02-homepage
plan: 02
subsystem: ui
tags: [react, next.js, table-layout, auto-refresh, homepage, pwa]

# Dependency graph
requires:
  - phase: 02-homepage-plan-01
    provides: BreakingNewsFeed, TickerSidebar, AdSlot components and HOMEPAGE_SEED data
  - phase: 01-foundation-and-design-system
    provides: Table component, HeaderBar, BlueNavBar, OrangeNavBar layout components, CSS tokens

provides:
  - HomepageLayout 3-column table component (1012px container, 300/450/remaining split)
  - Auto-refresh via useEffect + setInterval + router.refresh() every 780000ms
  - Complete homepage route (page.tsx) rendering full Rotter layout shell
  - AdSlot positions: Below Header (970x90), Right Cube (300x250), Center Pos2 (450x300), Left Cube (250x300)

affects:
  - 03-forum (will compose similar table layouts)
  - Any phase composing layout components

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Client boundary at layout level — page.tsx stays server component, HomepageLayout carries 'use client'"
    - "useEffect + setInterval + cleanup for polling/refresh timers"
    - "Direct sibling imports within a component directory to avoid circular re-export via index.ts"
    - "Table bgcolor must use lowercase attribute (not bgColor) — TypeScript strict enforcement"

key-files:
  created:
    - src/components/homepage/HomepageLayout.tsx
    - src/components/homepage/HomepageLayout.module.css
    - src/__tests__/AutoRefresh.test.tsx
  modified:
    - src/components/homepage/index.ts
    - src/__tests__/HomepageLayout.test.tsx
    - src/app/page.tsx

key-decisions:
  - "HomepageLayout imports leaf components directly (./BreakingNewsFeed, ./TickerSidebar, ./AdSlot) to avoid circular import via index.ts barrel"
  - "bgcolor='#000000' must be lowercase on Table component — TypeScript strict mode rejects bgColor"
  - "useRouter mock added to HomepageLayout.test.tsx — next/navigation useRouter throws in jsdom without it"

patterns-established:
  - "Client components that use next/navigation hooks must have next/navigation mocked in jest tests"
  - "Barrel index.ts exports are safe for consumers but components within the same directory must import siblings directly"

requirements-completed: [HOME-01, HOME-04, HOME-05]

# Metrics
duration: 15min
completed: 2026-03-22
---

# Phase 02 Plan 02: HomepageLayout Summary

**3-column table layout (1012px, 300/450/remaining) with 13-minute auto-refresh wiring all homepage components into page.tsx**

## BLOCKING ISSUES

None

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-22T21:10:00Z
- **Completed:** 2026-03-22T21:25:00Z
- **Tasks:** 3 (2 auto, 1 auto-approved checkpoint)
- **Files modified:** 6

## Accomplishments

- HomepageLayout renders pixel-faithful 3-column table: 300px left (TickerSidebar + Right Cube ad), 450px center (BreakingNewsFeed 20 headlines + Center Pos2 ad), remaining right (Left Cube ad)
- Auto-refresh timer fires router.refresh() every 780000ms with proper clearInterval cleanup on unmount — tested with fake timers
- page.tsx replaced with complete homepage rendering HeaderBar + BlueNavBar + OrangeNavBar + HomepageLayout; server component boundary preserved
- pnpm build succeeds, 74/74 tests passing across 12 test suites

## Task Commits

Each task was committed atomically:

1. **Task 1: HomepageLayout 3-column table with auto-refresh** - `9812ef3` (feat)
2. **Task 2: Wire page.tsx with full homepage** - `ffc76c8` (feat)
3. **Task 3: Visual verification** - Auto-approved (yolo/auto_advance mode)

**Plan metadata:** (pending docs commit)

## Files Created/Modified

- `src/components/homepage/HomepageLayout.tsx` - 3-column table layout with auto-refresh useEffect
- `src/components/homepage/HomepageLayout.module.css` - Reserved stub for future homepage styles
- `src/components/homepage/index.ts` - Added HomepageLayout export
- `src/__tests__/HomepageLayout.test.tsx` - Added next/navigation mock for jsdom compatibility
- `src/__tests__/AutoRefresh.test.tsx` - 2 tests: interval fires at 780000ms, clears on unmount
- `src/app/page.tsx` - Replaced foundation shell with complete homepage layout

## Decisions Made

- **Direct sibling imports to avoid circular barrel:** `HomepageLayout.tsx` imports `./BreakingNewsFeed`, `./TickerSidebar`, `./AdSlot` directly instead of via `@/components/homepage` index — prevents circular re-export
- **Lowercase `bgcolor`:** TypeScript strict mode rejects `bgColor` on `<table>` — must use `bgcolor="#000000"` (valid HTML attribute, lowercase in JSX)
- **next/navigation mock in layout tests:** `useRouter` from `next/navigation` throws in jsdom without a mock — added to both `HomepageLayout.test.tsx` and `AutoRefresh.test.tsx`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed bgColor -> bgcolor TypeScript attribute error**
- **Found during:** Task 2 (pnpm build)
- **Issue:** `bgColor="#000000"` on `<Table>` component fails TypeScript strict check — the correct HTML attribute is lowercase `bgcolor`
- **Fix:** Changed `bgColor` to `bgcolor` in HomepageLayout.tsx
- **Files modified:** src/components/homepage/HomepageLayout.tsx
- **Verification:** pnpm build succeeds with 0 TypeScript errors
- **Committed in:** ffc76c8 (Task 2 commit)

**2. [Rule 2 - Missing Critical] Added next/navigation mock to HomepageLayout.test.tsx**
- **Found during:** Task 1 (GREEN phase test run)
- **Issue:** HomepageLayout.test.tsx stub didn't mock `next/navigation` — `useRouter` throws in jsdom without navigation context
- **Fix:** Added `jest.mock("next/navigation", ...)` returning `{ useRouter: () => ({ refresh: jest.fn() }) }`
- **Files modified:** src/__tests__/HomepageLayout.test.tsx
- **Verification:** All 5 HomepageLayout+AutoRefresh tests pass
- **Committed in:** 9812ef3 (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 missing critical)
**Impact on plan:** Both fixes necessary for build correctness and test infrastructure. No scope creep.

## Issues Encountered

- Test runner flag: `pnpm test -- --testPathPattern=...` syntax failed in this Jest version — used `npx jest --testPathPatterns=...` directly for targeted test runs
- Circular import risk: barrel `index.ts` re-exports all homepage components including HomepageLayout; HomepageLayout must import siblings directly to avoid circular dependency

## Known Stubs

- `src/components/homepage/HomepageLayout.module.css` - Empty CSS module (reserved comment only). No styles are in this file — all layout uses inline styles matching Rotter's HTML attribute pattern. Intentional per plan design.

## User Setup Required

None - no external service configuration required.

## Test Health Snapshot

- **Total tests:** 74
- **Passed (no retries):** 74
- **Failed:** 0
- **Flaky fixed this plan:** 0
- **Coverage:** Not measured (component tests)

## Next Phase Readiness

- Homepage complete and building — ready for Phase 03 (Forum page)
- HomepageLayout pattern (3-column table, client boundary, auto-refresh) established as template for forum/thread pages
- All 74 tests green, build succeeds

## Self-Check: PASSED

All created files verified present. All task commits verified in git log.

---
*Phase: 02-homepage*
*Completed: 2026-03-22*
