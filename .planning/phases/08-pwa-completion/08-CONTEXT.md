# Phase 8: PWA Completion - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase completes the PWA experience: web app manifest with icons, custom Serwist caching strategies (NetworkFirst for API, CacheFirst for static), offline fallback page, push notification subscription + delivery for breaking news, and an in-app install prompt banner.

</domain>

<decisions>
## Implementation Decisions

### Web App Manifest
- Name: "MultiRotter", short_name: "MultiRotter"
- theme_color: #71B7E6 (matching Rotter.net header blue)
- background_color: #FFFFFF
- display: "standalone", orientation: "any"
- Icons at 192x192 and 512x512 (PNG)
- Use Next.js metadata API (`src/app/manifest.ts` export)

### Service Worker Caching
- Replace `defaultCache` with custom strategies in `src/app/sw.ts`:
  - NetworkFirst for `/api/**` routes (fresh data preferred, cached fallback)
  - CacheFirst for `/_next/static/**` (immutable build output)
  - CacheFirst for `*.svg`, `*.png`, `*.gif` assets
  - StaleWhileRevalidate for HTML pages (fast load, background refresh)
- Offline fallback page at `/offline` using Serwist's offline fallback plugin

### Offline Page
- Simple `/offline` route with cached content message
- Styled with Rotter.net header blue theme
- Shows "You're offline — cached content may be available"

### Push Notifications
- Web Push API with VAPID keys
- `web-push` npm package for server-side dispatch
- Subscription endpoint: `POST /api/push/subscribe` — stores subscription in Turso `push_subscriptions` table
- Dispatch endpoint: `POST /api/push/send` — sends notification to all subscribers (called by scraper when breaking news detected)
- Client-side: Notification permission request + subscription via service worker
- Env vars: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`

### Install Prompt
- Custom `useInstallPrompt` hook capturing `beforeinstallprompt` event
- Banner component at bottom of page with "Install MultiRotter" CTA
- Triggers native install flow on click
- Dismissible, remembers dismissal in localStorage

### Claude's Discretion
- Icon generation approach (simple colored squares or proper logo)
- Exact offline page layout
- Push notification payload format
- Whether to add a push_subscriptions table or reuse users table

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/sw.ts` — Serwist service worker (needs custom caching strategies)
- `@serwist/next` and `serwist` already installed
- `next.config.ts` already has `withSerwistInit` wrapper
- `src/db/schema.ts` — can add push_subscriptions table
- `src/lib/scraper.ts` — can trigger push after scrape

### Integration Points
- `src/app/manifest.ts` — new file for web app manifest
- `src/app/sw.ts` — modify caching strategies
- `src/app/offline/page.tsx` — new offline fallback route
- `src/app/api/push/subscribe/route.ts` — new API route
- `src/app/api/push/send/route.ts` — new API route
- `src/hooks/useInstallPrompt.ts` — new hook
- `src/components/pwa/InstallBanner.tsx` — new component

</code_context>

<specifics>
## Specific Ideas

- Serwist v9 API: use `RuntimeCaching` array with `urlPattern`, `handler`, `options`
- For push: generate VAPID keys with `web-push generate-vapid-keys`
- Breaking news detection in scraper: threads with fire icon type or "Breaking" in title

</specifics>

<deferred>
## Deferred Ideas

None — all PWA features are in scope

</deferred>
