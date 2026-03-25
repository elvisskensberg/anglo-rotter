---
phase: 09-authentication-and-user-features
plan: "04"
subsystem: api
tags: [better-auth, drizzle, sqlite, nextjs, forum, threads, replies]

requires:
  - phase: 09-01
    provides: Better Auth setup, DB schema with threads/posts/user tables
  - phase: 09-02
    provides: Login/registration pages, auth-client useSession hook
  - phase: 09-03
    provides: User profile foundation

provides:
  - POST /api/threads — authenticated thread creation endpoint
  - POST /api/threads/[threadId]/replies — authenticated reply creation endpoint
  - NewThreadForm component — auth-aware form for creating new threads
  - /forum/[forumId]/new page — new thread submission page with Rotter chrome
  - QuickReplyForm updated — now auth-aware with login prompt for guests
  - ForumToolbar updated — Post links to /forum/[forumId]/new, Login links to /auth/login

affects: [thread-page, forum-listing, future-moderation]

tech-stack:
  added: []
  patterns:
    - "Auth-aware forms: useSession + login prompt for guests, form for authenticated users"
    - "Server-side auth via auth.api.getSession({ headers: request.headers })"
    - "Optimistic thread ID from Date.now() for immediate redirect after thread creation"

key-files:
  created:
    - src/app/api/threads/route.ts
    - src/app/api/threads/[threadId]/replies/route.ts
    - src/components/forum/NewThreadForm.tsx
    - src/components/forum/NewThreadForm.module.css
    - src/app/forum/[forumId]/new/page.tsx
  modified:
    - src/components/thread/QuickReplyForm.tsx
    - src/components/thread/ThreadPageClient.tsx
    - src/components/forum/ForumToolbar.tsx
    - src/components/forum/ForumThreadTable.tsx
    - src/app/forum/[forumId]/page.tsx

key-decisions:
  - "Used Date.now() as thread ID for immediate redirect to new thread after creation"
  - "window.location.reload() as reply submit callback — simplest way to refresh reply tree without React state re-hydration"
  - "ForumToolbar accepts optional forumId prop — backward compatible, falls back to /forum if not provided"
  - "ForumThreadTable passes forumId to ForumToolbar — requires forum page to pass forumId down"

patterns-established:
  - "Auth gate pattern: useSession() in client components, auth.api.getSession() in API routes"
  - "Login prompt pattern: if no session render login link, else render form"

requirements-completed: [USER-01, USER-02]

duration: 4min
completed: 2026-03-24
---

# Phase 09 Plan 04: Thread Posting and Reply Submission Summary

**POST /api/threads and POST /api/threads/[threadId]/replies — authenticated thread creation and reply submission with auth-aware client forms**

## BLOCKING ISSUES

None

## Performance

- **Duration:** ~4 min
- **Started:** 2026-03-24T19:15:17Z
- **Completed:** 2026-03-24T19:19:23Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- POST /api/threads: creates new threads, validates auth + input, increments user postCount
- POST /api/threads/[threadId]/replies: creates replies, updates thread stats (replyCount, lastReplyAt, lastReplyAuthor), increments user postCount
- NewThreadForm with auth-awareness — guests see login prompt, authenticated users see full form with title + content
- /forum/[forumId]/new page with full Rotter page chrome (HeaderBar, BlueNavBar, OrangeNavBar)
- QuickReplyForm updated from static stub to auth-aware interactive form with submission logic
- ForumToolbar Post icon links to `/forum/[forumId]/new`, Login icon links to `/auth/login`

## Task Commits

Each task was committed atomically:

1. **Task 1: Thread creation API + form + forum toolbar link** - `dd943ca` (feat)
2. **Task 2: Reply API + QuickReplyForm auth integration** - `b1f6fba` (feat)

**Plan metadata:** TBD (docs: complete plan)

## Files Created/Modified

