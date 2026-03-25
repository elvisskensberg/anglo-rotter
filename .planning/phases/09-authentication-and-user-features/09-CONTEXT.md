# Phase 9: Authentication and User Features - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase transitions the forum from read-only to interactive. Users can register, log in, post threads, reply to threads, view profiles, and rate threads. Uses Better Auth for session management with email/password.

</domain>

<decisions>
## Implementation Decisions

### Authentication Stack
- Better Auth (latest stable) — TypeScript-first, supports email/password + sessions
- SQLite/libSQL native support (works with existing Turso setup)
- Server-side auth via `src/lib/auth.ts` config
- Client-side auth via Better Auth React hooks
- Session persistence across browser refreshes (cookie-based)
- Auth middleware for protected routes

### Auth Routes & UI
- `/auth/login` — login form (email + password)
- `/auth/register` — registration form (username + email + password)
- Logout button in header (visible when logged in)
- Redirect to previous page after login
- Error display for invalid credentials / duplicate email

### Thread Posting
- `POST /api/threads` — create new thread (requires auth)
- New thread form accessible from forum listing page
- Fields: title, content, forum category
- Thread appears in listing immediately after submission

### Reply System
- `POST /api/threads/[threadId]/replies` — submit reply (requires auth)
- Quick reply form at bottom of thread page
- Full reply with quote support
- Reply appears in tree immediately after submission
- Reply references parent post for threading

### User Profile
- `/profile/[userId]` route
- Displays: username, member since date, total post count, star rating
- Star rating calculated from average of thread ratings received
- Thread rating: other users can rate threads 1-5 stars

### Thread Rating
- `POST /api/threads/[threadId]/rate` — rate thread (requires auth, one rating per user per thread)
- Star display on thread page
- Rating stored in `thread_ratings` table (userId, threadId, score)

### Claude's Discretion
- Better Auth exact configuration options
- Form validation approach (Zod schemas or HTML5 validation)
- CSRF protection details (Better Auth handles this)
- Rate limiting strategy
- Password requirements

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/db/schema.ts` — existing users table (needs auth fields added)
- `src/db/client.ts` — Turso/Drizzle client
- `src/types/forum.ts` — existing type definitions
- `src/components/thread/QuickReplyForm.tsx` — exists but may need auth integration
- Shared layout chrome with header (needs login/logout button)

### Integration Points
- `src/db/schema.ts` — add sessions, accounts tables for Better Auth + thread_ratings table
- `src/lib/auth.ts` — new Better Auth server config
- `src/lib/auth-client.ts` — new Better Auth client
- `src/middleware.ts` — new Next.js middleware for auth protection
- Header components — add login/logout button
- Thread and reply forms — add auth guards

</code_context>

<specifics>
## Specific Ideas

- Better Auth works with Drizzle ORM natively via adapter
- Use the existing Rotter.net star rating visual (star-1.svg through star-5.svg already in /public/icons/)
- Member since date from users.createdAt field
- Post count aggregated from threads + posts tables

</specifics>

<deferred>
## Deferred Ideas

- OAuth providers (Google, GitHub) — email/password sufficient for MVP
- Email verification — defer to polish phase
- Password reset flow — defer to polish phase
- User avatar uploads — defer

</deferred>
