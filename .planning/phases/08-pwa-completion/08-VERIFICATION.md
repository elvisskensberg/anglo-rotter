---
phase: pwa-completion
verified: 2026-03-23T00:00:00Z
status: gaps_found
score: 9/12 must-haves verified
gaps:
  - truth: "Chrome DevTools Application > Manifest shows name MultiRotter, theme_color #71B7E6, icons at 192 and 512"
    status: failed
    reason: "layout.tsx metadata sets manifest: '/manifest.json' pointing to a static public/manifest.json that references icon paths /icons/icon-192.png and /icons/icon-512.png — both non-existent. The actual icons are named icon-192x192.png and icon-512x512.png. Browsers load this broken static manifest, not the correct src/app/manifest.ts which serves at /manifest.webmanifest."
    artifacts:
      - path: "public/manifest.json"
        issue: "Icon src paths /icons/icon-192.png and /icons/icon-512.png do not exist. Files are named icon-192x192.png and icon-512x512.png."
      - path: "src/app/layout.tsx"
        issue: "metadata.manifest = '/manifest.json' points to the broken static file, bypassing src/app/manifest.ts entirely."
    missing:
      - "Remove public/manifest.json or fix its icon src values to /icons/icon-192x192.png and /icons/icon-512x512.png"
      - "Change src/app/layout.tsx metadata.manifest to '/manifest.webmanifest' OR remove the explicit manifest field and let Next.js auto-discover src/app/manifest.ts"
  - truth: "The offline page is precached by the service worker at install time"
    status: partial
    reason: "sw.ts correctly spreads /offline into precacheEntries and includes fallbacks.entries config. However the broken manifest.json means the app may not be treated as a valid installable PWA by some browsers, which could prevent SW install from running. The SW code itself is correct; the gap is a downstream effect of the manifest issue."
    artifacts:
      - path: "src/app/sw.ts"
        issue: "SW code is correct. Risk is that browsers reject install/activation due to broken manifest icon references."
    missing:
      - "Fix manifest.json icon paths (addresses root cause from gap 1)"
---

# Phase 08: PWA Completion Verification Report

