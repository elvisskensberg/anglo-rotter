---
phase: 08-pwa-completion
plan: 03
subsystem: ui
tags: [pwa, install-prompt, react, hooks, css-modules, nextjs]

# Dependency graph
requires:
  - phase: 08-01
    provides: PWA manifest and service worker foundation
provides:
  - useInstallPrompt hook capturing beforeinstallprompt with standalone detection and 7-day dismissal TTL
  - InstallBanner component rendering fixed-bottom install CTA in Rotter blue theme
  - Root layout wired with InstallBanner as last body child
affects: [08-04, pwa-notifications, future-pwa-phases]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Client hook pattern for browser install API capture (useInstallPrompt)"
    - "CSS Modules for PWA UI components (no Tailwind — matches project convention)"
    - "Server component root layout importing client components directly (Next.js boundary)"

key-files:
  created:
    - src/hooks/useInstallPrompt.ts
    - src/components/pwa/InstallBanner.tsx
    - src/components/pwa/InstallBanner.module.css
  modified:
    - src/app/layout.tsx

key-decisions:
  - "BeforeInstallPromptEvent typed inline (not in standard TypeScript lib) — interface extends Event"
  - "7-day dismissal TTL stored in localStorage key pwa-install-dismissed as { dismissed: timestamp }"
  - "Standalone mode check (display-mode: standalone) prevents banner re-appearing after install"
  - "layout.tsx stays as server component — Next.js handles client boundary at InstallBanner level"

patterns-established:
  - "PWA install hook: capture, defer, re-prompt or dismiss pattern"
  - "CSS Module class naming: .banner, .actions, .installButton, .dismissButton"

requirements-completed: [PWA-05, PWA-06]

# Metrics
duration: 8min
completed: 2026-03-24
---

# Phase 08 Plan 03: PWA Install Banner Summary

**Dismissible fixed-bottom install banner with useInstallPrompt hook capturing beforeinstallprompt, standalone detection, 7-day dismiss TTL, and Rotter blue theme styling wired into root layout**

## BLOCKING ISSUES

None

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-24T18:32:09Z
- **Completed:** 2026-03-24T18:40:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- `useInstallPrompt` hook captures `beforeinstallprompt`, checks standalone mode and localStorage TTL before showing
- `InstallBanner` component renders fixed-bottom banner with Install/Dismiss buttons using Rotter blue (#3293CD)
- Root layout (`layout.tsx`) wired to include `<InstallBanner />` as last body child
- `pnpm build` passes cleanly with no TypeScript errors

## Task Commits

Each task was committed atomically:

1. **Task 1: useInstallPrompt hook and InstallBanner component** - `b22e210` (feat)
2. **Task 2: Wire InstallBanner into root layout** - `36f0f66` (feat)

**Plan metadata:** (final docs commit — see completion)

## Files Created/Modified

- `src/hooks/useInstallPrompt.ts` - Hook capturing beforeinstallprompt, standalone check, 7-day dismiss TTL
- `src/components/pwa/InstallBanner.tsx` - Fixed-bottom install banner client component
- `src/components/pwa/InstallBanner.module.css` - Banner styles in Rotter blue with hover states
- `src/app/layout.tsx` - Root layout: added InstallBanner import and render

## Decisions Made

- `BeforeInstallPromptEvent` typed via inline interface extending `Event` — not available in standard TypeScript lib
- `layout.tsx` remains a server component; `InstallBanner` carries `"use client"` at its own boundary — valid Next.js 15 pattern
- CSS Modules used (not Tailwind) to match project convention for PWA components

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Evidence (§16)

- `pnpm build` succeeds with no errors `[CODE:build-output]`
- `grep "InstallBanner" src/app/layout.tsx` returns 2 matches (import + render) `[CODE:layout.tsx]`
- `grep "beforeinstallprompt" src/hooks/useInstallPrompt.ts` returns 2 matches (add + remove listener) `[CODE:useInstallPrompt.ts]`
- `npx tsc --noEmit` exits clean `[CODE:tsc]`

## Investigation Evidence (§17)

All verdicts PASS — no investigation needed

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Install banner infrastructure complete; ready for push notifications (08-04)
- The banner only shows when browser fires `beforeinstallprompt` — untestable in SSR/build but logic is correct
- No manual configuration required

## Self-Check

1. Verified: YES — `pnpm build` output confirmed, grep matches confirmed, all artifacts found via `test -f`
2. Correct source: YES — CODE evidence tags used (no prod/E2E claim needed for component creation task)
3. Deltas investigated: YES — N/A, no comparisons run
4. All substeps: YES — hook created, banner created, CSS created, layout wired, build verified
5. Artifacts exist: YES — `test -f` passed for all 4 files
6. DATA verdicts: NO DATA used
7. Hostile reviewer: YES — build output shown, grep matches quoted, commits recorded with hashes

## Self-Check: PASSED

---
*Phase: 08-pwa-completion*
*Completed: 2026-03-24*
