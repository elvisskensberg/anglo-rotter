# Project Research Summary

**Project:** MultiRotter PWA
**Domain:** Retro citizen journalism forum — English LTR clone of Rotter.net
**Researched:** 2026-03-22
**Confidence:** HIGH

## Executive Summary

MultiRotter is an English-language PWA clone of Rotter.net, Israel's oldest citizen journalism forum. The product's central bet is that the retro aesthetic IS the differentiator — pixel-exact table-based layout, exact hex palette, and GIF-era icon aesthetic recreated faithfully in modern Next.js. The recommended build approach is a staged UI-first strategy: build all pages with static seed data first to prove visual fidelity, then wire up the data layer, then add PWA capabilities, and finally enable user-generated content. This order is critical because the visual replication is the hardest and most distinctive work — if it fails, nothing else matters.

The stack is well-settled: Next.js 15 (App Router) + TypeScript + CSS Modules for rendering, Turso (libSQL) + Drizzle ORM for the database, Better Auth for sessions, and Serwist for PWA/offline support. Every technology choice is constrained by either project spec or production environment reality (Vercel's ephemeral filesystem rules out local SQLite; Lucia Auth was deprecated in March 2025; next-pwa is unmaintained). There are no speculative choices — each technology is the documented 2026 standard for this architecture.

The primary risks are technical and legal. On the technical side: React hydration failures from `<table>` elements without explicit `<tbody>`, Cloudflare blocking the content scraper in production, and applying the wrong service worker caching strategy to API routes. On the legal side: scraped Rotter content is copyrighted and may not be published publicly — seeded content is for private dev only. The public launch must rely on user-generated content. Both risks have clear mitigations documented in research and must be addressed at the phases where they first appear.

---

## Key Findings

### Recommended Stack

The stack is tightly constrained by the Vercel deployment target and 2026 ecosystem realities. Start with `npx create-next-app@15` using TypeScript, App Router, no Tailwind, and CSS Modules. The database must be Turso (not local SQLite) from Phase 7 onward — Vercel's ephemeral filesystem silently wipes local `.db` files on every deploy. Drizzle ORM is the correct pairing: TypeScript-native, zero-overhead, first-class libSQL support. For auth, Better Auth replaces Lucia (deprecated March 2025) and is cleaner than Auth.js v5 for email/password flows.

For PWA: use `@serwist/next` (v9.x) — it is the maintained successor to both abandoned `next-pwa` and `@ducanh2912/next-pwa`. Serwist requires webpack (use `next dev --webpack` when testing service worker behavior). The web manifest is handled by Next.js's built-in `app/manifest.ts` convention; push notifications use `web-push` as shown in the official Next.js PWA guide.

**Core technologies:**
- **Next.js 15.x** (App Router): Full-stack framework — project constraint; SSR/ISR/Server Actions are all required
- **React 19.x**: UI library — bundled with Next.js 15, no choice needed
- **TypeScript 5.x**: Type safety — project constraint; critical for multi-page maintainability
- **CSS Modules** (built-in): Component-scoped styles — project constraint; essential for pixel-exact retro layout
- **Turso + `@libsql/client`**: Cloud SQLite — only viable SQLite option on Vercel serverless
- **Drizzle ORM 0.45.x** + **drizzle-kit**: Query builder + migrations — TypeScript-native, fastest cold starts, best libSQL support
- **Better Auth** (latest): Session auth — TypeScript-first, supports email/password + OAuth, natively supports SQLite
- **`@serwist/next` 9.5.x**: Service worker + offline caching — official Next.js recommendation, maintained App Router successor
- **`web-push`** (latest): Push notification sending — shown in official Next.js PWA documentation

**Do not use:** `better-sqlite3` on Vercel, `next-pwa` (abandoned), `@ducanh2912/next-pwa` (superseded), Lucia Auth (deprecated March 2025), Prisma (heavy cold starts), Tailwind (incompatible with retro layout philosophy).

See `.planning/research/STACK.md` for full alternatives table and install commands.

---

### Expected Features

The MVP is a read-heavy, content-seeded forum that proves the aesthetic and navigation work before adding user-generated content. The recommended build priority puts visual replication and read paths first; auth and write paths last.

**Must have — table stakes (v1):**
- Thread listing with 6-column table (icon, title, author/date, last reply, replies, views) + pagination
- Thread view with threaded nested reply tree (4-level indentation; flat `parent_id` model)
- Hot thread indicators (threshold-based icon change + red view count)
- Breaking news feed on homepage (center column; auto-refresh every 13 min)
- Auto-refresh with page-specific intervals (homepage 13 min, news 9 min, English news 5 min)
- Dropdown category navigation (hover-triggered; blue nav bar + orange nav bar)
- Thread tooltip on hover (mouse-following preview; Rotter signature UX)
- Forum headlines page (chronological + by-last-reply views)
- News flash page / mivzakim (category tabs; source icons)
- User registration and login (email/password; session management; rate limiting)
- Post new thread + reply to thread (plain textarea; no WYSIWYG)
- User profile (post count, member since, star rating)
- Thread rating/feedback
- PWA installability (manifest + service worker + install prompt)
- Offline shell with cached content

**Should have — differentiators (v1):**
- Retro aesthetic as identity (exact hex palette, CSS variables, GIF-era icons — this IS the product)
- Scraper-seeded content (empty forum = death loop; seed from Rotter data for private dev)
- Configurable rows-per-page (15/30/50/100/150/200/250/300; localStorage persistence)
- Push notifications for breaking news
- Alternating row colors, visited link state, breadcrumb navigation (all in design spec)
- Red Alert visual treatment for breaking emergency threads

**Defer to v2+:**
- Private messaging
- Moderation admin panel
- Red Alert live API integration (Israeli Home Front Command)
- Full-text database search (client-side search is v1)
- Push notification subscription management UI
- RTL/Hebrew support (explicitly out of scope — English LTR only)

**Explicit anti-features (never build):**
- Real-time WebSocket chat (polling is sufficient; Vercel doesn't support persistent connections)
- Infinite scroll (breaks forum back-button behavior; explicit pagination is correct)
- Rich text editor / WYSIWYG (Rotter uses plain text; adds XSS surface)
- Karma/Reddit-style upvote ranking (changes the fundamental character from citizen journalism)

See `.planning/research/FEATURES.md` for full dependency graph.

---

### Architecture Approach

The system has four distinct runtime concerns that must stay separated: the rendering layer (Next.js App Router pages and Server Components), the data API layer (Route Handlers at `/api/**`), the content pipeline (scraper + translator that populates the DB), and the PWA shell (service worker, manifest, push server). All database access flows through a single `lib/db.ts` module — pages never import libSQL directly. Server Components are the default; `'use client'` is added only to leaf components that need browser APIs (dropdown hover, tooltip mouse tracking, auto-refresh timers, PWA install prompt, push subscription).

**Major components:**
1. **Rendering layer** — Next.js App Router pages; Server Components by default; Client Components isolated to interactive leaves (DropdownMenu, ThreadTooltip, BreakingNews, QuickReplyForm, InstallPrompt, PushManager)
2. **Data API layer** — Route Handlers at `src/app/api/`; exclusive gateway to Turso; supports pagination (`?page=&limit=`), category filtering, and auth-gated writes
3. **Content pipeline** — Node.js fetch + cheerio scraper → DeepL translator → libSQL writer; triggered by GitHub Actions cron (every 15 min) via POST to `/api/scrape` with `CRON_SECRET` header; fire-and-forget, never serves requests
4. **PWA shell** — `app/manifest.ts` (Next.js built-in); `public/sw.js` (manual, ~50-100 lines); Serwist for offline caching; `web-push` Server Action for VAPID push delivery

**Threading data model:** Flat `parent_id` references — single `SELECT * FROM posts WHERE thread_id = ? ORDER BY created_at` plus client-side `Map<parent_id, Post[]>` tree walk in the `ReplyTree` Server Component. No recursive CTE needed.

**ISR strategy:** `export const revalidate = 60` on news pages; `revalidate = 300` on thread pages; auto-refresh client polling for UX fidelity (not data correctness).

**Vercel cron constraint:** Free tier allows only 1 cron/day. Use GitHub Actions scheduled workflow to POST to `/api/scrape` every 15 minutes instead.

See `.planning/research/ARCHITECTURE.md` for full component table, data flow diagrams, and build order.

---

### Critical Pitfalls

1. **Missing `<tbody>` in table components causes React hydration mismatch** — Always include explicit `<tbody>` (and `<thead>`) in every `<table>`. Browsers auto-insert `<tbody>`; React finds a DOM mismatch and re-renders client-side, killing SSR benefits and potentially breaking row alternating colors. Add a hydration smoke test for each table component in Phase 1 before building pages on top of them.

2. **Local SQLite file silently wiped on every Vercel deploy** — Never use `better-sqlite3` with a file path on Vercel. Ephemeral containers wipe the filesystem on every deploy. Use Turso (`@libsql/client` with `libsql://` URL) from Phase 7 onward. Use `file:local.db` only for local development via `DATABASE_URL` env var override.

3. **Cloudflare blocks the Rotter scraper at production scale** — `puppeteer-stealth` was deprecated February 2025 and no longer bypasses Cloudflare. Treat scraping as a manual one-time extraction, not a live pipeline. Use `curl-cffi` in the Python scraper (mimics real browser TLS fingerprint). Rate-limit aggressively (5-10 second delays, randomized). The long-term architecture is user-generated content.

4. **Cache-first service worker strategy applied to API routes freezes the forum** — Use `NetworkFirst` or `StaleWhileRevalidate` (max 60s cache age) for all `/api/**` routes. Reserve `CacheFirst` for static assets only (`/_next/static/`, SVGs, CSS). Failure means auto-refresh calls return stale cached responses indefinitely.

5. **Scraped Rotter content cannot be published publicly** — User-generated forum content is copyrighted. Scraped data is for private development seeding only. The public version must use MultiRotter user-generated content. Do not commit `data/snapshots/` or `data/threads/` to a public repository.

**Additional pitfalls to watch:**
- LTR mirroring is semantic, not a CSS transform — work from the design spec column-by-column (Phase 2)
- SVG icons render too smoothly vs. original GIFs — apply `image-rendering: pixelated` to all 16x16 icons (Phase 1)
- Browser UA table styles (`border-spacing: 2px`) break layout — add `table.reset.css` in `globals.css` (Phase 1)
- Windows-1255 encoding corruption from Rotter HTML — decode with `new TextDecoder('windows-1255')` before any processing (Phase 7)
- Push notifications require HTTPS — test only on Vercel preview deployments, never HTTP localhost tunnels (Phase 8)

See `.planning/research/PITFALLS.md` for full phase-by-phase warning matrix.

---

## Implications for Roadmap

Based on combined research, a 7-phase structure is recommended. The architecture research's 7-stage build order maps directly to phases, with the key insight being: build the UI skeleton against static data before touching the database. This validates the hardest part (visual fidelity) independently of backend complexity.

### Phase 1: Foundation and Design System
**Rationale:** Everything else builds on top of the layout shell and design tokens. Getting table components right (with `<tbody>`, table CSS resets, CSS custom properties) before building any pages prevents cascading rewrites. PWA library choice must be locked in here to avoid a late-stage swap.
**Delivers:** CSS design tokens, SVG icon set, layout shell (HeaderBar, BlueNavBar, OrangeNavBar, Footer), DropdownMenu (first client component pattern), root layout, PWA manifest, basic service worker.
**Addresses:** PWA installability (table stakes), retro aesthetic identity (differentiator).
**Avoids:** Pitfall 1 (hydration from missing tbody), Pitfall 2 (wrong PWA library), SVG icon rendering (pixelated CSS), table UA style defaults (global reset).
**Research flag:** Standard patterns — no deeper research needed. Next.js App Router layout and manifest are well-documented.

### Phase 2: Static UI Pages (Hardcoded Data)
**Rationale:** Build every page with hardcoded seed JSON before touching the database. This validates the visual replication against Rotter.net with zero backend risk. A full visual review can happen here before any infrastructure work.
**Delivers:** Homepage (3-column layout, breaking news center column), Forum listing page (6-column ThreadTable, hot indicators), Thread page (OriginalPost, ReplyTree), News flash/mivzakim page (category tabs), Headlines pages (chronological + by-last-reply).
**Addresses:** All read-path table stakes features. LTR mirroring validation (Pitfall 6 — catch before building 6+ pages with wrong column positions).
**Avoids:** Pitfall 6 (LTR mirroring) — design spec is the reference, not the live RTL site.
**Research flag:** Standard patterns for Next.js pages. Visual fidelity testing requires manual side-by-side comparison against Rotter.net on a Windows/Chromium browser.

### Phase 3: Data Layer
**Rationale:** The UI is validated; now connect it to a real, persistent data store. All database architecture decisions must be made here — not deferred. Turso from day one.
**Delivers:** TypeScript interfaces (Thread, Post, NewsItem, User), `lib/db.ts` Turso wrapper, database schema + migrations (drizzle-kit), API route handlers (`/api/forums/`, `/api/threads/`, `/api/news`), pages wired to API, ISR revalidation configured per page type.
**Addresses:** Data dependency for all forum pages; real thread counts and timestamps.
**Avoids:** Pitfall 5 (local SQLite on Vercel), Pitfall 4 (Windows-1255 encoding if any data is loaded from snapshots at this stage).
**Research flag:** Turso partial-sync package (`@tursodatabase/vercel-experimental`) — evaluate at this phase whether it improves cold-start read performance over standard HTTP connections.

### Phase 4: Content Pipeline
**Rationale:** The database exists; now seed it with real content. Cloudflare constraints mean this is manual extraction, not a live pipeline. GitHub Actions handles the cron scheduling (Vercel free tier = 1 cron/day).
**Delivers:** Scraper module (`lib/scraper.ts` with `curl-cffi` in Python for Cloudflare bypass), translator integration (DeepL API), writer module (upserts to Turso), `/api/scrape` endpoint with `CRON_SECRET` guard, GitHub Actions 15-minute cron workflow, `useAutoRefresh` client hook wired to BreakingNews and NewsPage.
**Addresses:** Scraper-seeded content (differentiator), auto-refresh (table stakes), breaking news feed (table stakes).
**Avoids:** Pitfall 3 (Cloudflare blocking automated requests), Pitfall 4 (Windows-1255 encoding corruption), Pitfall 10 (legal exposure — seed only for private dev; public version needs UGC).
**Research flag:** Needs phase research. Cloudflare bypass approaches evolve rapidly; verify `curl-cffi` is still effective at time of implementation. DeepL API rate limits and pricing need evaluation for the expected translation volume.

### Phase 5: User Interactivity and Auth
**Rationale:** The forum works read-only at this point. Auth and write paths come last because the read experience is the primary value proposition for v1. Auth gates all write operations.
**Delivers:** Better Auth setup (registration, login, session management), new thread form (Server Action write + rate limiting), QuickReplyForm (inline client component), thread tooltip (useTooltip hook with touch detection), hot thread indicators (view count threshold logic), thread rating (POST endpoint + star display), user profile page.
**Addresses:** User registration/login, post new thread, reply to thread, thread rating, user profile, tooltip (all table stakes).
**Avoids:** Pitfall 12 (touch tooltip — `navigator.maxTouchPoints` check in useTooltip from the start).
**Research flag:** Better Auth API may have changed since research — verify current version at `npm show better-auth version` before implementation.

### Phase 6: PWA Completion
**Rationale:** Service worker and push notifications depend on a working data layer and content pipeline. Notifications without content are meaningless. Phase order ensures push events trigger on real breaking news.
**Delivers:** VAPID key generation + env config, push subscription storage (Turso table + `/api/push/subscribe`), push send Server Action (`web-push`), offline page, extended SW caching (NetworkFirst for `/api/**`, CacheFirst for static assets), InstallPrompt client component.
**Addresses:** Push notifications (differentiator), offline shell (table stakes), PWA installability (table stakes — manifest was in Phase 1; this completes the full PWA contract).
**Avoids:** Pitfall 7 (stale API cache — define caching strategy matrix before Serwist config), Pitfall 14 (HTTPS requirement — test only on Vercel preview deployments).
**Research flag:** Standard patterns — Serwist caching strategies are well-documented. VAPID push flow is in official Next.js PWA guide.

### Phase 7: Polish and Launch
**Rationale:** Everything is functional; optimize for production quality.
**Delivers:** SEO (OG tags, `generateMetadata` per page), search (client-side filter on forum data), user profiles (`/user/[username]`), cross-platform visual testing (Windows/Chromium reference), Vercel production deployment (env vars, domain, production Turso URL), performance tuning.
**Addresses:** Search (table stakes — client-side only for v1), breadcrumb navigation, visited link state.
**Avoids:** Pitfall 8 (static export disabling ISR — confirm `output: 'export'` is NOT set), Pitfall 11 (font rendering differences — Windows as reference platform).
**Research flag:** Standard patterns. No additional research needed.

---

### Phase Ordering Rationale

- **UI before data** (Phases 1-2 before Phase 3): The visual replication is the riskiest and most distinctive work. Validating it with static data before touching infrastructure de-risks the hardest part early.
- **Data before pipeline** (Phase 3 before Phase 4): The scraper writes to the DB; the DB must exist and be correctly configured (Turso, not local SQLite) before the scraper is wired.
- **Read path before write path** (Phases 1-4 before Phase 5): The forum functions read-only. Auth/write complexity is contained to a single phase rather than spread across the build.
- **Content before push** (Phase 4 before Phase 6): Push notifications on breaking news are only meaningful once there is a real content pipeline delivering breaking news to push.
- **Foundation pitfalls addressed in Phase 1**: `<tbody>` tables, table CSS reset, icon rendering, and PWA library choice are all Phase 1 concerns — fixing them before any pages are built prevents cascading rework.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 4 (Content Pipeline):** Cloudflare bypass techniques evolve rapidly — verify `curl-cffi` status and rate-limit strategies at implementation time. Evaluate DeepL API pricing/limits for expected translation volume.
- **Phase 3 (Data Layer):** Evaluate Turso partial-sync (`@tursodatabase/vercel-experimental`) vs. standard HTTP connections for cold-start performance on Vercel.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** Next.js App Router layout, CSS Modules, and manifest conventions are thoroughly documented with official examples.
- **Phase 2 (Static UI):** Pure HTML/CSS component work — no external integrations.
- **Phase 6 (PWA Completion):** Serwist caching strategies and VAPID push flow are covered in the official Next.js PWA guide (updated 2026-02-11).
- **Phase 7 (Polish):** Standard Next.js SEO, metadata, and deployment patterns.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All major packages verified against official docs and release notes. Only Better Auth version needs `npm show` confirmation at install time. |
| Features | HIGH | Forum feature set is a well-established domain. PWA-specific behaviors are MEDIUM — iOS push notification support (16.4+ install-only) is an important caveat. |
| Architecture | HIGH | Backed by official Next.js docs, Vercel KB articles, and Turso official blog. Component boundary rules verified against official App Router guidance. |
| Pitfalls | HIGH | Verified from multiple sources; several pitfalls confirmed from official Next.js GitHub discussions and Vercel blog posts. |

**Overall confidence:** HIGH

### Gaps to Address

- **Better Auth current version**: Research confirmed active maintenance and Next.js 15 compatibility but could not confirm exact version number via Context7. Run `npm show better-auth version` before installing. API may have evolved.
- **Turso partial-sync maturity**: Released February 2026 (`@tursodatabase/vercel-experimental`). Evaluate at Phase 3 whether the experimental package is stable enough to use over standard `@libsql/client` HTTP connections. Decision impacts cold-start read performance.
- **Serwist + Turbopack compatibility**: Serwist requires webpack. Confirm `next dev --webpack` flag works correctly in Next.js 15 for SW development. Normal development (no SW testing) can use default Turbopack.
- **Scraper viability at implementation time**: Cloudflare protection evolves continuously. The `curl-cffi` approach was current as of research date (March 2026). Validate before committing to any automated scraping schedule.
- **Legal content policy**: Scraped Rotter content policy must be established before any public deployment. Check `rotter.net/robots.txt` and terms of service. Public v1 should rely on user-generated content, not seeded Rotter data.

---

## Sources

### Primary (HIGH confidence)
- [Next.js PWA Official Guide](https://nextjs.org/docs/app/guides/progressive-web-apps) — manifest, service worker, push notifications, Serwist recommendation (updated 2026-02-11)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — component boundary rules
- [Common Next.js App Router Mistakes — Vercel](https://vercel.com/blog/common-mistakes-with-the-next-js-app-router-and-how-to-fix-them) — anti-patterns
- [Next.js 15 + 16 release blogs](https://nextjs.org/blog/next-15) — version comparison, upgrade path
- [Turso + Vercel integration](https://vercel.com/marketplace/tursocloud) — SQLite on serverless
- [Bringing SQLite to Vercel Functions with Turso](https://turso.tech/blog/serverless) — ephemeral FS problem and Turso solution
- [Drizzle ORM with Turso tutorial](https://orm.drizzle.team/docs/tutorials/drizzle-with-turso) — ORM + libSQL integration
- [Next.js ISR Guide](https://nextjs.org/docs/app/guides/incremental-static-regeneration) — revalidate patterns and static export limitations
- [Next.js hydration error: table tbody mismatch (GitHub Discussion #36754)](https://github.com/vercel/next.js/discussions/36754)
- [Lucia Auth deprecation announcement (March 2025)](https://lucia-auth.com)
- [Serwist official docs](https://serwist.pages.dev/docs/next)

### Secondary (MEDIUM confidence)
- [Better Auth Next.js integration](https://better-auth.com/docs/integrations/next) — Better Auth recommendation and session model
- [How to bypass Cloudflare when scraping (ZenRows, Scrapfly)](https://scrapfly.io/blog/posts/how-to-bypass-cloudflare-anti-scraping) — curl-cffi approach; stealth plugin deprecation
- [Using Push Notifications in PWAs (MagicBell)](https://www.magicbell.com/blog/using-push-notifications-in-pwas) — iOS 16.4+ constraint, push subscription lifecycle
- [Vercel Cron Jobs template](https://vercel.com/templates/next.js/vercel-cron) — free tier 1/day limitation confirmed
- [Rotter.net: Israel's Pioneering Internet Platform (Moreshet)](https://moreshet.com/en/rotter-net-israel-s-pioneering-internet-platform) — cultural context
- Project source files: `data/design/DESIGN_SPECIFICATION.md`, `PROJECT.md`, `PWA_PLAN.md`

### Tertiary (LOW confidence)
- [Threaded comment data model (Medium)](https://medium.com/@pmadhav279/building-dynamic-conversations-a-step-by-step-guide-to-implementing-a-nested-comment-system-in-56055a586a50) — flat + parent_id pattern (community source, but pattern is standard)
- [Web scraping legality 2025 (Browserless, McCarthy Law)](https://mccarthylg.com/is-web-scraping-legal-a-2025-breakdown-of-what-you-need-to-know/) — legal exposure assessment (general guidance, not legal advice)

---
*Research completed: 2026-03-22*
*Ready for roadmap: yes*