**Phase Goal:** The app is fully installable as a PWA with an offline shell, correct Serwist caching strategies per resource type, and working push notification delivery for breaking news
**Verified:** 2026-03-23T00:00:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #  | Truth | Status | Evidence |
|----|-------|--------|----------|
| 1  | Chrome DevTools Application > Manifest shows name MultiRotter, theme_color #71B7E6, icons at 192 and 512 | ✗ FAILED | layout.tsx uses `manifest: "/manifest.json"` which references non-existent icon paths /icons/icon-192.png and /icons/icon-512.png. Actual files are icon-192x192.png and icon-512x512.png. src/app/manifest.ts is correct but effectively bypassed. |
| 2  | Service worker uses NetworkFirst for /api/**, CacheFirst for static/images, StaleWhileRevalidate for pages | ✓ VERIFIED | sw.ts lines 18-72: four runtimeCaching entries with correct strategy instances (new NetworkFirst, new CacheFirst x2, new StaleWhileRevalidate) and ExpirationPlugin per cache. No defaultCache reference. |
| 3  | /offline route renders a themed page with "You're offline" message | ✓ VERIFIED | src/app/offline/page.tsx: server component with "You're offline" text, Rotter blue header via offline.module.css (.header background #71b7e6). |
| 4  | Service worker precaches /offline and serves it as fallback for failed navigations | ✓ VERIFIED | sw.ts line 75: `precacheEntries: [...(self.__SW_MANIFEST ?? []), "/offline"]`. Lines 80-89: fallbacks.entries with document destination matcher. |
| 5  | Install banner appears when browser fires beforeinstallprompt | ✓ VERIFIED | useInstallPrompt.ts lines 36-40: addEventListener("beforeinstallprompt", handler) stores event and sets isInstallable=true. InstallBanner.tsx returns null when !isInstallable. |
| 6  | Clicking Install triggers native browser install flow | ✓ VERIFIED | useInstallPrompt.ts lines 49-58: promptInstall() calls deferredPrompt.prompt() and awaits userChoice. InstallBanner.tsx line 17: installButton onClick={promptInstall}. |
| 7  | Dismissing banner stores preference in localStorage for 7 days | ✓ VERIFIED | useInstallPrompt.ts lines 61-68: dismissPrompt sets isInstallable=false and writes { dismissed: Date.now() } to localStorage key "pwa-install-dismissed". TTL check at lines 26-31. |
| 8  | Banner does not appear if app already installed (standalone mode) | ✓ VERIFIED | useInstallPrompt.ts lines 19-21: window.matchMedia("(display-mode: standalone)").matches check returns early before registering event listener. |
| 9  | push_subscriptions table exists in DB schema | ✓ VERIFIED | src/db/schema.ts lines 94-100: pushSubscriptions sqliteTable with id, endpoint (unique), p256dh, auth, createdAt columns. |
| 10 | POST /api/push/subscribe accepts PushSubscription JSON and stores it in Turso | ✓ VERIFIED | route.ts: validates endpoint + keys.{p256dh,auth}, inserts with onConflictDoUpdate on endpoint, returns 201 { ok: true }. Imports db and pushSubscriptions from correct paths. |
| 11 | POST /api/push/send dispatches web-push notifications to all stored subscriptions | ✓ VERIFIED | send/route.ts: CRON_SECRET auth, webpush.setVapidDetails from env, db.select all subscriptions, sendNotification per sub, 410 cleanup, returns {sent,failed,cleaned}. web-push@3.6.7 in package.json. |
| 12 | Scraper triggers push dispatch when new breaking news items are detected | ✓ VERIFIED | src/lib/scraper.ts lines 229-234: if result.newsAdded > 0, POSTs to /api/push/send with CRON_SECRET Bearer auth and news item count in body. |

**Score:** 9/12 truths verified (gap on manifest wiring, partial risk on SW offline fallback)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/app/manifest.ts` | Web app manifest | ✓ VERIFIED | Exports correct MetadataRoute.Manifest with name "MultiRotter", theme_color "#71B7E6", correct icon paths /icons/icon-192x192.png and /icons/icon-512x512.png. |
| `public/icons/icon-192x192.png` | 192x192 PWA icon | ✓ VERIFIED | File exists. |
| `public/icons/icon-512x512.png` | 512x512 maskable PWA icon | ✓ VERIFIED | File exists. |
| `src/app/sw.ts` | Custom Serwist caching strategies | ✓ VERIFIED | All four strategies present with correct matchers. No defaultCache. Offline fallback and push handlers wired. |
| `src/app/offline/page.tsx` | Offline fallback page | ✓ VERIFIED | Server component with "You're offline" message and Rotter blue header. |
| `src/app/offline/offline.module.css` | Offline page styles | ✓ VERIFIED | .header background #71b7e6, #000099 title color, #3293cd retry button. |
| `src/hooks/useInstallPrompt.ts` | beforeinstallprompt hook | ✓ VERIFIED | Captures event, standalone check, 7-day TTL, promptInstall and dismissPrompt exported. |
| `src/components/pwa/InstallBanner.tsx` | Install prompt banner | ✓ VERIFIED | "use client", uses useInstallPrompt, renders Install + dismiss buttons. |
| `src/components/pwa/InstallBanner.module.css` | Banner styles | ✓ VERIFIED | .banner class present in file. |
| `src/db/schema.ts` | push_subscriptions table | ✓ VERIFIED | pushSubscriptions sqliteTable defined at lines 94-100. |
| `src/app/api/push/subscribe/route.ts` | Subscription storage endpoint | ✓ VERIFIED | POST handler with validation, upsert, 201 response. |
| `src/app/api/push/send/route.ts` | Push dispatch endpoint | ✓ VERIFIED | POST handler with VAPID, fanout, 410 cleanup. |
| `src/components/pwa/PushSubscribeButton.tsx` | Client push subscription UI | ✓ VERIFIED | SSR guard, mount subscription check, subscribe/unsubscribe handlers, posts to /api/push/subscribe. |
| `public/manifest.json` | (UNEXPECTED) Static manifest file | ✗ GAP | A pre-existing or separately-created static manifest.json exists in public/ with WRONG icon paths (/icons/icon-192.png, /icons/icon-512.png). layout.tsx metadata explicitly references this broken file. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/app/manifest.ts` | `public/icons/icon-192x192.png` | icons array src path | ✓ WIRED | manifest.ts line 15: `src: "/icons/icon-192x192.png"` — correct path |
| `src/app/sw.ts` | `/api/**` | runtimeCaching urlPattern | ✓ WIRED | sw.ts line 21: matcher `/\/api\/.*/i` with NetworkFirst handler |
| `src/app/sw.ts` | `/offline` | fallbacks.entries | ✓ WIRED | sw.ts lines 75, 80-89: precache + fallback config |
| `src/components/pwa/InstallBanner.tsx` | `src/hooks/useInstallPrompt.ts` | useInstallPrompt import | ✓ WIRED | InstallBanner.tsx line 3: `import { useInstallPrompt } from "@/hooks/useInstallPrompt"` |
| `src/app/layout.tsx` | `src/components/pwa/InstallBanner.tsx` | component import | ✓ WIRED | layout.tsx line 3: import, line 21: `<InstallBanner />` |
| `src/app/layout.tsx` | `public/manifest.json` | metadata.manifest field | ✗ BROKEN | layout.tsx line 8: `manifest: "/manifest.json"` points to static file with wrong icon paths, NOT to /manifest.webmanifest served by src/app/manifest.ts |
| `src/app/api/push/subscribe/route.ts` | `src/db/schema.ts` | drizzle insert | ✓ WIRED | subscribe/route.ts line 3: imports pushSubscriptions, line 53: db.insert(pushSubscriptions) |
| `src/app/api/push/send/route.ts` | `src/db/schema.ts` | drizzle select | ✓ WIRED | send/route.ts line 4: imports pushSubscriptions, line 57: db.select().from(pushSubscriptions) |
| `src/lib/scraper.ts` | `/api/push/send` | fetch after news detected | ✓ WIRED | scraper.ts lines 229-241: conditional fetch to /api/push/send with CRON_SECRET |
| `src/app/sw.ts` | push event | self.addEventListener | ✓ WIRED | sw.ts lines 96-107: addEventListener("push", ...) with showNotification |
| `src/components/news/NewsPageLayout.tsx` | `PushSubscribeButton` | component import + render | ✓ WIRED | NewsPageLayout.tsx line 8: import, line 79: `<PushSubscribeButton />` |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| PWA-01 | 08-01 | Web app manifest with name "MultiRotter", theme_color #71B7E6, icons at multiple sizes | ✗ BLOCKED | manifest.ts is correct but layout.tsx references broken public/manifest.json. Browser sees wrong manifest. |
| PWA-02 | 08-01 | Serwist service worker with caching strategy matrix (CacheFirst for static, NetworkFirst for API) | ✓ SATISFIED | sw.ts has four-tier strategy matrix with correct handlers and ExpirationPlugin. No defaultCache. |
| PWA-03 | 08-02 | Offline page displaying cached content | ✓ SATISFIED | /offline route renders, /offline precached in SW, fallbacks.entries wired for document requests. |
| PWA-04 | 08-04 | Push notification support for breaking news (VAPID + web-push) | ✓ SATISFIED | Full stack: schema, subscribe API, send API, SW push handler, PushSubscribeButton, scraper trigger. |
| PWA-05 | 08-03 | App install prompt banner | ✓ SATISFIED | useInstallPrompt + InstallBanner in layout. beforeinstallprompt captured, standalone guard, 7-day TTL dismiss. |
| PWA-06 | 08-03 | Installable on mobile and desktop | ✗ BLOCKED | Installability depends on a valid manifest. public/manifest.json icon paths are broken. PWA install criteria fail when manifest icons 404. |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `public/manifest.json` | 12, 17 | Icon src paths reference non-existent files (`/icons/icon-192.png`, `/icons/icon-512.png`) | Blocker | Browser PWA install criteria require valid, loadable manifest icons. 404 icons prevent Chrome/Safari from showing install prompt. |
| `src/app/layout.tsx` | 8 | `manifest: "/manifest.json"` hardcoded in metadata — bypasses the dynamic src/app/manifest.ts entirely | Blocker | The carefully crafted manifest.ts with correct icon paths is never surfaced to the browser. |

No TODO/FIXME/HACK patterns found in phase-modified files.
No deferred sections in any SUMMARY.md.
No forbidden verdict phrases (conditional pass, partial pass, etc.) found in SUMMARYs.
All SUMMARYs include `## BLOCKING ISSUES` section.

