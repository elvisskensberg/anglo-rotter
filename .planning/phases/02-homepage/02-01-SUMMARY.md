---
phase: 02-homepage
plan: 01
subsystem: ui
tags: [react, css-modules, seed-data, components, homepage, rotter]

requires:
  - phase: 01-foundation-and-design-system
    provides: CSS design tokens (--rotter-* vars), Table component, identity-obj-proxy test setup

provides:
  - src/data/homepage-seed.ts with HomepageSeedItem, TickerSeedItem types and 20+10 seed items
  - BreakingNewsFeed component (center column breaking news feed)
  - TickerSidebar component (left sidebar scrolling ticker 300x430px)
  - AdSlot component (reusable ad placeholder with exact pixel dimensions)
  - src/components/homepage/index.ts barrel export

affects:
  - 02-homepage plan 02 (HomepageLayout composition)
  - Any page that needs breaking news or sidebar ticker

tech-stack:
  added: []
  patterns:
    - "CSS Modules with var(--rotter-*) tokens for all colors/sizes"
    - "identity-obj-proxy returns class names as strings for toHaveClass assertions"
    - "TDD: write test stubs first (red), then implement (green)"
    - "Barrel export pattern at src/components/homepage/index.ts"

key-files:
  created:
    - src/data/homepage-seed.ts
    - src/components/homepage/BreakingNewsFeed.tsx
    - src/components/homepage/BreakingNewsFeed.module.css
    - src/components/homepage/TickerSidebar.tsx
    - src/components/homepage/TickerSidebar.module.css
    - src/components/homepage/AdSlot.tsx
    - src/components/homepage/index.ts
    - src/__tests__/HomepageLayout.test.tsx
    - src/__tests__/BreakingNewsFeed.test.tsx
    - src/__tests__/TickerSidebar.test.tsx
    - src/__tests__/AdSlot.test.tsx
  modified: []

key-decisions:
  - "HOMEPAGE_SEED uses extractTime() helper to derive HH:MM from date strings like '22/03/2026 18:42' — returns '00:00' if no time portion present"
  - "TickerSidebar is self-contained: imports TICKER_SEED internally rather than accepting props, matching Rotter's static ticker widget approach"
  - "AdSlot uses inline styles for width/height (dynamic from props) while CSS module handles static styling where applicable"
  - "HomepageLayout test stub remains red intentionally — HomepageLayout component is built in Plan 02"

patterns-established:
  - "Component test stubs written first (red), components implemented second (green) — TDD discipline"
  - "CSS module class names tested via identity-obj-proxy: container.querySelectorAll('span.timeLabel') works because proxy returns 'timeLabel' as class name"
  - "Seed data file at src/data/ acts as typed data contract between backend (future) and frontend components"

requirements-completed: [HOME-01, HOME-02, HOME-03, HOME-05]

duration: 5min
completed: 2026-03-22
---

# Phase 02 Plan 01: Homepage Leaf Components Summary

**Typed seed data (20 real headlines + 10 ticker items) and 3 homepage leaf components (BreakingNewsFeed, TickerSidebar, AdSlot) with CSS Modules using var(--rotter-*) tokens**

## BLOCKING ISSUES

None

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-22T21:01:33Z
- **Completed:** 2026-03-22T21:06:03Z
- **Tasks:** 4 completed
- **Files modified:** 11 created

## Accomplishments

- Created typed seed data file with 20 real headlines from `scoops1_2026-03-22.json` snapshot, plus 10 ticker items
- Built BreakingNewsFeed with red timestamps (9pt bold) and navy headline links (10pt) matching DESIGN_SPECIFICATION.md section 2
- Built TickerSidebar as 300x430px scrollable div with `diegoTitle`/`diegoContent` CSS module classes
- Built AdSlot reusable placeholder with exact pixel dimensions and 1px solid gray border
- All 10 component tests pass green; HomepageLayout stub remains red (expected, Plan 02 builds it)

## Task Commits

Each task was committed atomically:

1. **Task 0a: Seed data and HomepageLayout test stub** - `cacad16` (feat)
2. **Task 0b: Component test stubs** - `7a16d1c` (test)
3. **Task 1a: BreakingNewsFeed component** - `123545a` (feat)
4. **Task 1b: TickerSidebar, AdSlot, barrel export** - `6146566` (feat)

## Files Created/Modified

- `src/data/homepage-seed.ts` - HomepageSeedItem, TickerSeedItem types, HOMEPAGE_SEED (20 items), TICKER_SEED (10 items)
- `src/components/homepage/BreakingNewsFeed.tsx` - Center column breaking news feed component
- `src/components/homepage/BreakingNewsFeed.module.css` - CSS module with timeLabel (red 9pt) and headlineLink (navy 10pt)
- `src/components/homepage/TickerSidebar.tsx` - Left sidebar 300x430px scrollable ticker
- `src/components/homepage/TickerSidebar.module.css` - CSS module with diegoTitle (red 10pt) and diegoContent (navy 8pt)
- `src/components/homepage/AdSlot.tsx` - Reusable ad placeholder (dynamic width/height props, gray border)
- `src/components/homepage/index.ts` - Barrel export for all 3 components
- `src/__tests__/HomepageLayout.test.tsx` - Layout test stub (red - Plan 02)
- `src/__tests__/BreakingNewsFeed.test.tsx` - 4 tests (green)
- `src/__tests__/TickerSidebar.test.tsx` - 3 tests (green)
- `src/__tests__/AdSlot.test.tsx` - 3 tests (green)

## Decisions Made

- Used `extractTime()` helper to parse HH:MM from date strings — date fields like "22/03/2026 18:42" yield "18:42", bare dates yield "00:00"
- TickerSidebar hardcodes TICKER_SEED import (self-contained) rather than accepting props — matches Rotter's static widget approach; Plan 02 can refactor if dynamic data needed
- AdSlot uses inline styles for dynamic width/height from props; no hardcoded hex values in CSS modules

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `pnpm test -- --testPathPattern=HomepageLayout` returned "No tests found" due to `--` argument forwarding behavior on Windows. Running `pnpm test` without path pattern correctly picks up all test files. No fix needed.

## Known Stubs

None — all components render their actual intended output. Seed data uses real scraped headlines (dev seeding only).

## Test Health Snapshot

- **Total tests:** 72
- **Passed (no retries):** 69
- **Failed:** 3 (HomepageLayout — expected red, component built in Plan 02)
- **Flaky fixed this plan:** 0
- **Coverage:** Not measured

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plan 02 can import `{ BreakingNewsFeed, TickerSidebar, AdSlot }` from `@/components/homepage`
- Plan 02 needs to create `HomepageLayout` component to make the 3 HomepageLayout tests go green
- HomepageLayout should wrap components in a `<table width="1012" style="table-layout:fixed">` with 3 `<td>` cells (300px left, 450px center, auto right)

---
*Phase: 02-homepage*
*Completed: 2026-03-22*
