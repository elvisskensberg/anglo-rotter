---
phase: 07-data-layer-and-content-pipeline
plan: "04"
subsystem: content-pipeline
tags: [scraper, api, cron, cheerio, iconv-lite, turso, drizzle]
dependency_graph:
  requires: ["07-01", "07-02"]
  provides: ["scrapeForumListing", "POST /api/scrape"]
  affects: [threads, news_items]
tech_stack:
  added: [cheerio@1.2.0, iconv-lite@0.7.2]
  patterns: [fetch-decode-parse-upsert, CRON_SECRET bearer auth, onConflictDoUpdate]
key_files:
  created:
    - src/lib/scraper.ts
    - src/app/api/scrape/route.ts
  modified:
    - package.json
    - pnpm-lock.yaml
decisions:
  - "Use iconv-lite to decode windows-1255 encoded HTML from Rotter.net forum listing"
  - "Use Authorization: Bearer {CRON_SECRET} header pattern for scrape endpoint auth"
  - "Track threadsAdded vs threadsUpdated by querying existing row before upsert"
  - "Silently ignore duplicate news items via onConflictDoNothing"
metrics:
  duration: "~92 seconds"
  completed: "2026-03-24T18:06:48Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 2
  files_modified: 2
requirements: [DATA-05]
---

# Phase 7 Plan 4: Scraper Pipeline and API Endpoint Summary

## BLOCKING ISSUES

None

## One-Liner

Rotter.net content scraper with cheerio+iconv-lite HTML parsing and CRON_SECRET-authenticated POST /api/scrape endpoint that upserts threads and news into Turso.

## Tasks Completed

| # | Name | Commit | Key Files |
|---|------|--------|-----------|
| 1 | Create scraper module for Rotter.net forum listing | 0e1f722 | src/lib/scraper.ts, package.json |
| 2 | Create POST /api/scrape endpoint with CRON_SECRET auth | b7cb6c2 | src/app/api/scrape/route.ts |

## What Was Built

### Task 1: Scraper Module (`src/lib/scraper.ts`)

Implements the full fetch-decode-parse-upsert pipeline:

1. **Fetch**: GET `https://rotter.net/cgi-bin/forum/dcboard.cgi?az=list&forum=scoops1` with browser User-Agent header
2. **Decode**: Uses `iconv-lite` to decode windows-1255 encoded response body into UTF-8 string
3. **Parse**: Uses `cheerio` to select `a[href*='/forum/scoops1/']` anchor elements, extract thread IDs from URLs matching `/forum/scoops1/(\d+)\.shtml`, walk up to the `<tr>` to read author/date/replies/views columns
4. **Upsert**: Uses Drizzle `db.insert(threads).onConflictDoUpdate()` to insert new threads or update title/author/viewCount/replyCount on ID collision
5. **News**: Also scrapes `rotter.net/enews/news.php` (UTF-8) for English news items, inserts with `onConflictDoNothing`

Exports:
- `scrapeForumListing(): Promise<ScrapeResult>`
- `ScrapeResult` interface: `{ threadsAdded, threadsUpdated, newsAdded, errors }`

### Task 2: API Route (`src/app/api/scrape/route.ts`)

POST handler with:
- `CRON_SECRET` not configured → 500 error
- `Authorization` header missing or wrong → 401 Unauthorized
- Correct auth → calls `scrapeForumListing()`, returns `{ ok: true, stats: {...} }`
- Uncaught exception → 500 with `details` string

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

Minor adaptation: The scraper module also tracks `threadsUpdated` separately from `threadsAdded` by querying for existing rows before the upsert. The plan template used a single `threadsAdded` counter; this gives more accurate monitoring data at minimal cost.

## Known Stubs

- `content` field in thread upsert is set to `t.title` (the title string). Full content requires per-thread page scraping, which is a future phase. This is intentional and documented with a code comment.
- `sourceIcon` for news items is hardcoded to `"#555555"`. Real source icons require a source-to-color mapping that belongs in a future enhancement.
- Cheerio selectors for the forum table (cell indexes for author/date/replies/views columns) are based on the known Rotter.net HTML structure from snapshots. If Rotter changes their table layout, these will need updating.

## Self-Check

1. Verified: YES — Files confirmed on disk via `test -f`, exports confirmed via grep, TypeScript passes with zero errors
2. Correct source: YES — Evidence is from local build (tsc --noEmit) and file existence checks; no prod claim made
3. Deltas investigated: N/A — No comparisons performed
4. All substeps: YES — installed deps, created scraper module, created route, ran tsc, committed both tasks
5. Artifacts exist: YES — `test -f src/lib/scraper.ts` FOUND, `test -f src/app/api/scrape/route.ts` FOUND
6. DATA verdicts: NO DATA used
7. Hostile reviewer: YES — TypeScript passes, exports verified, auth logic is straightforward, package.json confirmed cheerio and iconv-lite present

## Self-Check: PASSED