### Human Verification Required

None identified — all checks are programmatic. The manifest icon path bug is fully verifiable from file inspection.

### Gaps Summary

The phase produced all required code artifacts and they are substantive and wired correctly. There is one concrete wiring bug that blocks the primary PWA installability goal:

**Root cause:** `public/manifest.json` exists as a static file with incorrect icon paths (`/icons/icon-192.png`, `/icons/icon-512.png` — neither file exists). `src/app/layout.tsx` metadata explicitly sets `manifest: "/manifest.json"` which points the browser at this broken static file, bypassing the correct `src/app/manifest.ts` entirely. The `manifest.ts` file serves at `/manifest.webmanifest` (Next.js convention) but no HTML `<link>` points to it.

**Impact:** PWA install criteria require all manifest icon URLs to resolve successfully. Chrome, Edge, and Safari all fail the installability check when icons 404. The install banner (`useInstallPrompt`) captures `beforeinstallprompt`, but browsers only fire this event when the manifest is valid — so the banner will never appear on affected browsers. PWA-01 and PWA-06 are both blocked.

**Fix (one of two options):**
1. Delete `public/manifest.json`, change `layout.tsx` metadata to `manifest: "/manifest.webmanifest"` — this routes browsers to the correct `manifest.ts` output
2. Fix `public/manifest.json` icon src values to `/icons/icon-192x192.png` and `/icons/icon-512x512.png` — this leaves the static file in place but makes it valid

All other phase deliverables (caching strategies, offline shell, push notification stack) are fully wired and substantive.

---

_Verified: 2026-03-23T00:00:00Z_
_Verifier: Claude (gsd-verifier)_
