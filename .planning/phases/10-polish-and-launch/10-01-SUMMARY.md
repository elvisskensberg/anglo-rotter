---
phase: 10-polish-and-launch
plan: 01
subsystem: seo
tags: [metadata, open-graph, seo, next-js]
dependency_graph:
  requires: []
  provides: [SEO-metadata-all-pages]
  affects: [all-page-files]
tech_stack:
  added: []
  patterns: [Next.js Metadata API, generateMetadata for dynamic routes, metadataBase for OG image resolution]
key_files:
  created: []
  modified:
    - src/app/layout.tsx
    - src/app/page.tsx
    - src/app/forum/[forumId]/page.tsx
    - src/app/thread/[threadId]/page.tsx
    - src/app/news/page.tsx
    - src/app/headlines/page.tsx
    - src/app/auth/login/page.tsx
    - src/app/auth/register/page.tsx
    - src/app/profile/[userId]/page.tsx
    - src/app/offline/page.tsx
decisions:
  - "Used void userId in profile generateMetadata to satisfy no-unused-vars without removing the param needed for future enhancements"
  - "Offline page robots set to noindex/nofollow — this page should not appear in search results"
  - "Child page titles omit ' | MultiRotter' suffix — root layout template appends it automatically"
  - "OG titles include ' — MultiRotter' suffix since template does not apply to OG fields"
metrics:
  duration: "~2 minutes"
  completed_date: "2026-03-24"
  tasks_completed: 2
  files_modified: 10
requirements: [POLISH-01]
---

# Phase 10 Plan 01: SEO Metadata Summary

**One-liner:** Next.js Metadata API with metadataBase, title template, and OG tags added to root layout and all 9 page files.

## BLOCKING ISSUES

None

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Root layout metadata template and shared OG defaults | baad9bd | src/app/layout.tsx |
| 2 | Add metadata to all page files | d4ad6dc | 9 page files |

## What Was Built

### Task 1: Root Layout Metadata

Updated `src/app/layout.tsx` metadata export with:
- `metadataBase: new URL(...)` pointing to `https://multirotter.vercel.app` (or `NEXT_PUBLIC_BASE_URL`)
- `title: { default: "MultiRotter — Breaking News Forum", template: "%s | MultiRotter" }` — all child page titles get " | MultiRotter" appended
- `description` — rich SEO description
- `openGraph` with `og-image.png` (1200x630), type "website", siteName "MultiRotter"
- `twitter: { card: "summary_large_image" }`
- `robots: { index: true, follow: true }`
- Kept existing `manifest: "/manifest.webmanifest"`

### Task 2: All Page Metadata

**Static pages (export const metadata):**
- `src/app/page.tsx` — homepage with full title, description, OG tags
- `src/app/news/page.tsx` — "News Flashes" with description
- `src/app/headlines/page.tsx` — "Headlines" with description
- `src/app/auth/login/page.tsx` — "Log In" with description and OG (upgraded from untyped)
- `src/app/auth/register/page.tsx` — "Create Account" with description and OG (upgraded from untyped)
- `src/app/offline/page.tsx` — "Offline" with noindex/nofollow robots

**Dynamic pages (generateMetadata):**
- `src/app/forum/[forumId]/page.tsx` — converts forumId slug to human name (e.g., "scoops_1" → "Scoops 1 Forum")
- `src/app/thread/[threadId]/page.tsx` — "Thread #123" with description
- `src/app/profile/[userId]/page.tsx` — "User Profile" with description

## Deviations from Plan

None — plan executed exactly as written.

## Verification

- `npx tsc --noEmit` passes with no errors
- All acceptance criteria grep checks pass
- All 10 files verified on disk

## Self-Check

1. Verified: YES — TypeScript compiles clean, grep checks confirm all required patterns present in all files
2. Correct source: YES — local file checks (this is a code generation task, not production validation)
3. Deltas investigated: N/A — no comparisons performed
4. All substeps: YES — both tasks completed: layout.tsx updated, all 9 page files updated with metadata
5. Artifacts exist: YES — all 10 files verified via grep output above
6. DATA verdicts: NO DATA classifications used
7. Hostile reviewer: YES — every acceptance criterion from the plan was checked with grep and passed; TypeScript type-checks the metadata exports

## Self-Check: PASSED
