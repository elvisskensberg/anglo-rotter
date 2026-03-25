---
phase: 04-thread-page
plan: 01
subsystem: ui
tags: [thread, seed-data, typescript, jest, tdd]

requires:
  - phase: 03-forum-listing
    provides: ForumThread interface pattern, test factory pattern (makeThread), ForumSeed structure

provides:
  - ThreadData, ThreadPost, ReplyTreeItem TypeScript interfaces (src/data/thread-seed.ts)
  - THREAD_SEED array with 2 real threads (940165: 35 replies / depth 6; 940099: 6 replies / depth 2)
  - buildDepthMap() BFS helper for pre-computing reply depth from reply_to chains
  - Wave 0 RED test stubs for 6 thread components covering THRD-01 through THRD-08

affects:
  - 04-02 (component implementation — all 6 stub test files must turn GREEN)
  - 04-03 (route assembly — uses ThreadData type and THREAD_SEED)
  - 04-04 (ThreadPageClient — ThreadPageClient.test.tsx todos become real assertions)

tech-stack:
  added: []
  patterns:
    - "buildDepthMap(): BFS helper computes depth from reply_to chains; stored as pre-computed flat field in ReplyTreeItem"
    - "Wave 0 TDD: test stubs created before components, all FAIL with Cannot find module (RED state)"
    - "transliterateAuthor(): maps Hebrew usernames to Latin equivalents for English-locale seed data"

key-files:
  created:
    - src/data/thread-seed.ts
    - src/__tests__/thread-seed.test.ts
    - src/__tests__/ThreadBreadcrumb.test.tsx
    - src/__tests__/OriginalPostBlock.test.tsx
    - src/__tests__/ActionButtons.test.tsx
    - src/__tests__/ReplyTree.test.tsx
    - src/__tests__/QuickReplyForm.test.tsx
    - src/__tests__/ThreadPageClient.test.tsx
  modified: []

key-decisions:
  - "ThreadData MUST include title: string — RESEARCH.md snippet omitted it but CONTEXT.md locked decisions are authoritative"
  - "Depth computation via BFS in buildDepthMap() at seed-build time, not at render time — avoids O(n^2) lookups in components"
  - "ReplyTreeItem.depth starts at 1 for top-level replies (depth 0 reserved for original post, not in replies array)"
  - "Hebrew author names transliterated via lookup table; fallthrough keeps Latin names unchanged (barry white, Sarek, etc.)"
  - "ThreadPageClient.test.tsx uses test.todo for the 2 toggle assertions — Plan 04-04 fills them after component implementation"

patterns-established:
  - "makeThreadPost() / makeReplyItem() / makeThreadData() test factory pattern for thread component tests"
  - "Wave 0 RED: import non-existent components → FAIL with Cannot find module; Wave N GREEN: implement components"

requirements-completed: [THRD-01, THRD-02, THRD-03, THRD-04, THRD-05, THRD-06, THRD-07, THRD-08]

duration: 18min
completed: 2026-03-22
---

# Phase 04 Plan 01: Thread Seed Data and Wave 0 Test Stubs Summary

**ThreadData/ThreadPost/ReplyTreeItem interfaces with THREAD_SEED (940165: 35 replies, depth 6) and 6 Wave 0 RED test stubs covering all 8 THRD requirements**

## BLOCKING ISSUES

None

## Performance

- **Duration:** 18 min
- **Started:** 2026-03-22T22:00:00Z
- **Completed:** 2026-03-22T22:17:22Z
- **Tasks:** 2 of 2
- **Files modified:** 8

## Accomplishments

- TypeScript interfaces (ThreadData, ThreadPost, ReplyTreeItem) exported from thread-seed.ts with full JSDoc
- THREAD_SEED populated with real scraped data: thread 940165 (35 replies, depth 6 chain: post 5→31→32→33→34→35) and thread 940099 (6 replies, depth 2)
- buildDepthMap() BFS helper pre-computes depths from reply_to chains — avoids O(n^2) at render time
- 29 seed validation tests all pass (thread-seed.test.ts GREEN)
- 6 Wave 0 test stub files created, all FAIL with "Cannot find module" (expected RED state before component implementation)
- Test stubs cover all 8 THRD requirements with 26 concrete assertions + 2 test.todo stubs

## Task Commits

1. **Task 1: Create thread-seed.ts with types and seed data** - `fd23ef4` (feat)
2. **Task 2: Create Wave 0 test stubs for all thread components** - `de92721` (test)

## Files Created/Modified

- `src/data/thread-seed.ts` — ThreadData, ThreadPost, ReplyTreeItem interfaces + THREAD_SEED (2 threads) + buildDepthMap() helper
- `src/__tests__/thread-seed.test.ts` — 29 seed validation tests (GREEN)
- `src/__tests__/ThreadBreadcrumb.test.tsx` — THRD-08 stubs (4 tests, RED)
- `src/__tests__/OriginalPostBlock.test.tsx` — THRD-01, THRD-02 stubs (8 tests, RED)
- `src/__tests__/ActionButtons.test.tsx` — THRD-03 stubs (3 tests, RED)
- `src/__tests__/ReplyTree.test.tsx` — THRD-04, THRD-05, THRD-06 stubs (7 tests, RED)
- `src/__tests__/QuickReplyForm.test.tsx` — THRD-07 stubs (3 tests, RED)
- `src/__tests__/ThreadPageClient.test.tsx` — THRD-07 toggle integration (1 test + 2 test.todo, RED)

## Decisions Made

- ThreadData.title is mandatory (CONTEXT.md locked decisions override RESEARCH.md snippet that omitted it)
- BFS depth computation at seed-build time, stored as flat pre-computed field — component renders a simple `.map()` with no recursion
- Hebrew author names transliterated via lookup table in transliterateAuthor(); Latin usernames (barry white, Sarek, etc.) pass through unchanged
- ReplyTreeItem.depth = 1 for top-level replies (direct reply to post_number 0); the original post itself is not in the replies array
- ThreadPageClient.test.tsx toggle assertions deferred to test.todo — Plan 04-04 will fill them after ThreadPageClient is implemented

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

Jest CLI option `--testPathPattern` was replaced by `--testPathPatterns` in Jest 30. Used positional pattern argument `npx jest "pattern"` instead, which works correctly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- thread-seed.ts data contract is stable — Plans 04-02, 04-03, 04-04 can import ThreadData/ThreadPost/ReplyTreeItem directly
- All 6 test stubs in expected RED state — Plan 04-02 implements components and turns them GREEN
- The deep chain test (posts 5→31→32→33→34→35 reaching depth 6) will validate ReplyTree indentation rendering

---
*Phase: 04-thread-page*
*Completed: 2026-03-22*
