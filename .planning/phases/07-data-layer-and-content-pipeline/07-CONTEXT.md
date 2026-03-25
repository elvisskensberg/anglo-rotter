# Phase 7: Data Layer and Content Pipeline - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase replaces all hardcoded seed data with a live Turso database, creates API routes for data access, builds a scraper pipeline for content refresh, and adds auto-refresh polling to pages. After this phase, the app serves real translated content from a cloud database.

</domain>

<decisions>
## Implementation Decisions

### Database Stack
- Turso (libSQL cloud) as primary database — SQLite-compatible cloud storage for Vercel
- `@libsql/client` for database connection
- `drizzle-orm` 0.45.x as ORM with `drizzle-kit` for migrations
- Local dev: `libsql://file:local.db` (file-based SQLite)
- Production: `libsql://your-db.turso.io` with auth token via `DATABASE_URL` env var
- Schema defined in `src/db/schema.ts` using Drizzle's table definitions

### TypeScript Interfaces & Schema
- Tables: `forums`, `threads`, `posts`, `news_items`, `users`
- TypeScript types: `Thread`, `Post`, `ForumListing`, `NewsItem`, `User`
- Types inferred from Drizzle schema (`typeof threads.$inferSelect`)
- Type errors in data layer must cause build failures (strict mode already on)

### API Routes
- `GET /api/forums/[forumId]` — returns threads for a forum
- `GET /api/threads/[threadId]` — returns thread with posts
- `GET /api/news` — returns news items (with optional category filter)
- `POST /api/scrape` — triggers scraper (requires `CRON_SECRET` header)
- All routes return typed JSON responses

### Scraper Pipeline
- POST `/api/scrape` with `Authorization: Bearer {CRON_SECRET}` header
- Scrapes Rotter.net scoops forum using curl with browser UA (as proven in earlier research)
- Translates Hebrew content to English (can use simple field mapping for now, real translation in later phase)
- Writes to Turso database via Drizzle insert/upsert
- Returns JSON with scrape stats (items added/updated)

### Auto-Refresh Polling
- Homepage: 13-minute interval (matching original Rotter.net)
- News page: 5-minute interval
- English news: 5-minute interval
- Forum list: 60-minute interval
- Client-side polling with `setInterval` + fetch, updates React state without full page reload
- Use a custom `useAutoRefresh(url, intervalMs)` hook

### Seed Migration
- Remove hardcoded JSON imports from page components
- Pages fetch from API routes via Server Components (SSR) or client fetch for refresh
- Initial seed: run scraper once to populate DB, or use migration script with existing `data/snapshots/` JSON

### Claude's Discretion
- Exact Drizzle schema column types and constraints
- Error handling strategy for API routes (try-catch with typed error responses)
- Whether to use Server Components with direct DB access or always go through API routes
- Seed script implementation details

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/data/forum-seed.ts` — ForumThread interface (will be replaced by DB types)
- `src/data/homepage-seed.ts` — Breaking news seed data
- `src/data/news-seed.ts` — News items seed data
- `data/snapshots/` — Raw scraped JSON data for seeding
- Existing page components that currently import seed data directly

### Established Patterns
- Next.js App Router with Server Components (default) and Client Components ('use client')
- Barrel exports via index.ts per component directory
- Shared layout chrome (HeaderBar, BlueNavBar, OrangeNavBar)
- TDD pattern: failing test → implement → verify

### Integration Points
- All page components (`src/app/page.tsx`, `src/app/forum/[forumId]/page.tsx`, etc.) need to switch from seed imports to API/DB calls
- New `src/db/` directory for schema, client, seed scripts
- New `src/app/api/` directory for API routes
- New `src/hooks/useAutoRefresh.ts` for polling
- Environment variables: `DATABASE_URL`, `TURSO_AUTH_TOKEN`, `CRON_SECRET`

</code_context>

<specifics>
## Specific Ideas

- Use the proven curl + browser UA approach from earlier scraping research
- Rotter.net forum listing URL: `https://rotter.net/cgi-bin/forum/dcboard.cgi?az=list&forum=scoops1`
- Thread pages: `https://rotter.net/forum/scoops1/{threadId}.shtml`
- Content is windows-1255 encoded, needs iconv conversion
- English news already available at `rotter.net/enews/news.php`

</specifics>

<deferred>
## Deferred Ideas

- Real-time translation API integration (use simple field mapping for now)
- WebSocket for real-time updates (polling is sufficient for MVP)
- Cron job scheduling on Vercel (manual trigger via API for now)

</deferred>
