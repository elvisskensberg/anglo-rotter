---
phase: 05-news-flash-page
plan: 01
subsystem: ui
tags: [news, seed-data, typescript, jest, wave-0-tdd]

requires:
  - phase: 04-thread-page
    provides: "forum seed data pattern (forum-seed.ts interface) and test patterns used as reference"

provides:
  - "NewsItem interface and NewsCategory type exported from src/data/news-seed.ts"
  - "NEWS_SEED array with 32 typed items across 4 categories (news, sports, economy, tech)"
  - "Wave 0 test stubs for NewsPageLayout, NewsCategoryTabs, NewsTable — failing at import awaiting Plan 02"
  - "BlueNavBar News Flashes link corrected to /news route"

affects: [05-02-news-page-components]

tech-stack:
  added: []
  patterns: ["Wave 0 TDD stubs: import fails at @/components/news until Plan 02 creates the barrel export"]

key-files:
  created:
    - src/data/news-seed.ts
    - src/__tests__/news-seed.test.ts
    - src/__tests__/NewsPageLayout.test.tsx
    - src/__tests__/NewsCategoryTabs.test.tsx
    - src/__tests__/NewsTable.test.tsx
  modified:
    - src/components/layout/BlueNavBar.tsx

key-decisions:
  - "NewsItem.sourceIcon stores hex color string (e.g. #2a9d8f) as colored circle placeholder — no actual image assets needed until Plan 02+"
  - "Wave 0 test stubs import from @/components/news barrel — module does not exist yet, intentional fail-at-import behavior"
  - "BlueNavBar updated to /news before the route exists — prevents stale link when Plan 02 creates src/app/news/page.tsx"

patterns-established:
  - "Wave 0 stub pattern: test files import from non-existent barrel @/components/news, fail at import (not at test logic), providing clear TDD RED signal for Plan 02"

requirements-completed: [NEWS-01, NEWS-02, NEWS-03, NEWS-04]

duration: 3min
completed: 2026-03-22
---

# Phase 5 Plan 01: News Flash Page — Data Foundation Summary

**NewsItem type contract with 32 seed items across 4 categories, Wave 0 TDD stubs for 3 news components, and BlueNavBar /news link fix**

## BLOCKING ISSUES

None

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-22T22:41:52Z
- **Completed:** 2026-03-22T22:44:25Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Created `NewsItem` interface and `NEWS_SEED` array (32 items, 8 per category: news/sports/economy/tech) with 8 distinct sources and hex color icons
- Created Wave 0 test stubs for NewsPageLayout (5 tests), NewsCategoryTabs (4 tests), and NewsTable (6 tests) — all fail at import awaiting Plan 02
- Fixed BlueNavBar "News Flashes" link from `/news-flashes` to `/news`, all NavBar tests pass

## Task Commits

1. **Task 1: NewsItem interface + seed data + seed tests** - `e13c061` (feat)
2. **Task 2: Wave 0 test stubs** - `c9a0c2e` (test)
3. **Task 3: Fix BlueNavBar link** - `13eda9e` (fix)

## Files Created/Modified

- `src/data/news-seed.ts` - NewsItem interface, NewsCategory type, NEWS_CATEGORIES const, NEWS_SEED array (32 items)
- `src/__tests__/news-seed.test.ts` - 6 seed integrity tests (all pass green)
- `src/__tests__/NewsPageLayout.test.tsx` - 5 Wave 0 stubs for NEWS-01 and NEWS-04
- `src/__tests__/NewsCategoryTabs.test.tsx` - 4 Wave 0 stubs for NEWS-02
- `src/__tests__/NewsTable.test.tsx` - 6 Wave 0 stubs for NEWS-03
- `src/components/layout/BlueNavBar.tsx` - href updated from /news-flashes to /news

## Decisions Made

- `NewsItem.sourceIcon` stores hex color string as colored circle placeholder; no image assets needed until content is wired in a future plan
- Wave 0 stubs import from `@/components/news` (barrel that does not exist yet) — intentional fail-at-import TDD RED pattern
- BlueNavBar corrected pre-emptively before the /news route exists to prevent stale link post-Plan 02

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None — no external service configuration required.

## Test Health Snapshot

- **Total tests (non-Wave-0):** 183 passed
- **Wave 0 suites failing (expected):** 3 (NewsPageLayout, NewsCategoryTabs, NewsTable — all fail at import)
- **Failed (non-Wave-0):** 0
- **Flaky fixed this plan:** 0

## Self-Check: PASSED

All 5 task files found. All 3 task commits verified (e13c061, c9a0c2e, 13eda9e).

## Next Phase Readiness

- Plan 02 can immediately implement the 3 news components: NewsPageLayout, NewsCategoryTabs, NewsTable
- All Wave 0 tests are in place; Plan 02 must create `src/components/news/index.ts` barrel with these 3 exports to flip from RED to GREEN
- BlueNavBar already points to `/news` — Plan 02 creates `src/app/news/page.tsx` to complete the route

---
*Phase: 05-news-flash-page*
*Completed: 2026-03-22*
