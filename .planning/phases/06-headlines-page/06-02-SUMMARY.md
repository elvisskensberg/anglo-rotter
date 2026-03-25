---
phase: 06-headlines-page
plan: 02
subsystem: headlines
tags: [headlines, sort-toggle, page-layout, route, tdd]
dependency_graph:
  requires: ["06-01"]
  provides: ["headlines-page-complete", "headlines-sort-toggle"]
  affects: ["src/app/headlines/page.tsx", "src/components/headlines/"]
tech_stack:
  added: []
  patterns: ["client-component-sort-toggle", "two-column-table-layout", "tdd-red-green"]
key_files:
  created:
    - src/components/headlines/HeadlinesTable.tsx
    - src/components/headlines/HeadlinesTable.module.css
    - src/components/headlines/HeadlinesTable.test.tsx
    - src/components/headlines/HeadlinesPageLayout.tsx
    - src/components/headlines/HeadlinesPageLayout.module.css
    - src/components/headlines/HeadlinesPageLayout.test.tsx
    - src/app/headlines/page.tsx
  modified:
    - src/components/headlines/index.ts
decisions:
  - "HeadlinesTable sorts using toSortableDate() helper: converts DD.MM.YY + HH:MM into YYMMDD HH:MM for lexicographic string comparison"
  - "HeadlinesTable imported directly in page.tsx (not via barrel) to avoid client component boundary issues — same pattern as ForumThreadTable"
  - "Inline hex #71B7E6 used for header row background so jsdom toHaveStyle works without CSS var resolution"
  - "Style selector tr[style*=71B7E6] does not work in jsdom (style normalized to rgb) — use firstRow.style.backgroundColor === rgb(113,183,230) instead"
  - "getByText(/Chronological/i) is ambiguous (matches h1 + bold span) — use querySelectorAll('b') + find() for specific toggle element assertion"
metrics:
  duration: "4 minutes"
  completed: "2026-03-24"
  tasks_completed: 2
  files_created: 7
  files_modified: 1
---

# Phase 06 Plan 02: HeadlinesTable, HeadlinesPageLayout, and /headlines Route Summary

HeadlinesTable client component with chronological/by-last-reply sort toggle, HeadlinesPageLayout two-column wrapper, and /headlines route wired with full shared layout chrome and FORUM_SEED data.

## BLOCKING ISSUES

None

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | HeadlinesTable with sort toggle | 1e04633 | HeadlinesTable.tsx, HeadlinesTable.module.css, HeadlinesTable.test.tsx |
| 2 | HeadlinesPageLayout, route page, barrel update | dd26b04 | HeadlinesPageLayout.tsx, HeadlinesPageLayout.module.css, HeadlinesPageLayout.test.tsx, index.ts, src/app/headlines/page.tsx |

TDD RED commits: 2973236 (HeadlinesTable tests), 12e56ee (HeadlinesPageLayout tests)

## What Was Built

**HeadlinesTable** (`src/components/headlines/HeadlinesTable.tsx`)
- `"use client"` component with `sortMode` state ("chronological" | "lastReply")
- `toSortableDate(date, time)` helper converts DD.MM.YY + HH:MM to YYMMDD HH:MM for descending lexicographic sort
- h1 title: "Forum Scoops Headlines — Chronological" or "Forum Scoops Headlines — By Last Reply" (red, bold, 25px)
- Sort toggle: active sort = `<b>` (plain text), inactive sort = orange `<a>` link (#ff6600)
- 4-column table with #71B7E6 header row (white text): expand icon, Titles, Time, Author
- Thread rows via HeadlineRow with alternating isEven

**HeadlinesPageLayout** (`src/components/headlines/HeadlinesPageLayout.tsx`)
- Presentational server component (no "use client")
- Table-based two-column layout: 160px left sidebar + main content area
- Sidebar contains 160x600 ad placeholder div (dashed #f0f0f0 box)
- Children rendered in right column td

**Route** (`src/app/headlines/page.tsx`)
- Server component using HeaderBar, BlueNavBar, OrangeNavBar from layout
- 1012px content width, #FEFEFE background
- HeadlinesPageLayout wraps HeadlinesTable with FORUM_SEED

**Barrel** (`src/components/headlines/index.ts`)
- Added HeadlinesTable and HeadlinesPageLayout exports

## Tests

- HeadlinesTable: 8 tests (header row color, thread rendering, alternating rows, sort toggle default, toggle click, chronological sort, last-reply sort, h1 title update)
- HeadlinesPageLayout: 5 tests (two td cells, sidebar width/valign, ad placeholder, children rendered, valign top)
- Total headlines tests: 38 passing (includes 25 from Plan 01 HeadlineRow)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] jsdom style selector `tr[style*='71B7E6']` does not work**
- **Found during:** Task 1 test GREEN phase
- **Issue:** jsdom normalizes inline hex colors to `rgb(r, g, b)` form. The attribute selector `[style*='71B7E6']` never matches because the style value is `rgb(113, 183, 230)`.
- **Fix:** Changed test to get `firstRow.style.backgroundColor` and check for `rgb(113, 183, 230)` equivalence.
- **Files modified:** HeadlinesTable.test.tsx
- **Commit:** 1e04633 (part of GREEN commit)

**2. [Rule 1 - Bug] `getByText(/Chronological/i)` ambiguous (matches h1 + bold toggle)**
- **Found during:** Task 1 test GREEN phase
- **Issue:** The h1 contains "Chronological" and the sort toggle `<b>` also contains "Chronological", causing `getByText` to throw "Found multiple elements".
- **Fix:** Changed assertion to `querySelectorAll('b')` + `.find(b => b.textContent === 'Chronological')` to target the specific toggle element.
- **Files modified:** HeadlinesTable.test.tsx
- **Commit:** 1e04633 (part of GREEN commit)

## Test Health Snapshot

- **Total tests run:** 38 (headlines suite)
- **Passed (no retries):** 38
- **Failed:** 0
- **Flaky fixed this plan:** 0
- **Coverage:** Not measured (--no-coverage flag used per plan spec)

## Self-Check

1. Verified: YES — ran `npx jest src/components/headlines/ --no-coverage` and got 38 passing; ran `npx next build --webpack` and saw `/headlines` in route listing with exit code 0.
2. Correct source: YES — local build evidence, not prod/E2E (this is a build/unit task, not production validation).
3. Deltas investigated: YES — two test failures during GREEN phase were immediately diagnosed and fixed (no unresolved deltas).
4. All substeps: YES — TDD RED (failing tests committed), GREEN (implementation), acceptance criteria verified, build verified.
5. Artifacts exist: YES — `test -f` checks passed for all 5 key artifacts (HeadlinesTable.tsx, HeadlinesPageLayout.tsx, headlines/page.tsx, both test files).
6. DATA verdicts: N/A — no DATA classifications used.
7. Hostile reviewer: YES — build output shows `/headlines` route listed explicitly, 38 tests pass with 0 failures, acceptance criteria grep checks all returned >= 1.

## Self-Check: PASSED
