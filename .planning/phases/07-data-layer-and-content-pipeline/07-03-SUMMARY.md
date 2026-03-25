---
phase: 07-data-layer-and-content-pipeline
plan: 03
subsystem: data-layer
tags: [drizzle-orm, libsql, seed, sqlite, turso]
dependency_graph:
  requires: [07-01]
  provides: [db-seed-script, seeded-forums, seeded-threads, seeded-posts, seeded-news-items, seeded-users]
  affects: [07-02 api routes will return real data after seeding]
tech_stack:
  added: []
  patterns: [onConflictDoNothing upsert pattern, batch inserts for SQLite limits, fabricateStats mirrors forum-seed.ts logic]
key_files:
  created:
    - src/db/seed.ts
  modified:
    - package.json
decisions:
  - "Seed script inlines SNAPSHOT_THREADS and EXTRA_THREADS from forum-seed.ts to avoid circular import issues between src/db/ and src/data/"
  - "Also reads actual scoops1_2026-03-22.json snapshot at runtime via fs.readFileSync to catch any threads not in inline arrays"
  - "Batch inserts (size 50) used for threads and posts to avoid SQLite statement size limits with large datasets"
  - "Date parsing for news times uses parseNewstimeToMs() with HH:MM DD/MM format matching NEWS_SEED time strings"
metrics:
  duration: "~3 minutes"
  completed_date: "2026-03-24T18:03:00Z"
  tasks_completed: 1
  files_created: 1
  files_modified: 1
---

# Phase 07 Plan 03: Database Seed Script Summary

## BLOCKING ISSUES

None

## One-Liner

Seed script `src/db/seed.ts` populates all 5 Drizzle tables (forums, users, threads, posts, news_items) from existing snapshot JSON files and hardcoded seed data using idempotent onConflictDoNothing upserts.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create seed script that populates DB from snapshots and fabricated data | a639ccd | src/db/seed.ts, package.json |

## Acceptance Criteria Verification

- [x] src/db/seed.ts exists
- [x] Script imports db from ./client and table schemas from ./schema
- [x] Script reads data/snapshots/scoops1_2026-03-22.json
- [x] Script seeds all 5 tables: forums, users, threads, posts, news_items
- [x] Script uses onConflictDoNothing for idempotent re-runs
- [x] package.json contains "db:seed" script (`"db:seed": "npx tsx src/db/seed.ts"`)
- [x] Script prints summary counts after seeding
- [x] TypeScript compilation succeeds with no errors (`npx tsc --noEmit` returned no output)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing critical functionality] Inlined SNAPSHOT_THREADS and EXTRA_THREADS rather than importing forum-seed.ts**
- **Found during:** Task 1
- **Issue:** Importing from `src/data/forum-seed.ts` in a `src/db/seed.ts` would create a cross-layer import. The forum-seed.ts file also uses unexported private functions (fabricateStats, mapCategory, parseDate) — only FORUM_SEED is exported. The seed script needs the raw thread data plus the stat-generation logic, which are only accessible via duplicated private functions.
- **Fix:** Inlined both arrays and the helper functions (fabricateStats, mapCategory, parseDateToMs) directly in seed.ts to keep the DB layer self-contained.
- **Files modified:** src/db/seed.ts

## Known Stubs

None — this plan creates infrastructure only. The seed script is a CLI tool; no UI-facing stubs exist.

## Self-Check

1. Verified: YES — `npx tsc --noEmit` returned no output (clean), confirmed 7 grep counts all passed for acceptance criteria.
2. Correct source: YES — verification is TypeScript compilation + grep counts, appropriate for an infrastructure script plan.
3. Deltas investigated: N/A — no comparisons or metrics deltas involved.
4. All substeps: YES — created src/db/seed.ts with all 5 table inserts, added db:seed to package.json, TypeScript compilation confirmed clean.
5. Artifacts exist: YES — `test -f src/db/seed.ts` passed; `grep "db:seed" package.json` confirmed.
6. DATA verdicts: NO DATA used.
7. Hostile reviewer: YES — TypeScript compilation is objective evidence, grep counts verify all acceptance criteria mechanically.

## Self-Check: PASSED
