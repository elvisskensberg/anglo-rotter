---
phase: 07-data-layer-and-content-pipeline
plan: 02
subsystem: api-routes
tags: [api, drizzle, turso, next-js, route-handlers]
dependency_graph:
  requires: [07-01]
  provides: [GET /api/forums/[forumId], GET /api/threads/[threadId], GET /api/news]
  affects: [src/app/forum/[forumId]/page.tsx, src/app/thread/[threadId]/page.tsx, src/app/news/page.tsx]
tech_stack:
  added: []
  patterns: [Next.js 15 route handlers, Drizzle ORM queries, Unix timestamp formatting]
key_files:
  created:
    - src/app/api/forums/[forumId]/route.ts
    - src/app/api/threads/[threadId]/route.ts
    - src/app/api/news/route.ts
  modified: []
decisions:
  - "Import ThreadData/ThreadPost/ReplyTreeItem from @/data/thread-seed (interfaces already exported there) — avoids duplication"
  - "BFS depth map computed inline in thread route using same algorithm as thread-seed.ts buildDepthMap"
  - "FORUM_SECTION_NAMES map hardcoded in thread route — same set as existing forum IDs in schema"
  - "News category cast as NewsItem['category'] — DB stores string, type system needs union type"
metrics:
  duration: "~2 minutes"
  completed_date: "2026-03-24"
  tasks_completed: 2
  files_created: 3
  files_modified: 0
---

# Phase 07 Plan 02: API Route Handlers Summary

## BLOCKING ISSUES

None

## One-liner

Three Next.js 15 GET route handlers serving forum threads, thread detail with posts, and news items from Turso via Drizzle ORM.

## What Was Built

### Task 1: GET /api/forums/[forumId]

`src/app/api/forums/[forumId]/route.ts` — queries the `threads` table filtered by `forumId`, ordered by `createdAt` descending. Transforms each DB row into a `ForumListing` shape matching the existing `ForumThread` interface in `forum-seed.ts`. Formats Unix timestamps (ms) to `DD.MM.YY` / `HH:MM` strings. Returns `{ threads: ForumListing[], total: number }`.

### Task 2a: GET /api/threads/[threadId]

`src/app/api/threads/[threadId]/route.ts` — fetches the thread row, all posts ordered by `postNumber`, and the author's user profile. Computes reply nesting depth via BFS over `parentId` chains (same algorithm as `buildDepthMap` in thread-seed). Assembles `ThreadData` shape: original post as `ThreadPost` and replies as `ReplyTreeItem[]` (depth > 0). Returns 404 for unknown thread IDs, 400 for invalid IDs, 500 on DB errors.

### Task 2b: GET /api/news

`src/app/api/news/route.ts` — reads optional `?category=` query param and conditionally filters `newsItems` table. Orders by `publishedAt` descending. Formats timestamps to `HH:MM DD/MM` display string matching `NewsItem.time` field. Returns `{ items: NewsItem[] }`.

## Deviations from Plan

None — plan executed exactly as written.

## Verification Results

- `npx tsc --noEmit` passes with zero errors
- All three route files exist and export GET functions
- Each route imports from `@/db` (db client) and `@/db/schema` (table references)
- Forums route returns `ForumListing[]` matching `ForumThread` interface
- Thread route returns `ThreadData`-compatible shape with `post` and `replies`
- Thread route returns 404 when thread not found
- News route supports `?category=` filtering
- News route returns `{ items: NewsItem[] }`

## Commits

- `0c5eb02` feat(07-02): add GET /api/forums/[forumId] route handler
- `b12f33d` feat(07-02): add GET /api/threads/[threadId] and GET /api/news route handlers

## Self-Check

1. Verified: YES — TypeScript passes zero errors; all three files exist on disk confirmed by `test -f` checks; GET exports confirmed by grep.
2. Correct source: YES — this is a code-creation task, no prod/E2E evidence required.
3. Deltas investigated: N/A — no comparisons were made.
4. All substeps: YES — forums route created and committed (Task 1), thread + news routes created and committed (Task 2).
5. Artifacts exist: YES — `test -f` passed for all three route files.
6. DATA verdicts: No DATA classifications used.
7. Hostile reviewer: YES — TypeScript compile pass is objective evidence; file existence is verified; GET exports are grep-confirmed.

## Self-Check: PASSED
