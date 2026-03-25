# Phase 10: Polish and Launch - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase makes the app production-ready: SEO metadata on all pages, visual polish to match Rotter.net, Vercel deployment config, and Lighthouse PWA audit compliance. No new features — only quality, correctness, and deployment.

</domain>

<decisions>
## Implementation Decisions

### SEO Metadata
- Every page type gets `generateMetadata` or `export const metadata` with title, description, OG tags
- Pages: homepage, forum listing, thread, news, headlines, auth pages, profile, offline
- OG image: use a static default OG image (Rotter.net blue theme)
- Canonical URLs via metadata

### Visual Polish
- Audit all pages against Rotter.net design specification (data/design/DESIGN_SPECIFICATION.md)
- Fix any color, spacing, font, or layout deviations
- Ensure alternating row colors, header backgrounds, link colors match exactly
- Verify icon rendering (thread icons, star ratings, toolbar icons)

### Vercel Deployment
- `vercel.json` or Vercel project settings (env vars)
- Required env vars: TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, CRON_SECRET, BETTER_AUTH_SECRET, VAPID keys
- No NEXT_PUBLIC_ secrets exposed (only NEXT_PUBLIC_VAPID_PUBLIC_KEY is safe)
- Production Turso database credentials
- Domain configuration

### Lighthouse PWA Audit
- Manifest correctly linked
- Icons at required sizes
- Service worker registered
- Offline fallback working
- Theme color set
- HTTPS (Vercel provides by default)

### Claude's Discretion
- Exact OG image design
- Whether to add robots.txt or sitemap.xml
- Error page styling (404, 500)
- Any minor visual tweaks within the retro aesthetic

</decisions>

<code_context>
## Existing Code Insights

### Pages Needing Metadata
- src/app/page.tsx (homepage)
- src/app/forum/[forumId]/page.tsx
- src/app/thread/[threadId]/page.tsx
- src/app/news/page.tsx
- src/app/headlines/page.tsx
- src/app/auth/login/page.tsx
- src/app/auth/register/page.tsx
- src/app/profile/[userId]/page.tsx
- src/app/offline/page.tsx

### Integration Points
- vercel.json — new deployment config
- public/og-image.png — new default OG image
- All page files — add/update metadata exports

</code_context>

<specifics>
## Specific Ideas

- Use the Rotter.net color palette for OG image: #71B7E6 blue with white "MultiRotter" text
- Reference data/design/DESIGN_SPECIFICATION.md for visual audit checklist

</specifics>

<deferred>
## Deferred Ideas

None — this is the final phase

</deferred>
