---
phase: 03-forum-listing
plan: 01
subsystem: ui
tags: [forum, seed-data, typescript-interface, tdd, css-modules]

# Dependency graph
requires:
  - phase: 01-foundation-and-design-system
    provides: CSS design tokens (--rotter-* vars), Table component, icon SVG set
  - phase: 02-homepage
    provides: Seed data patterns (homepage-seed.ts), component file organization

provides:
  - ForumThread TypeScript interface (14-field data contract for all forum components)
  - FORUM_SEED array with 66 typed threads and deterministic hot/fire/normal distribution
  - ThreadRow component with 6-column layout and hot thread visual indicators
  - Wave 0 test stubs for ForumToolbar, PaginationBar, ForumThreadTable

affects:
  - 03-02 (ForumThreadTable, ForumToolbar, PaginationBar all import ForumThread)
  - 03-03 (forum route page.tsx uses FORUM_SEED)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - TDD red-green cycle for UI components with table wrapper pattern
    - fabricateStats() deterministic function for seed data engagement metrics
    - CSS var references in inline style for design token usage without CSS classes

key-files:
  created:
    - src/data/forum-seed.ts
    - src/components/forum/ThreadRow.tsx
    - src/components/forum/ThreadRow.module.css
    - src/__tests__/forum-seed.test.ts
    - src/__tests__/ThreadRow.test.tsx
    - src/__tests__/ForumToolbar.test.tsx
    - src/__tests__/PaginationBar.test.tsx
    - src/__tests__/ForumThreadTable.test.tsx
  modified: []

key-decisions:
  - "fabricateStats() uses threadId % 100 for deterministic distribution — IDs must span varied mod values to achieve fire/hot/normal distribution, requiring careful ID selection for extra fabricated threads"
  - "Extra fabricated threads use IDs 800000-800025 to guarantee mod values hit fire (<5) and hot (5-19) ranges that the snapshot IDs (all mod 20+) miss entirely"
  - "Thread icon cell uses onMouseEnter on the <td>, not the <img> — simpler event handling, entire cell area triggers tooltip"
  - "View count formatted with toLocaleString() for readability (1,000 vs 1000)"

patterns-established:
  - "TDD table row test pattern: wrap component in <table><tbody> to satisfy DOM requirements"
  - "Deterministic seed stats: fabricateStats(id) produces same output every run — safe for tests"
  - "CSS var inline style: style={{ color: 'var(--rotter-views-hot)' }} — tested via element.style.color equality"

requirements-completed: [FORUM-01, FORUM-02, FORUM-03]

# Metrics
duration: 6min
completed: 2026-03-22
---

# Phase 03 Plan 01: Forum Seed Data and ThreadRow Summary

**ForumThread 14-field interface, 66-entry FORUM_SEED with deterministic fire/hot/normal distribution, and pixel-accurate 6-column ThreadRow component with CSS-var-based hot indicators**

## BLOCKING ISSUES

None

## Performance

- **Duration:** ~6 min
- **Started:** 2026-03-22T21:30:51Z
- **Completed:** 2026-03-22T21:36:18Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- ForumThread interface exported from `src/data/forum-seed.ts` with exactly 14 typed fields as specified in CONTEXT.md
- FORUM_SEED array contains 66 threads: 50 from scoops1_2026-03-22.json snapshot + 16 fabricated extras covering all 6 categories with controlled mod distribution for fire/hot/normal states
- ThreadRow renders a single `<tr>` with 6 `<td>` cells: icon (thread state SVG), title (55% width, navy bold link), author+date (red time), last reply, reply count (navy bold), views (orange/red bold + fire badge)
- All 4 Wave 0 test stubs created for ForumToolbar, PaginationBar, ForumThreadTable (todo placeholders for Plans 02-03)
- 100 total tests pass (91 assertions + 9 todos); 0 failures

## Task Commits

Each task was committed atomically:

1. **Task 1: ForumThread interface + seed data + Wave 0 test stubs** - `b40b658` (feat)
2. **Task 2: ThreadRow component with hot indicators and alternating colors** - `0ffd815` (feat)

## Files Created/Modified

- `src/data/forum-seed.ts` — ForumThread interface + FORUM_SEED 66-entry array with fabricateStats()
- `src/components/forum/ThreadRow.tsx` — 6-column thread row with getThreadState() and hot indicators
- `src/components/forum/ThreadRow.module.css` — text15bn, text13, authorLink, lastByLink classes
- `src/__tests__/forum-seed.test.ts` — 5 passing tests for interface shape and distribution
- `src/__tests__/ThreadRow.test.tsx` — 12 passing tests covering all behavior specifications
- `src/__tests__/ForumToolbar.test.tsx` — Wave 0 stub (2 todos)
- `src/__tests__/PaginationBar.test.tsx` — Wave 0 stub (3 todos)
- `src/__tests__/ForumThreadTable.test.tsx` — Wave 0 stub (4 todos)

## Decisions Made

- Fabricated extra threads use IDs 800000-800025 to guarantee coverage of mod values < 20 (fire/hot ranges) since all snapshot IDs have mod values 20+ (no overlap with hot/fire buckets)
- Thread icon cell `onMouseEnter`/`onMouseLeave` placed on `<td>` rather than `<img>` for larger interaction area
- `expect()` second argument removed from test assertions (Jest 30 removed it per error message)
- View counts use `toLocaleString()` for thousands separators matching Rotter's display style

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Jest expect() second-argument removal**
- **Found during:** Task 1 (forum-seed tests)
- **Issue:** Jest 29+ removed the message second argument from `expect(value, message)` — tests threw "Expect takes at most one argument"
- **Fix:** Rewrote assertions to use single-argument form; removed inline field labels from expect calls
- **Files modified:** src/__tests__/forum-seed.test.ts
- **Verification:** All tests pass
- **Committed in:** b40b658

**2. [Rule 1 - Bug] Fixed hot thread distribution — only 7 hot threads instead of required 9**
- **Found during:** Task 1 (forum-seed tests, RED phase)
- **Issue:** All 50 snapshot thread IDs have mod 20+, falling in the normal range only. Initial extra thread IDs (900001-900042) only produced 7 hot+fire threads total, failing the >= 9 hot threshold test
- **Fix:** Changed extra thread IDs to 800000-800025, placing fire threads at 800000-800004 (mod 0-4) and hot threads at 800005-800016 (mod 5-16), guaranteeing >= 5 fire and >= 12 hot
- **Files modified:** src/data/forum-seed.ts
- **Verification:** Tests pass: 5 fire threads, 12 hot threads, 49 normal threads
- **Committed in:** b40b658

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both fixes necessary for test correctness. No scope creep.

## Issues Encountered

- Test path pattern `--testPathPattern="(forum-seed|ForumToolbar|...)"` did not match files on Windows (pattern interpretation issue with parentheses). Ran full test suite instead — all tests visible.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- ForumThread interface is the data contract — all Phase 03 Plan 02 components import from `src/data/forum-seed.ts`
- FORUM_SEED provides 66 typed threads ready for pagination demo (default 30 rows/page = 3 pages)
- ThreadRow is ready to be composed inside ForumThreadTable in Plan 02
- Wave 0 test stubs provide the test structure for Plan 02 implementations

---
*Phase: 03-forum-listing*
*Completed: 2026-03-22*
