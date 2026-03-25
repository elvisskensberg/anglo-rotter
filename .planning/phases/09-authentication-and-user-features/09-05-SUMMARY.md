---
phase: 09-authentication-and-user-features
plan: 05
subsystem: user-profiles-and-ratings
tags: [user-profile, thread-rating, drizzle, better-auth, sqlite]
dependency_graph:
  requires: [09-01]
  provides: [user-profile-page, thread-rating-api, thread-rating-ui]
  affects: [thread-page, db-schema]
tech_stack:
  added: [threadRatings-table, ThreadRating-component, UserProfile-component]
  patterns: [server-component-profile, client-island-rating, upsert-rating]
key_files:
  created:
    - src/app/api/threads/[threadId]/rate/route.ts
    - src/components/thread/ThreadRating.tsx
    - src/app/profile/[userId]/page.tsx
    - src/components/profile/UserProfile.tsx
    - src/components/profile/UserProfile.module.css
  modified:
    - src/db/schema.ts
    - src/components/thread/OriginalPostBlock.tsx
    - src/components/thread/ThreadPageClient.tsx
    - src/__tests__/OriginalPostBlock.test.tsx
decisions:
  - "Use unique() constraint in Drizzle for one-rating-per-user-per-thread enforcement at DB level"
  - "ThreadRating renders read-only img for guests, clickable spans for authenticated users"
  - "Author star stats computed via aggregate query across all author threads after each rating"
metrics:
  duration: "302s (~5 minutes)"
  completed: "2026-03-24"
  tasks_completed: 2
  tasks_total: 2
  files_created: 5
  files_modified: 4
---

# Phase 09 Plan 05: User Profile and Thread Rating Summary

## BLOCKING ISSUES

None

## Objective

User profile page and thread rating system — completing the user features. Users can now see profile stats at `/profile/[userId]` and rate threads 1-5 stars via the interactive ThreadRating component on thread pages.

## Tasks Completed

### Task 1: Thread rating table, API endpoint, and rating component

**Commit:** 10d40ea

Added `threadRatings` SQLite table to schema with a unique constraint on `(userId, threadId)` enforcing one rating per user per thread. Created `POST /api/threads/[threadId]/rate` endpoint that:
- Validates Better Auth session (401 if not authenticated)
- Validates score is integer 1-5
- Upserts rating (updates if user already rated, inserts otherwise)
- Recalculates thread author's `starRating`, `ratersCount`, and `points` from aggregate of all ratings received

Created `ThreadRating` client component:
- Unauthenticated users: read-only star SVG display with raters count and points
- Authenticated users: interactive 1-5 star rating with hover highlight
- Optimistic UI update after successful POST

Updated `OriginalPostBlock` to accept `threadId` prop and render `ThreadRating` instead of static star images. Updated `ThreadPageClient` to pass `threadId`. Updated test file with auth-client mock and `threadId` prop on all renders.

**Files modified:**
- `src/db/schema.ts` — threadRatings table added
- `src/app/api/threads/[threadId]/rate/route.ts` — new POST endpoint
- `src/components/thread/ThreadRating.tsx` — new client component
- `src/components/thread/OriginalPostBlock.tsx` — integrated ThreadRating, added threadId prop
- `src/components/thread/ThreadPageClient.tsx` — pass threadId to OriginalPostBlock
- `src/__tests__/OriginalPostBlock.test.tsx` — add auth mock and threadId prop

### Task 2: User profile page

**Commit:** b1e2f92

Created `/profile/[userId]` server component page that queries the user by ID directly from Drizzle, returns 404 for non-existent users, and renders full Rotter page chrome (HeaderBar, BlueNavBar, OrangeNavBar) with the UserProfile component.

Created `UserProfile` component using table-based layout matching Rotter's aesthetic:
- Username (bold, 16px, #000099)
- Star rating SVG
- Member since date (DD.MM.YY format)
- Post count
- Rating stats: N/5 (ratersCount raters, points points)

**Files created:**
- `src/app/profile/[userId]/page.tsx`
- `src/components/profile/UserProfile.tsx`
- `src/components/profile/UserProfile.module.css`

## Deviations from Plan

None — plan executed exactly as written.

## Verification Results

```
grep "threadRatings" src/db/schema.ts         PASS (table exported)
ls src/app/api/threads/[threadId]/rate/route.ts   PASS
ls src/app/profile/[userId]/page.tsx          PASS
grep "ThreadRating" src/components/thread/OriginalPostBlock.tsx  PASS
grep "useSession" src/components/thread/ThreadRating.tsx         PASS
pnpm build                                    PASS (no errors)
Route /api/threads/[threadId]/rate            PASS (listed in build output)
Route /profile/[userId]                       PASS (listed in build output)
```

## Known Stubs

None — all data flows are wired. The threadRatings table requires a `pnpm db:push` or migration run to exist in the actual SQLite database before the rate endpoint is usable at runtime.

## Self-Check

1. Verified: YES — build output confirms both routes exist; grep checks confirm code patterns
2. Correct source: YES — this is a feature build plan, no production evidence required
3. Deltas investigated: YES — N/A, no comparisons performed
4. All substeps: YES — schema, API, component, profile page, CSS module all completed
5. Artifacts exist:
   - `test -f src/app/api/threads/[threadId]/rate/route.ts` — created, confirmed by git commit
   - `test -f src/components/thread/ThreadRating.tsx` — created, confirmed by git commit
   - `test -f src/app/profile/[userId]/page.tsx` — created, confirmed by git commit
   - `test -f src/components/profile/UserProfile.tsx` — created, confirmed by git commit
6. DATA verdicts: NO DATA used
7. Hostile reviewer: YES — build passes, routes appear in Next.js route manifest, all grep checks return expected patterns

## Self-Check: PASSED
