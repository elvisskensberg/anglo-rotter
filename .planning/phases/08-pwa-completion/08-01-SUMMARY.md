---
phase: 08-pwa-completion
plan: 01
subsystem: infra
tags: [pwa, serwist, service-worker, manifest, caching, next.js]

requires:
  - phase: 01-foundation-and-design-system
    provides: Serwist/Next.js PWA scaffolding with sw.ts and next.config.ts wired up

provides:
  - Web app manifest served at /manifest.webmanifest with MultiRotter identity and icons
  - Custom Serwist caching strategy matrix (NetworkFirst/CacheFirst/StaleWhileRevalidate)
  - PWA icon PNGs at 192x192 and 512x512 in public/icons/

affects: [09-auth, 10-deployment, any phase testing offline behavior]

tech-stack:
  added: []
  patterns:
    - "RuntimeCaching entries use instantiated strategy objects (new NetworkFirst()), not string names"
    - "ExpirationPlugin per cache entry for per-cache TTL and entry limits"
    - "Icon generation via raw PNG binary construction using Node.js zlib — no canvas dependency"

key-files:
  created:
    - src/app/manifest.ts
    - public/icons/icon-192x192.png
    - public/icons/icon-512x512.png
    - scripts/generate-icons.mjs
  modified:
    - src/app/sw.ts

key-decisions:
  - "RuntimeCaching handler field requires a strategy instance (new NetworkFirst()), not a string — Serwist v9 uses RouteHandler type not string union"
  - "ExpirationPlugin used for per-cache TTL instead of options.expiration shorthand — Serwist v9 uses plugin array"
  - "Cache name strings (api-cache, static-cache, etc.) are preserved in minified sw.js output, confirming strategies compiled correctly"

patterns-established:
  - "Strategy matrix order: specific patterns first (API, static, images) before catch-all navigation route"

requirements-completed: [PWA-01, PWA-02]

duration: 4min
completed: 2026-03-24
---

# Phase 08 Plan 01: PWA Manifest and Custom Caching Summary

**Web app manifest with MultiRotter identity + four-tier Serwist caching matrix (NetworkFirst/CacheFirst/StaleWhileRevalidate) replacing the default cache**

## BLOCKING ISSUES

None

## Performance

- **Duration:** ~4 min
- **Started:** 2026-03-24T18:26:26Z
- **Completed:** 2026-03-24T18:30:15Z
- **Tasks:** 2 completed
- **Files modified:** 5 (4 created, 1 modified)

## Accomplishments

- `src/app/manifest.ts` serves `/manifest.webmanifest` as a Next.js static route with name "MultiRotter", theme_color "#71B7E6", and maskable 512px icon
- Custom Serwist `runtimeCaching` array replaces `defaultCache` with four strategies tuned for MultiRotter resource types
- PWA icon PNGs generated via raw zlib/PNG binary construction — no canvas or external image dependency

## Task Commits

1. **Task 1: Web app manifest and PWA icons** - `3db4471` (feat)
2. **Task 2: Custom Serwist caching strategy matrix** - `3d72a4a` (feat)

## Files Created/Modified

- `src/app/manifest.ts` - MetadataRoute.Manifest with MultiRotter identity, theme blue, two icon entries
- `public/icons/icon-192x192.png` - Solid #71B7E6 PNG at 192x192 for standard PWA install icon
- `public/icons/icon-512x512.png` - Solid #71B7E6 PNG at 512x512 for maskable PWA icon
- `scripts/generate-icons.mjs` - Node.js script generating valid PNGs via raw IHDR+IDAT+IEND construction
- `src/app/sw.ts` - Custom runtimeCaching replacing defaultCache; NetworkFirst/CacheFirst/StaleWhileRevalidate with ExpirationPlugin

## Decisions Made

- Serwist v9 RuntimeCaching requires strategy instances not strings (`new NetworkFirst()` not `"NetworkFirst"`) — checked `.d.ts` type definitions before writing
- `ExpirationPlugin` attached as a plugin in the strategy constructor options array, not via `options.expiration` shorthand
- Icon generation uses raw PNG binary (IHDR + deflated scanlines + IEND) via Node.js `zlib.deflate` — avoids `canvas` npm package or native bindings

## Deviations from Plan

None — plan executed exactly as written. The plan correctly noted strategy instantiation pattern vs string names in the task description.

## Issues Encountered

None — TypeScript compiled cleanly on first attempt. Build succeeded and SW output verified to contain all four cache names.

## Evidence (§16)

- Build succeeds with "Compiled successfully" and `/manifest.webmanifest` shown as static route `[CODE:pnpm build output]`
- `public/sw.js` contains all four cache names: api-cache, static-cache, image-cache, page-cache `[CODE:grep public/sw.js]`
- No `defaultCache` reference in `src/app/sw.ts` — grep count = 0 `[CODE:grep src/app/sw.ts]`
- Both icon PNGs exist at correct paths `[CODE:test -f public/icons/icon-192x192.png]`
- TypeScript: `npx tsc --noEmit` exits 0 (no output) `[CODE:tsc output]`

## Investigation Evidence (§17)

All verdicts PASS — no investigation needed

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- PWA manifest is installable; Chrome DevTools Application > Manifest will show MultiRotter identity and icons
- Service worker caching matrix is active; Network tab will show cache strategy headers per route type
- Phase 08 Plans 02-04 can proceed (install prompt, offline page, push notifications)

## Self-Check

1. Verified: YES — ran pnpm build and confirmed /manifest.webmanifest route + grep confirmed cache names in public/sw.js
2. Correct source: YES — CODE evidence from actual file checks and build output (not E2E)
3. Deltas investigated: YES — N/A, no comparisons with non-zero delta
4. All substeps: YES — manifest.ts created, icons generated, sw.ts updated, build verified, no defaultCache
5. Artifacts exist: YES — `test -f public/icons/icon-192x192.png` and `test -f public/icons/icon-512x512.png` both passed
6. DATA verdicts: NO DATA used
7. Hostile reviewer: YES — build output shows /manifest.webmanifest as static route; grep on sw.js shows all 4 cache names present; TypeScript clean

## Self-Check: PASSED

---
*Phase: 08-pwa-completion*
*Completed: 2026-03-24*
