---
phase: 10-polish-and-launch
plan: "03"
subsystem: infra
tags: [vercel, nextjs, pwa, 404, deployment]

requires:
  - phase: 10-01
    provides: "metadata, layout components HeaderBar/BlueNavBar/OrangeNavBar in @/components/layout"
  - phase: 10-02
    provides: "OG image at /og-image.png"
provides:
  - "vercel.json with pnpm build command and PWA asset headers"
  - "Custom 404 not-found page matching retro Rotter aesthetic with layout chrome"
affects: [deployment, production]

tech-stack:
  added: []
  patterns:
    - "Server-component 404 page: no use client, imports layout chrome directly"
    - "vercel.json: no env vars in file — those belong in Vercel dashboard"

key-files:
  created:
    - vercel.json
    - src/app/not-found.tsx
  modified: []

key-decisions:
  - "Do not embed env vars in vercel.json — all secrets set via Vercel dashboard"
  - "not-found.tsx is a server component importing client-component layout tree (valid Next.js composition)"
  - "Table-based 404 layout matches forum style with #71B7E6 header / #FDFDFD body"

patterns-established:
  - "Error pages: server component, standard layout chrome, retro table styling"

requirements-completed: [POLISH-02, POLISH-03, POLISH-04]

duration: 8min
completed: 2026-03-23
---

# Phase 10 Plan 03: Vercel Deployment Config and Custom 404 Page Summary

**vercel.json with pnpm build + service worker headers, and a retro table-styled 404 page using the standard Rotter layout chrome**

## BLOCKING ISSUES

None

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-23T00:00:00Z
- **Completed:** 2026-03-23T00:08:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Created vercel.json with `buildCommand: "pnpm build"` ensuring Serwist webpack requirement is met on Vercel
- Added service worker `no-cache` headers and `Service-Worker-Allowed: /` scope header
- Added `Content-Type: application/manifest+json` header for webmanifest
- Created custom 404 page (src/app/not-found.tsx) as a server component with full layout chrome
- 404 page uses retro table layout matching forum style: #71B7E6 header row, #FDFDFD content row, #000099 link

## Task Commits

1. **Task 1: Vercel deployment config** - `92e3753` (chore)
2. **Task 2: Custom 404 not-found page** - `26997dc` (feat)

## Files Created/Modified

- `vercel.json` - Vercel deployment config with build command, framework, and PWA asset headers
- `src/app/not-found.tsx` - Custom 404 page with HeaderBar/BlueNavBar/OrangeNavBar and retro table layout

## Decisions Made

- Do not include env vars in vercel.json — TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, CRON_SECRET, BETTER_AUTH_SECRET, BETTER_AUTH_URL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, NEXT_PUBLIC_VAPID_PUBLIC_KEY, NEXT_PUBLIC_BASE_URL all set in Vercel dashboard
- not-found.tsx is a server component — HeaderBar imports client AuthButton as a child, which is valid Next.js RSC composition
- 404 uses inline styles (not CSS modules) matching the plan spec for this one-off page

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Evidence

- vercel.json valid JSON with buildCommand `[CODE:vercel.json:3]`
- TypeScript compiles with no errors after adding not-found.tsx `[CODE:tsc --noEmit exit 0]`
- not-found.tsx has all required elements: HeaderBar, metadata, Page Not Found text `[CODE:src/app/not-found.tsx]`

## Investigation Evidence

All verdicts PASS — no investigation needed

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- vercel.json is in place — run `vercel deploy` from the project root to deploy
- All env vars listed in key-decisions must be set in the Vercel dashboard before first deploy
- Custom 404 page will render automatically for all unmatched routes in production

## Self-Check

1. Verified: YES — vercel.json validated via node require, TSC ran with zero output (no errors)
2. Correct source: YES — CODE tags used for file-level evidence (no E2E or PROD required for config/static files)
3. Deltas investigated: N/A — no comparisons performed
4. All substeps: YES — Task 1 (vercel.json), Task 2 (not-found.tsx), both committed atomically
5. Artifacts exist: YES — `test -f vercel.json` and `test -f src/app/not-found.tsx` both pass
6. DATA verdicts: NO DATA verdicts used
7. Hostile reviewer: YES — vercel.json validated as parseable JSON with correct keys; TSC produced zero output confirming type safety

## Self-Check: PASSED

---
*Phase: 10-polish-and-launch*
*Completed: 2026-03-23*
