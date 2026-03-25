---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: unknown
stopped_at: Completed 10-polish-and-launch plan 03 (10-03-PLAN.md)
last_updated: "2026-03-24T19:43:40.318Z"
progress:
  total_phases: 10
  completed_phases: 10
  total_plans: 34
  completed_plans: 34
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-22)

**Core value:** Users can post and consume breaking news scoops in real-time through a faithful replica of Rotter.net's iconic retro forum interface, installable as a PWA.
**Current focus:** Phase 10 — polish-and-launch

## Current Position

Phase: 10
Plan: Not started

## Performance Metrics

**Velocity:**

- Total plans completed: 0
- Average duration: -
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**

- Last 5 plans: -
- Trend: -

*Updated after each plan completion*
| Phase 01-foundation-and-design-system P01 | 5 | 1 tasks | 9 files |
| Phase 01-foundation-and-design-system P02 | 4 | 3 tasks | 12 files |
| Phase 01-foundation-and-design-system P03 | 10 | 5 tasks | 20 files |
| Phase 01-foundation-and-design-system P04 | 198 | 2 tasks | 13 files |
| Phase 02-homepage P01 | 5 | 4 tasks | 11 files |
| Phase 02-homepage P02 | 15 | 3 tasks | 6 files |
| Phase 03-forum-listing P01 | 6 | 2 tasks | 8 files |
| Phase 03-forum-listing P02 | 3 | 3 tasks | 8 files |
| Phase 03-forum-listing P03 | 7 | 2 tasks | 5 files |
| Phase 04-thread-page P01 | 18 | 2 tasks | 8 files |
| Phase 04-thread-page P03 | 4 | 2 tasks | 5 files |
| Phase 04-thread-page P02 | 5 | 3 tasks | 6 files |
| Phase 04-thread-page P04 | 15 | 2 tasks | 5 files |
| Phase 05-news-flash-page P01 | 3 | 3 tasks | 6 files |
| Phase 05-news-flash-page P02 | 18 | 3 tasks | 10 files |
| Phase 06-headlines-page P01 | 10 | 1 tasks | 4 files |
| Phase 06-headlines-page P02 | 4 | 2 tasks | 8 files |
| Phase 07 P01 | 8 | 2 tasks | 8 files |
| Phase 07 P02 | 2 | 2 tasks | 3 files |
| Phase 07 P03 | 3 | 1 tasks | 2 files |
| Phase 07 P04 | 92s | 2 tasks | 4 files |
| Phase 07-data-layer-and-content-pipeline P05 | 5 | 2 tasks | 18 files |
| Phase 08-pwa-completion P01 | 4 | 2 tasks | 5 files |
| Phase 08-pwa-completion P03 | 8 | 2 tasks | 4 files |
| Phase 08-pwa-completion P02 | 600 | 2 tasks | 3 files |
| Phase 08-pwa-completion P04 | 4 | 2 tasks | 8 files |
| Phase 09-authentication-and-user-features P01 | 8 | 2 tasks | 10 files |
| Phase 09-authentication-and-user-features P03 | 166 | 2 tasks | 3 files |
| Phase 09-authentication-and-user-features P02 | 6 | 2 tasks | 6 files |
| Phase 09-authentication-and-user-features P04 | 4 | 2 tasks | 10 files |
| Phase 09-authentication-and-user-features P05 | 302 | 2 tasks | 9 files |
| Phase 10-polish-and-launch P02 | 1 | 1 tasks | 3 files |
| Phase 10-polish-and-launch P01 | 2 | 2 tasks | 10 files |
| Phase 10-polish-and-launch P03 | 8 | 2 tasks | 2 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Pre-Phase 1]: Use Serwist (@serwist/next v9.x) — next-pwa is abandoned, @ducanh2912/next-pwa is superseded
- [Pre-Phase 1]: Use Turso + @libsql/client for database — local SQLite is silently wiped on Vercel deploys
- [Pre-Phase 1]: Use Better Auth — Lucia Auth was deprecated March 2025
- [Pre-Phase 1]: All `<table>` elements must include explicit `<tbody>` — browser auto-insert causes React hydration mismatch
- [Pre-Phase 1]: Scraped Rotter content is for private dev seeding only — public launch must use user-generated content
- [Phase 01-foundation-and-design-system]: Use --webpack flag for next dev/build — Serwist incompatible with Next.js 16 Turbopack default
- [Phase 01-foundation-and-design-system]: Static Serwist import in sw.ts (not dynamic await import) avoids top-level await TypeScript config requirement
- [Phase 01-foundation-and-design-system]: Add webworker to tsconfig lib array for ServiceWorkerGlobalScope types
- [Phase 01-foundation-and-design-system]: Use identity-obj-proxy for CSS Modules in Jest — returns class name strings enabling toHaveClass assertions
- [Phase 01-foundation-and-design-system]: Canonical --rotter-* variable names: --rotter-size-base (14px), --rotter-container (1012px) per DESIGN_SPECIFICATION.md
- [Phase 01-foundation-and-design-system]: Table component does NOT auto-wrap in tbody — callers must explicitly include tbody so intent is visible
- [Phase 01-foundation-and-design-system]: SVG symbols with defs used in star icons for DRY shape reuse
- [Phase 01-foundation-and-design-system]: Star viewBox is 80x16 (5 stars * 16px each) enabling horizontal row rendering
- [Phase 01-foundation-and-design-system]: CSS-only :hover dropdown for DropdownMenu — no JavaScript state needed for pure hover behavior
- [Phase 01-foundation-and-design-system]: BlueNavBar composes DropdownMenu for Archive item — demonstrates component composition pattern for nav bars
- [Phase 02-homepage]: extractTime() helper parses HH:MM from date strings in seed data — bare dates yield '00:00'
- [Phase 02-homepage]: TickerSidebar imports TICKER_SEED internally (self-contained widget pattern); AdSlot accepts width/height props for reuse
- [Phase 02-homepage]: CSS module class assertions in tests use identity-obj-proxy: querySelectorAll('span.timeLabel') works because proxy returns class name strings
- [Phase 02-homepage]: HomepageLayout imports siblings directly (not via index.ts barrel) to avoid circular dependency
- [Phase 02-homepage]: Table bgcolor must be lowercase in JSX — TypeScript strict mode rejects bgColor on HTMLTableElement
- [Phase 02-homepage]: Client boundary at HomepageLayout level — page.tsx stays a server component
- [Phase 03-forum-listing]: fabricateStats() uses threadId % 100 — extra thread IDs must use values 800000-800025 to hit fire/hot mod ranges that snapshot IDs (all mod 20+) miss
- [Phase 03-forum-listing]: Thread icon cell onMouseEnter/onMouseLeave placed on td for larger interaction area covering full cell
- [Phase 03-forum-listing]: ForumSectionDropdown uses controlled select with client-side filter only (no navigation) per CONTEXT.md Pitfall 4
- [Phase 03-forum-listing]: PaginationBar current page renders as plain span (no href) matching Rotter Pattern 6
- [Phase 03-forum-listing]: Replace <font> elements with styled <span> — TypeScript strict mode rejects legacy HTML elements in JSX
- [Phase 03-forum-listing]: Server component page.tsx passes full FORUM_SEED; ForumThreadTable handles client-side category filtering
- [Phase 03-forum-listing]: Next.js 15 async params awaited in server component (Promise<{ forumId: string }>)
- [Phase 04-thread-page]: ThreadData must include title: string — CONTEXT.md locked decisions override RESEARCH.md illustrative snippet that omitted it
- [Phase 04-thread-page]: buildDepthMap() BFS pre-computes depth at seed-build time; ReplyTreeItem stores flat depth field — components render via .map() with no recursion
- [Phase 04-thread-page]: ReplyTreeItem.depth starts at 1 for top-level replies — depth 0 reserved for original post (not in replies array)
- [Phase 04-thread-page]: nowrap boolean HTML attr rejected by TypeScript strict mode on td elements; use style={{ whiteSpace: 'nowrap' }} instead
- [Phase 04-thread-page]: ActionButtons renders a <tr> fragment (not full table) — caller ThreadPageClient wraps it inside OriginalPostBlock's table structure
- [Phase 04-thread-page]: Reply button is <button> styled as text link — needed for onReplyClick callback without navigation behavior
- [Phase 04-thread-page]: border and valign attrs removed from img/th elements — TypeScript strict mode rejects them; replaced with style props
- [Phase 04-thread-page]: ThreadPageClient wraps ActionButtons (<tr>) in table/tbody — ActionButtons returns <tr> fragment, caller must provide table context
- [Phase 04-thread-page]: fireEvent.click used instead of element.click() in tests — wraps in act automatically
- [Phase 04-thread-page]: thread route uses notFound() from next/navigation for 404 handling
- [Phase 05-news-flash-page]: NewsItem.sourceIcon stores hex color string as colored circle placeholder; no image assets needed until Plan 02+
- [Phase 05-news-flash-page]: Wave 0 stubs import from @/components/news barrel (does not exist yet) — intentional fail-at-import TDD RED pattern
- [Phase 05-news-flash-page]: BlueNavBar updated to /news before the route exists — prevents stale link when Plan 02 creates src/app/news/page.tsx
- [Phase 05-news-flash-page]: Inline hex values for row backgrounds — jsdom toHaveStyle cannot resolve CSS custom properties
- [Phase 05-news-flash-page]: NewsCategoryTabs active state uses dual CSS classes (categoryTab + active) not single (categoryTabActive) — identity-obj-proxy returns camelCase breaking lowercase includes check
- [Phase 05-news-flash-page]: Source icon circle borderRadius in inline style (not CSS module) so tests can check getAttribute style
- [Phase 06-headlines-page]: Inline hex values for row backgrounds in HeadlineRow (jsdom cannot resolve CSS custom properties)
- [Phase 06-headlines-page]: @testing-library/jest-dom imported per-file in HeadlineRow.test.tsx (no global setup in jest.config.js)
- [Phase 06-headlines-page]: toSortableDate() converts DD.MM.YY + HH:MM to YYMMDD HH:MM for lexicographic sort in HeadlinesTable
- [Phase 06-headlines-page]: HeadlinesTable imported directly in page.tsx (not via barrel) to avoid client component boundary issues
- [Phase 07]: Drizzle sqliteTable with turso dialect for Vercel-compatible cloud SQLite
- [Phase 07]: Types inferred via typeof table.$inferSelect — single source of truth, no type drift
- [Phase 07]: ForumListing and NewsItem API interfaces match existing seed shapes to avoid UI component changes
- [Phase 07]: Import ThreadData interfaces from @/data/thread-seed (already exported there) to avoid duplication
- [Phase 07]: Seed script inlines SNAPSHOT_THREADS/EXTRA_THREADS from forum-seed.ts to keep DB layer self-contained (no cross-layer import)
- [Phase 07]: Batch inserts (size 50) used in seed.ts to avoid SQLite statement size limits with large datasets
- [Phase 07]: Use iconv-lite to decode windows-1255 Rotter.net HTML; Authorization Bearer CRON_SECRET for scrape endpoint
- [Phase 07-data-layer-and-content-pipeline]: ForumListing and NewsItem types from @/types/forum replace seed-file types across all components
- [Phase 07-data-layer-and-content-pipeline]: BreakingNewsFeed owns auto-refresh via useAutoRefresh hook at 13-min interval
- [Phase 08-pwa-completion]: RuntimeCaching handler requires strategy instance not string in Serwist v9
- [Phase 08-pwa-completion]: ExpirationPlugin used as plugin array entry not options.expiration shorthand in Serwist v9
- [Phase 08-pwa-completion]: BeforeInstallPromptEvent typed inline (not in standard TypeScript lib) — interface extends Event
- [Phase 08-pwa-completion]: layout.tsx stays as server component — Next.js handles client boundary at InstallBanner level
- [Phase 08-pwa-completion]: Serwist v9 fallbacks.entries used for offline nav fallback (no additionalPrecacheEntries — spread /offline into precacheEntries instead)
- [Phase 08-pwa-completion]: PushSubscribeButton integrated into NewsPageLayout (client component) to avoid Suspense wrapper on news/page.tsx server component
- [Phase 08-pwa-completion]: CRON_SECRET reused for /api/push/send authorization — consistent with /api/scrape pattern
- [Phase 09-authentication-and-user-features]: Better Auth 1.5.6 uses betterAuth() with drizzleAdapter(db, { provider: 'sqlite', camelCase: true }) — verified from package types before implementation
- [Phase 09-authentication-and-user-features]: Renamed users to user table (Better Auth model name requirement); kept export const users = user alias for zero-change backwards compat
- [Phase 09-authentication-and-user-features]: Next.js 16 proxy convention: renamed src/middleware.ts to src/proxy.ts with proxy() export — middleware.ts triggers build error in Next.js 16
- [Phase 09-authentication-and-user-features]: Better Auth useSession needs no React provider wrapper; HeaderBar stays server component importing AuthButton client component
- [Phase 09-authentication-and-user-features]: signUp.email() name field stores username; forum-specific username column populated on first post (Plan 09-04/05)
- [Phase 09-authentication-and-user-features]: Used Date.now() as thread ID for immediate post-creation redirect to new thread page
- [Phase 09-authentication-and-user-features]: Auth gate pattern established: useSession() in client components, auth.api.getSession() in API routes
- [Phase 09-authentication-and-user-features]: Use unique() Drizzle constraint for one-rating-per-user-per-thread enforcement at DB level
- [Phase 09-authentication-and-user-features]: ThreadRating renders read-only for guests, clickable stars for authenticated users (client island)
- [Phase 10-polish-and-launch]: Pure Node.js buffer + zlib deflate for PNG generation — avoids canvas/sharp dependency for single static image
- [Phase 10-polish-and-launch]: Child page titles omit site name suffix — root layout template appends it automatically; OG titles include suffix since template does not apply to OG fields
- [Phase 10-polish-and-launch]: vercel.json: no env vars in file — all secrets set in Vercel dashboard; not-found.tsx is a server component with retro table 404 layout

### Pending Todos

None yet.

### Blockers/Concerns

- [Research]: Verify Better Auth current version with `npm show better-auth version` before Phase 9 install — API may have evolved since March 2026 research
- [Research]: Evaluate Turso partial-sync (`@tursodatabase/vercel-experimental`) at Phase 7 — may improve cold-start read performance
- [Research]: Validate `curl-cffi` Cloudflare bypass is still effective at Phase 7 implementation time — evolves rapidly
- [Legal]: Scraped Rotter content cannot be committed to a public repo or served publicly — check robots.txt and ToS before any public deploy

## Session Continuity

Last session: 2026-03-24T19:39:16.064Z
Stopped at: Completed 10-polish-and-launch plan 03 (10-03-PLAN.md)
Resume file: None