- `src/app/api/threads/route.ts` — POST endpoint for thread creation with auth + validation
- `src/app/api/threads/[threadId]/replies/route.ts` — POST endpoint for reply creation with thread stat updates
- `src/components/forum/NewThreadForm.tsx` — Client form component with useSession auth check
- `src/components/forum/NewThreadForm.module.css` — Retro Rotter-style form CSS
- `src/app/forum/[forumId]/new/page.tsx` — New thread page with full page chrome
- `src/components/thread/QuickReplyForm.tsx` — Updated with auth awareness, submission logic, error handling
- `src/components/thread/ThreadPageClient.tsx` — Pass threadId prop to QuickReplyForm
- `src/components/forum/ForumToolbar.tsx` — Accept forumId prop, fix Login/Post links
- `src/components/forum/ForumThreadTable.tsx` — Pass forumId down to ForumToolbar
- `src/app/forum/[forumId]/page.tsx` — Pass forumId to ForumThreadTable

## Decisions Made

- Used `Date.now()` as thread ID (integer primary key) for immediate redirect after creation — consistent with existing thread seed data pattern
- `window.location.reload()` as the reply success callback — simpler than React state refresh, avoids complex re-hydration
- `ForumToolbar` accepts optional `forumId` for backward compatibility (renders post link as `/forum` if not provided)
- Thread creation and reply both increment `user.postCount` via `sql\`post_count + 1\`` to avoid race conditions

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added forumId prop chain to ForumToolbar**
- **Found during:** Task 1 (ForumToolbar update)
- **Issue:** ForumToolbar is rendered inside ForumThreadTable which doesn't receive forumId, so passing forumId down required updating ForumThreadTable's interface and the forum page call site
- **Fix:** Added optional `forumId` prop to `ForumThreadTable`, passed through to `ForumToolbar`, updated forum page to pass `forumId={forumId}`
- **Files modified:** src/components/forum/ForumThreadTable.tsx, src/app/forum/[forumId]/page.tsx
- **Verification:** Build passes, toolbar items render with correct hrefs
- **Committed in:** dd943ca (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (missing data flow for forumId)
**Impact on plan:** Necessary for ForumToolbar Post link to work. No scope creep.

## Issues Encountered

None — plan executed cleanly.

## Evidence (§16)

- POST /api/threads endpoint created `[CODE:src/app/api/threads/route.ts:1]`
- POST /api/threads/[threadId]/replies endpoint created `[CODE:src/app/api/threads/[threadId]/replies/route.ts:1]`
- NewThreadForm has useSession import and renders login prompt for guests `[CODE:src/components/forum/NewThreadForm.tsx:35]`
- QuickReplyForm has useSession and threadId prop `[CODE:src/components/thread/QuickReplyForm.tsx:1]`
- /forum/[forumId]/new page exists `[CODE:src/app/forum/[forumId]/new/page.tsx:1]`
- pnpm build passes with all routes including /api/threads and /api/threads/[threadId]/replies `[CODE:build-output]`

## Investigation Evidence (§17)

All verdicts PASS — no investigation needed

## User Setup Required

None - no external service configuration required.

## Self-Check

1. Verified: YES — pnpm build passes, routes appear in build output, grep checks pass
2. Correct source: YES — CODE tags used for implementation evidence
3. Deltas investigated: N/A — no comparisons performed
4. All substeps: YES — Task 1 (API + form + toolbar + page) and Task 2 (reply API + QuickReplyForm + ThreadPageClient) complete
5. Artifacts exist: YES — all created files verified by build route listing
6. DATA verdicts: NO DATA used
7. Hostile reviewer: YES — build output shows all 5 new routes, grep confirms auth integration, all file paths verified

## Self-Check: PASSED

## Next Phase Readiness

- Thread creation and reply submission fully wired to DB and auth
- Unauthenticated users see login prompts on both forms
- User postCount tracked on all content creation
- Ready for user profile pages and other remaining auth features

---
*Phase: 09-authentication-and-user-features*
*Completed: 2026-03-24*
