---
phase: 07-data-layer-and-content-pipeline
plan: 05
subsystem: data-layer
tags: [api-integration, auto-refresh, page-rewiring, polling]
dependency_graph:
  requires: [07-02]
  provides: [live-data-pages, auto-refresh-hook]
  affects: [homepage, forum-page, thread-page, news-page, headlines-page]
tech_stack:
  added: [useAutoRefresh hook, fetch-based polling]
  patterns: [server-side fetch with fallback, client-side polling via setInterval]
key_files:
  created:
    - src/hooks/useAutoRefresh.ts
  modified:
    - src/app/page.tsx (no changes needed — delegates to HomepageLayout)
    - src/app/forum/[forumId]/page.tsx
    - src/app/thread/[threadId]/page.tsx
    - src/app/news/page.tsx
    - src/app/headlines/page.tsx
    - src/components/homepage/HomepageLayout.tsx
    - src/components/homepage/BreakingNewsFeed.tsx
    - src/components/news/NewsPageLayout.tsx
    - src/components/news/NewsTable.tsx
    - src/components/news/NewsItemRow.tsx
    - src/components/news/NewsCategoryTabs.tsx
    - src/components/forum/ForumThreadTable.tsx
    - src/components/forum/ThreadRow.tsx
    - src/components/headlines/HeadlinesTable.tsx
    - src/components/headlines/HeadlineRow.tsx
    - src/__tests__/BreakingNewsFeed.test.tsx
    - src/__tests__/NewsPageLayout.test.tsx
    - src/__tests__/AutoRefresh.test.tsx
decisions:
  - ForumListing type from @/types/forum used across all forum components (replaces ForumThread from @/data/forum-seed)
  - NewsItem type from @/types/forum used across all news components (replaces from @/data/news-seed)
  - BreakingNewsFeed owns auto-refresh via useAutoRefresh (not HomepageLayout via router.refresh)
  - News page does SSR initial fetch + client-side polling via useAutoRefresh
  - Seed data files retained (not deleted) as they may be needed for tests/fallbacks
metrics:
  duration: "5 minutes"
  completed: "2026-03-24"
  tasks: 2
  files: 18
requirements: [DATA-02, DATA-06]
---

# Phase 07 Plan 05: Page Route Rewiring and Auto-Refresh Summary

**One-liner:** All 5 page routes now fetch live data from API endpoints; BreakingNewsFeed and NewsPageLayout use useAutoRefresh hook for client-side polling at 13-min and 5-min intervals respectively.

## BLOCKING ISSUES

None

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Create useAutoRefresh hook | 0213eaf | src/hooks/useAutoRefresh.ts |
| 2 | Rewire all page routes from seed to API | dc6b7f1 | 5 pages + 10 components |
| Fix | Update AutoRefresh test for new behavior | 2f08597 | src/__tests__/AutoRefresh.test.tsx |

## Acceptance Criteria Verification

- [x] `src/hooks/useAutoRefresh.ts` exists and exports `useAutoRefresh`
- [x] Uses `setInterval` for polling with cleanup via `clearInterval`
- [x] Returns `{ data, isLoading, error, refresh }`
- [x] Has `"use client"` directive
- [x] `src/app/forum/[forumId]/page.tsx` fetches from `/api/forums/[forumId]`
- [x] `src/app/thread/[threadId]/page.tsx` fetches from `/api/threads/[threadId]`
- [x] `src/app/news/page.tsx` fetches from `/api/news`
- [x] `src/app/headlines/page.tsx` fetches from `/api/forums/scoops1`
- [x] `BreakingNewsFeed` uses `useAutoRefresh` with 780000ms interval
- [x] `NewsPageLayout` uses `useAutoRefresh` with 300000ms interval
- [x] No page.tsx file imports from `@/data/forum-seed`, `@/data/thread-seed`, `@/data/news-seed`, or `@/data/homepage-seed`
- [x] TypeScript compilation passes with no errors
- [x] All 236 tests pass

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Type mismatch — ForumThread vs ForumListing**
- **Found during:** Task 2
- **Issue:** `ForumThreadTable`, `HeadlinesTable`, `ThreadRow`, `HeadlineRow` imported `ForumThread` from `@/data/forum-seed` but the API returns `ForumListing` from `@/types/forum`. Types are structurally identical but TypeScript sees them as incompatible.
- **Fix:** Updated all forum component imports to use `ForumListing` from `@/types/forum`.
- **Files modified:** `ForumThreadTable.tsx`, `HeadlinesTable.tsx`, `ThreadRow.tsx`, `HeadlineRow.tsx`
- **Commit:** dc6b7f1

