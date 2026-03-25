---
phase: "03-forum-listing"
plan: "03"
subsystem: "forum-listing"
tags: ["forum", "tooltip", "pagination", "client-component", "route"]
dependency_graph:
  requires: ["03-01", "03-02"]
  provides: ["ForumThreadTable", "forum-barrel", "/forum/[forumId]"]
  affects: ["src/components/forum", "src/app/forum"]
tech_stack:
  added: []
  patterns:
    - "Client boundary at ForumThreadTable (matches Phase 2 HomepageLayout pattern)"
    - "Fixed-position tooltip with pointer-events: none (prevents mouse event capture)"
    - "Direct sibling imports to avoid circular barrel dependency"
    - "Styled <span> instead of deprecated <font> for TypeScript compatibility"
key_files:
  created:
    - "src/components/forum/ForumThreadTable.tsx"
    - "src/components/forum/ForumThreadTable.module.css"
    - "src/components/forum/index.ts"
    - "src/app/forum/[forumId]/page.tsx"
  modified:
    - "src/__tests__/ForumThreadTable.test.tsx"
decisions:
  - "Replace <font> elements with styled <span> — TypeScript strict mode rejects legacy HTML elements in JSX"
  - "Server component page.tsx passes full FORUM_SEED; ForumThreadTable handles client-side category filtering"
  - "Next.js 15 async params awaited in server component (Promise<{ forumId: string }>)"
metrics:
  duration: "7 minutes"
  completed_date: "2026-03-22T21:50:03Z"
  tasks_completed: 2
  files_created: 4
  files_modified: 1
---

# Phase 03 Plan 03: ForumThreadTable, Barrel, and Route Summary

## BLOCKING ISSUES

None

## One-Liner

ForumThreadTable orchestrator with mouse-following tooltip, client-side pagination, section filtering, barrel export, and `/forum/[forumId]` server route — all 121 tests pass, build succeeds.

## What Was Built

### Task 1: ForumThreadTable orchestrator (TDD)

**`src/components/forum/ForumThreadTable.tsx`** — `'use client'` component owning three state domains:

1. **Tooltip state** (`visible`, `x`, `y`, `title`, `excerpt`) — mouse-following fixed-position overlay rendered only when `visible: true`. `handleMouseMove` tracks cursor position + 15px offset; `handleIconEnter` / `handleIconLeave` toggle visibility.

2. **Pagination state** (`currentPage`, `rowsPerPage`) — default 30 rows. `handleRowsPerPageChange` resets page to 1 on change (Pitfall 3). Derived: `filteredThreads`, `totalPages`, `pageThreads`.

3. **Section filter state** (`selectedCategory`) — default `'scoops'`. `handleCategoryChange` resets page to 1 on change.

**Render structure:**
```
ForumSectionDropdown (section filter)
ForumToolbar (Login/Help/Search/Post icons)
breadcrumb table (Forums > Section, blue #3293CD)
tooltip overlay (fixed, pointer-events: none)
thread table (6-column header + ThreadRow[] for current page)
PaginationBar (page numbers + rows-per-page)
```

**`src/components/forum/ForumThreadTable.module.css`** — tooltip CSS:
- `.tooltip`: `position: fixed; z-index: 4; width: 350px; pointer-events: none`
- `.tooltipHeader`: `background-color: var(--rotter-tooltip-header)` (#7D92A9), white bold text, 10pt
- `.tooltipBody`: `background-color: var(--rotter-tooltip-content)` (#e6f2ff), black text, 9pt

### Task 2: Barrel export and forum route

**`src/components/forum/index.ts`** — barrel exporting all 5 forum components: ForumThreadTable, ThreadRow, ForumToolbar, PaginationBar, ForumSectionDropdown.

**`src/app/forum/[forumId]/page.tsx`** — server component (no `'use client'`). Awaits Next.js 15 async params, renders `HeaderBar + BlueNavBar + OrangeNavBar` layout shell + `ForumThreadTable` with full `FORUM_SEED`. The `/forum/[forumId]` route is registered as a dynamic server-rendered route.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Replaced `<font>` elements with styled `<span>` for TypeScript compatibility**
- **Found during:** Task 2 build verification
- **Issue:** TypeScript strict mode rejects `<font>` as not in `JSX.IntrinsicElements`. The plan specified `<font face="Arial" color="...">` for the breadcrumb and column header rows, matching Rotter's original HTML. The build failed with: `Property 'font' does not exist on type 'JSX.IntrinsicElements'`.
- **Fix:** Replaced all `<font>` elements with `<span style={{ fontFamily: "Arial", color: "...", fontSize: "small" }}>`. Semantically equivalent output.
- **Files modified:** `src/components/forum/ForumThreadTable.tsx`
- **Commit:** part of `1e93d0a`

## Test Health Snapshot

- **Total tests:** 121
- **Passed (no retries):** 121
- **Failed:** 0
- **Flaky fixed this plan:** 0
- **Test suites:** 17

## Self-Check: PASSED

All files verified present:
- FOUND: src/components/forum/ForumThreadTable.tsx
- FOUND: src/components/forum/ForumThreadTable.module.css
- FOUND: src/components/forum/index.ts
- FOUND: src/app/forum/[forumId]/page.tsx
- FOUND: src/__tests__/ForumThreadTable.test.tsx
- FOUND: .planning/phases/03-forum-listing/03-03-SUMMARY.md

All commits verified present:
- 3c08f88: test(03-03): add failing tests for ForumThreadTable
- b75f6a7: feat(03-03): implement ForumThreadTable orchestrator with tooltip and pagination
- 1e93d0a: feat(03-03): add forum barrel export and /forum/[forumId] route page
