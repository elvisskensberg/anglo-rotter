---
phase: 08-pwa-completion
plan: "04"
subsystem: pwa-push-notifications
tags: [pwa, push-notifications, web-push, service-worker, drizzle]
dependency_graph:
  requires: ["08-01", "08-02"]
  provides: [push_subscriptions_table, push_subscribe_api, push_send_api, sw_push_handler, PushSubscribeButton, scraper_push_trigger]
  affects: [src/db/schema.ts, src/lib/scraper.ts, src/app/sw.ts, src/components/news/NewsPageLayout.tsx]
tech_stack:
  added: [web-push@3.6.7, "@types/web-push@3.6.4"]
  patterns: [VAPID push auth, onConflictDoUpdate for upsert subscription, 410-cleanup for expired subs]
key_files:
  created:
    - src/app/api/push/subscribe/route.ts
    - src/app/api/push/send/route.ts
    - src/components/pwa/PushSubscribeButton.tsx
    - src/components/pwa/PushSubscribeButton.module.css
  modified:
    - src/db/schema.ts
    - src/app/sw.ts
    - src/lib/scraper.ts
    - src/components/news/NewsPageLayout.tsx
decisions:
  - "PushSubscribeButton added to NewsPageLayout (client component) rather than news/page.tsx (server component) — avoids wrapping in separate Suspense boundary"
  - "Uint8Array cast to Uint8Array<ArrayBuffer> to satisfy TypeScript strict buffer type requirements for pushManager.subscribe()"
  - "Authorization for /api/push/send reuses existing CRON_SECRET pattern (same as /api/scrape)"
metrics:
  duration: "4 minutes"
  completed_date: "2026-03-24"
  tasks_completed: 2
  tasks_total: 2
  files_created: 4
  files_modified: 4
---

# Phase 08 Plan 04: Push Notification Infrastructure Summary

Push notification infrastructure with VAPID-authenticated web-push, Drizzle-backed subscription storage, SW push event handler, client opt-in button, and scraper auto-trigger on breaking news.

## BLOCKING ISSUES

None

## Tasks Completed

| # | Task | Commit | Key Files |
|---|------|--------|-----------|
| 1 | Push subscriptions DB table, API routes, web-push install | 7fd45aa | src/db/schema.ts, src/app/api/push/subscribe/route.ts, src/app/api/push/send/route.ts, package.json |
| 2 | SW push handler, PushSubscribeButton, scraper trigger | 4eaa4a3 | src/app/sw.ts, src/components/pwa/PushSubscribeButton.tsx, src/lib/scraper.ts, src/components/news/NewsPageLayout.tsx |

## What Was Built

### push_subscriptions Table (src/db/schema.ts)
Added `pushSubscriptions` sqliteTable with columns: `id` (PK autoIncrement), `endpoint` (unique), `p256dh`, `auth`, `createdAt`. Schema pushed to database via `pnpm db:push`.

### POST /api/push/subscribe
Validates `{ endpoint, keys: { p256dh, auth } }` body, upserts into `pushSubscriptions` via `onConflictDoUpdate` on endpoint (idempotent re-subscription). Returns 201 `{ ok: true }`.

### POST /api/push/send
Authenticates via `Authorization: Bearer CRON_SECRET`. Sets VAPID details from env vars. Selects all subscriptions, calls `webpush.sendNotification()` for each. Deletes subscriptions that return HTTP 410 (expired). Returns `{ ok, sent, failed, cleaned }`.

### SW Push Handler (src/app/sw.ts)
Added `push` and `notificationclick` event listeners after `serwist.addEventListeners()`. Push handler calls `self.registration.showNotification()` with title, body, icon, and data URL. Notification click focuses existing window or opens new one at the notification's URL.

### PushSubscribeButton (src/components/pwa/PushSubscribeButton.tsx)
Client component with SSR guard (`typeof window === "undefined"` check returns null). On mount, checks for existing subscription via `pushManager.getSubscription()`. Subscribe flow: requests Notification permission, calls `pushManager.subscribe()` with `urlBase64ToUint8Array(VAPID_PUBLIC_KEY)`, POSTs to `/api/push/subscribe`. Integrated into NewsPageLayout teal header alongside nav links.

### Scraper Push Trigger (src/lib/scraper.ts)
After news scrape completes, if `result.newsAdded > 0`, POSTs to `/api/push/send` with "MultiRotter: Breaking News" title and item count in body. Uses `NEXT_PUBLIC_SITE_URL` env var for production URL, falls back to `localhost:3000`.

## Verification Results

- `pnpm build` — succeeded, /api/push/send and /api/push/subscribe listed as dynamic routes
- `npx tsc --noEmit --skipLibCheck` — no errors
- `grep "pushSubscriptions" src/db/schema.ts` — confirmed
- `grep '"web-push"' package.json` — confirmed `"web-push": "^3.6.7"`
- `grep "api/push/send" src/lib/scraper.ts` — confirmed trigger present
- `grep -c "push" public/sw.js` — 2 matches (push handler present in built SW)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] TypeScript strict buffer type for Uint8Array**
- **Found during:** Task 2 — tsc type-check
- **Issue:** `urlBase64ToUint8Array` returned `Uint8Array<ArrayBufferLike>` which is not assignable to `BufferSource` parameter expected by `pushManager.subscribe()` (requires `ArrayBuffer` not `ArrayBufferLike`)
- **Fix:** Cast return type and allocation to `Uint8Array<ArrayBuffer>`
- **Files modified:** src/components/pwa/PushSubscribeButton.tsx
- **Commit:** 4eaa4a3 (fixed inline before commit)

## Known Stubs

None — all data flows are wired. PushSubscribeButton reads real VAPID public key from env. Subscribe API writes to real DB. Send API dispatches to real push service. Scraper trigger calls real endpoint.

## User Setup Required

The following environment variables must be set before push notifications work at runtime:

```bash
# Generate with: npx web-push generate-vapid-keys
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<base64url public key>
VAPID_PRIVATE_KEY=<base64url private key>
VAPID_SUBJECT=mailto:admin@multirotter.com  # or your site URL
```

These are NOT needed for the build to succeed — only for runtime push dispatch.

## Self-Check

1. **Verified:** YES — ran `pnpm build` (succeeded), `tsc --noEmit` (clean), all 7 artifacts confirmed with `test -f`
2. **Correct source:** YES — this is a build/local plan, no prod vs E2E distinction applies
3. **Deltas investigated:** N/A — no comparisons performed
4. **All substeps:** YES — web-push installed, schema table added, db:push run, subscribe route created, send route created, SW handlers added, PushSubscribeButton created, scraper trigger added, NewsPageLayout updated
5. **Artifacts exist:** YES — all 7 `test -f` checks passed
6. **DATA verdicts:** NO DATA used
7. **Hostile reviewer:** YES — build output shows /api/push/send and /api/push/subscribe as valid routes; SW output grep confirms push handler compiled in; schema grep confirms table definition

## Self-Check: PASSED