**2. [Rule 1 - Bug] NewsItem type chain — news-seed vs types/forum**
- **Found during:** Task 2
- **Issue:** `NewsTable`, `NewsItemRow`, `NewsCategoryTabs` all imported `NewsItem`/`NewsCategory` from `@/data/news-seed`. After updating `NewsPageLayout` to use `@/types/forum`, TypeScript flagged type incompatibility (category is `string` in types/forum vs narrow union in news-seed).
- **Fix:** Updated all news component imports to use types from `@/types/forum`.
- **Files modified:** `NewsTable.tsx`, `NewsItemRow.tsx`, `NewsCategoryTabs.tsx`
- **Commit:** dc6b7f1

**3. [Rule 1 - Bug] AutoRefresh.test.tsx tested router.refresh instead of fetch polling**
- **Found during:** Post-task full test run
- **Issue:** `AutoRefresh.test.tsx` tested that `HomepageLayout` calls `router.refresh()` on interval. After the refactor, auto-refresh is handled by `BreakingNewsFeed` via `useAutoRefresh` (fetch-based), not `router.refresh`.
- **Fix:** Updated `AutoRefresh.test.tsx` to test `BreakingNewsFeed` calls `fetch()` on 780000ms interval and stops on unmount.
- **Files modified:** `src/__tests__/AutoRefresh.test.tsx`
- **Commit:** 2f08597

**4. [Rule 1 - Bug] BreakingNewsFeed.test.tsx used old `headlines` prop with `HomepageSeedItem[]`**
- **Found during:** TypeScript check
- **Issue:** Tests used `headlines={HOMEPAGE_SEED}` with `HomepageSeedItem[]` type, but new interface uses `initialHeadlines?: ForumListing[]`.
- **Fix:** Updated test to use `initialHeadlines` prop with `ForumListing[]` sample data and mocked `fetch`.
- **Files modified:** `src/__tests__/BreakingNewsFeed.test.tsx`
- **Commit:** dc6b7f1

**5. [Rule 1 - Bug] NewsPageLayout.test.tsx used `items` prop and tested router.refresh**
- **Found during:** TypeScript check
- **Issue:** Tests used `items={NEWS_SEED}` but new interface uses `initialItems?: NewsItem[]`. Also tested `router.refresh()` but now uses `useAutoRefresh` (fetch-based).
- **Fix:** Updated to use `initialItems` prop with mocked `fetch`, verified fetch is called on 300000ms interval.
- **Files modified:** `src/__tests__/NewsPageLayout.test.tsx`
- **Commit:** dc6b7f1

## Architecture Notes

- `HomepageLayout` no longer imports `HOMEPAGE_SEED` or manages auto-refresh itself. It is now a pure layout wrapper.
- `BreakingNewsFeed` is now `"use client"` and self-manages data fetching + polling via `useAutoRefresh`.
- `NewsPageLayout` does SSR initial data pass through `initialItems` prop + client-side polling overlay.
- All forum pages fall back to empty arrays on API errors (with `console.error`), ensuring graceful degradation.
- Thread page uses `notFound()` on API failure (404 is the correct behavior for missing threads).

## Known Stubs

None — all pages now fetch from live API endpoints. The seed data files remain in `@/data/` but are no longer imported by any page or component.

## Test Health Snapshot

- **Total tests:** 236
- **Passed (no retries):** 236
- **Failed:** 0 (must be 0)
- **Flaky fixed this plan:** 0
- **Coverage:** not measured this plan

## Self-Check

1. Verified: YES — TypeScript compiled with 0 errors, all 236 tests pass, grep confirms no seed imports in pages.
2. Correct source: YES — no production evidence needed; this is code wiring, verified by static analysis and unit tests.
3. Deltas investigated: YES — all test failures investigated and fixed before commit.
4. All substeps: YES — hook created, 5 pages rewired, component types updated, tests updated, full test run verified.
5. Artifacts exist: YES — `test -f src/hooks/useAutoRefresh.ts` passes; all modified files verified via git diff.
6. DATA verdicts: N/A — no DATA verdicts used.
7. Hostile reviewer: YES — grep output proves no seed imports remain in pages; test output proves 236/236 pass; TypeScript output proves 0 errors.

## Self-Check: PASSED
