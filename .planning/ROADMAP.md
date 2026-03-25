# Roadmap: MultiRotter PWA

## Overview

MultiRotter is built in 10 phases that front-load the hardest risk: pixel-exact visual replication of Rotter.net. Phases 1-6 deliver a complete read-only forum with static seed data — no backend required. Phase 7 wires in the real Turso database and content pipeline. Phase 8 completes the PWA contract with Serwist caching and push notifications. Phase 9 adds authentication and user-generated content. Phase 10 polishes for public launch with SEO, cross-platform visual testing, and production deployment. The ordering is deliberate: prove the retro aesthetic works before touching infrastructure; prove the forum reads correctly before enabling writes.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation and Design System** - Next.js project, CSS tokens, SVG icons, layout shell, Serwist setup
- [x] **Phase 2: Homepage** - 3-column layout with breaking news center feed and left ticker sidebar (completed 2026-03-22)
- [x] **Phase 3: Forum Listing** - 6-column thread table with hot indicators, tooltip, pagination, and dropdowns (completed 2026-03-22)
- [x] **Phase 4: Thread Page** - Original post block, nested reply tree, quick reply form, breadcrumb (completed 2026-03-22)
- [x] **Phase 5: News Flash Page** - Category tabs, source icons, auto-refresh, teal header layout (completed 2026-03-22)
- [x] **Phase 6: Headlines Page** - Chronological and by-last-reply views, sidebar layout (completed 2026-03-24)
- [x] **Phase 7: Data Layer and Content Pipeline** - Turso database, Drizzle schema, API routes, scraper, seed data (completed 2026-03-24)
- [x] **Phase 8: PWA Completion** - Serwist caching matrix, push notifications, offline page, install prompt (completed 2026-03-24)
- [ ] **Phase 9: Authentication and User Features** - Better Auth, post/reply forms, user profiles, thread rating
- [x] **Phase 10: Polish and Launch** - SEO metadata, visual QA, Vercel production deployment (completed 2026-03-24)

## Phase Details

### Phase 1: Foundation and Design System
**Goal**: The project scaffold exists with all visual building blocks — developers can open any future page and import the correct token, icon, or layout component without making a color or structural decision
**Depends on**: Nothing (first phase)
**Requirements**: DSGN-01, DSGN-02, DSGN-03, DSGN-04, LYOT-01, LYOT-02, LYOT-03, LYOT-04, LYOT-05
**Success Criteria** (what must be TRUE):
  1. A browser opening the root URL renders the HeaderBar with logo, gradient background, and date with no hydration console errors
  2. The blue navigation bar (25px) and orange navigation bar (24px) both render with correct hex colors and trigger dropdown menus on hover
  3. Every SVG icon (thread normal, hot, fire, camera, toolbar, reply tree, stars 1-5) renders at the correct pixel size with `image-rendering: pixelated` applied
  4. All page layouts use `<table>` elements with explicit `<tbody>` tags — no browser-inserted elements cause React hydration warnings
  5. CSS custom properties for the full Rotter hex palette are defined in globals.css and resolvable from any component
**Plans:** 4 plans

Plans:
- [x] 01-01-PLAN.md — Next.js scaffold + Serwist PWA shell
- [x] 01-02-PLAN.md — Test infrastructure, CSS design tokens, Table component
- [x] 01-03-PLAN.md — Complete SVG icon set (thread, toolbar, reply tree, stars, logo)
- [x] 01-04-PLAN.md — Layout components (HeaderBar, BlueNavBar, OrangeNavBar, DropdownMenu)

### Phase 2: Homepage
**Goal**: A visitor landing on the homepage sees a pixel-faithful 3-column layout with timestamped breaking news headlines and a scrolling left sidebar, using hardcoded seed data
**Depends on**: Phase 1
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05
**Success Criteria** (what must be TRUE):
  1. The homepage renders a 3-column table: 300px left sidebar, 450px center breaking news column, and right column — all columns visible without horizontal scroll at 1024px viewport width
  2. The breaking news center column shows timestamped headlines with red time labels and navy (#000099) headline text
  3. The left sidebar contains a 300x430px scrollable ticker div that overflows vertically
  4. The page auto-refreshes at the configured interval (default ~13 minutes) — a network request fires without user interaction
  5. Ad placeholder slots appear in the correct positions matching the Rotter.net layout
**Plans:** 2/2 plans complete

Plans:
- [x] 02-01-PLAN.md — Seed data, test stubs, leaf components (BreakingNewsFeed, TickerSidebar, AdSlot)
- [x] 02-02-PLAN.md — HomepageLayout 3-column table, auto-refresh, page.tsx wiring

### Phase 3: Forum Listing
**Goal**: A visitor can browse a forum's thread list with the exact 6-column Rotter table structure, see hot thread visual indicators, hover for a mouse-following tooltip, and paginate through results — all using hardcoded seed data
**Depends on**: Phase 1
**Requirements**: FORUM-01, FORUM-02, FORUM-03, FORUM-04, FORUM-05, FORUM-06, FORUM-07
**Success Criteria** (what must be TRUE):
  1. The thread table renders 6 columns (icon, title at 55% width, author+date, last reply, replies, views) with alternating row colors (#FDFDFD / #eeeeee)
  2. Threads with view counts above the hot threshold display the hot icon variant and the view count renders in red
  3. Hovering the thread icon produces a tooltip that follows the mouse cursor with a #7D92A9 header and #e6f2ff body
  4. Pagination controls show red page numbers and a rows-per-page dropdown offering 15/30/50/100/150/200/250/300 options
  5. The forum toolbar icons (Login, Help, Search, Post) render at 33x33px; the section dropdown navigates to different forum categories
**Plans:** 3/3 plans complete

Plans:
- [x] 03-01-PLAN.md — ForumThread interface, seed data, Wave 0 test stubs, ThreadRow component
- [x] 03-02-PLAN.md — ForumToolbar, PaginationBar, ForumSectionDropdown components
- [x] 03-03-PLAN.md — ForumThreadTable orchestrator with tooltip, route page wiring

### Phase 4: Thread Page
**Goal**: A visitor can read a full thread — seeing the original post with author details and star rating, a hierarchically indented reply tree, and breadcrumb navigation — using hardcoded seed data
**Depends on**: Phase 3
**Requirements**: THRD-01, THRD-02, THRD-03, THRD-04, THRD-05, THRD-06, THRD-07, THRD-08
**Success Criteria** (what must be TRUE):
  1. The original post block renders with an #eeeeee author info row showing username, star rating, member since date, post count, and raters/points
  2. Post content appears in a #FDFDFD area with a 16px bold h1 title inside a 70%-width nested table
  3. The reply tree table shows 4 columns (thread, author, date, number) with nested indentation (4 spaces per level) using message/reply_message icons
  4. Reply rows alternate between #eeeeee and #FDFDFD; the quick reply form is hidden by default and toggles visible on button click
  5. A #3293CD breadcrumb bar reads "Forums > Section > Thread #" and is navigable back to the forum listing
**Plans:** 4/4 plans complete

Plans:
- [x] 04-01-PLAN.md — Thread seed data (types + THREAD_SEED) and Wave 0 test stubs
- [x] 04-02-PLAN.md — ThreadBreadcrumb, OriginalPostBlock, ActionButtons components
- [x] 04-03-PLAN.md — ReplyTree, ReplyRow, QuickReplyForm components
- [x] 04-04-PLAN.md — ThreadPageClient wiring, barrel export, route page.tsx, FORUM_SEED URL fix

### Phase 5: News Flash Page
**Goal**: A visitor can read categorized news flash items (mivzakim) in the correct teal-header layout with category tab filtering, using hardcoded seed data
**Depends on**: Phase 1
**Requirements**: NEWS-01, NEWS-02, NEWS-03, NEWS-04
**Success Criteria** (what must be TRUE):
  1. The news page renders with a #eaf4ff body background and a #3984ad teal header bar with the logo
  2. Category tabs (News, Sports, Economy, Tech, All) render with #3984ad background and white text; clicking a tab filters visible items
  3. Each news item row is 24px tall with 4 columns: source icon, headline, time, and source name
  4. The page auto-refreshes every 5 minutes — a network request fires without user interaction
**Plans:** 2/2 plans complete

Plans:
- [x] 05-01-PLAN.md — NewsItem interface, seed data, Wave 0 test stubs, BlueNavBar link fix
- [x] 05-02-PLAN.md — News page components (NewsItemRow, NewsCategoryTabs, NewsTable, NewsPageLayout), route wiring

### Phase 6: Headlines Page
**Goal**: A visitor can see all recent threads chronologically or sorted by last reply in the correct two-column layout, using hardcoded seed data
**Depends on**: Phase 1
**Requirements**: HDLN-01, HDLN-02, HDLN-03, HDLN-04
**Success Criteria** (what must be TRUE):
  1. The headlines page renders a two-column layout with a 160px left sidebar and main content area
  2. The thread listing shows a 4-column table: 16x16 icon, title at 70% width, time+date, and author
  3. Thread icons correctly distinguish between normal, fire (alert), and camera (media) types
  4. A sort toggle button switches between chronological order and by-last-reply order — the list reorders visibly without a page reload
**Plans:** 2/2 plans complete

Plans:
- [x] 06-01-PLAN.md — HeadlineRow component with icon type classification (normal/fire/camera)
- [x] 06-02-PLAN.md — HeadlinesTable sort toggle, HeadlinesPageLayout 2-column layout, /headlines route

### Phase 7: Data Layer and Content Pipeline
**Goal**: All pages serve real content from Turso — threads, posts, and news items are loaded from a live database seeded with translated Rotter.net content, and a scraper pipeline can refresh that content
**Depends on**: Phase 6
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, DATA-06
**Success Criteria** (what must be TRUE):
  1. All forum, thread, and news pages load data from `/api/forums/[forumId]`, `/api/threads/[threadId]`, and `/api/news` — no hardcoded JSON remains in page components
  2. The Turso database (not local SQLite) contains seeded thread and post data translated to English and readable in a browser on Vercel
  3. The scraper pipeline can be triggered via POST to `/api/scrape` with the `CRON_SECRET` header and successfully writes new content to Turso
  4. Auto-refresh polling on each page type fires at the correct interval (homepage 13 min, news 5 min) and updates displayed content without a full page reload
  5. TypeScript interfaces (Thread, Post, ForumListing, NewsItem, User) are defined and enforced — type errors in the data layer cause build failures
**Plans:** 5/5 plans complete

Plans:
- [x] 07-01-PLAN.md — Drizzle + Turso setup, DB schema, TypeScript types
- [x] 07-02-PLAN.md — API routes: /api/forums, /api/threads, /api/news
- [x] 07-03-PLAN.md — Seed migration script from snapshots to database
- [x] 07-04-PLAN.md — Scraper pipeline + /api/scrape endpoint
- [x] 07-05-PLAN.md — Page rewiring to API + useAutoRefresh hook

### Phase 8: PWA Completion
**Goal**: The app is fully installable as a PWA with an offline shell, correct Serwist caching strategies per resource type, and working push notification delivery for breaking news
**Depends on**: Phase 7
**Requirements**: PWA-01, PWA-02, PWA-03, PWA-04, PWA-05, PWA-06
**Success Criteria** (what must be TRUE):
  1. The web app manifest declares name "MultiRotter", theme_color #71B7E6, and icons at multiple sizes — Chrome/Edge shows an install prompt on the address bar
  2. The service worker applies NetworkFirst to all `/api/**` routes and CacheFirst to `/_next/static/` and SVG assets — verified by checking the SW registration in DevTools
  3. Navigating to the app with the network offline shows the offline page with cached content rather than a browser error
  4. A subscribed user receives a browser push notification when a breaking news item is dispatched via the web-push VAPID endpoint
  5. The install prompt banner appears in-app and successfully triggers the native install flow on both mobile and desktop
**Plans:** 4/4 plans complete

Plans:
- [x] 08-01-PLAN.md — Manifest, PWA icons, custom Serwist caching strategies
- [x] 08-02-PLAN.md — Offline fallback page and SW offline navigation handler
- [x] 08-03-PLAN.md — Install prompt hook and banner component
- [x] 08-04-PLAN.md — Push notification infrastructure (DB, API, SW handler, scraper trigger)

### Phase 9: Authentication and User Features
**Goal**: Registered users can sign up, log in, post new threads, reply to threads, view their profile, and rate threads — the forum transitions from read-only to fully interactive
**Depends on**: Phase 7
**Requirements**: AUTH-01, AUTH-02, AUTH-03, USER-01, USER-02, USER-03, USER-04
**Success Criteria** (what must be TRUE):
  1. A new user can register with email and password via Better Auth, log in, and remain logged in across browser refreshes and tab reopens
  2. A logged-in user can log out from any page and is immediately redirected to a non-authenticated state
  3. A logged-in user can post a new thread to a forum and see it appear in the thread listing after submission
  4. A logged-in user can submit a quick reply or full reply to any thread and see their reply appear in the reply tree
  5. The user profile page displays the correct post count, member since date, and star rating calculated from thread ratings received
**Plans:** 4/5 plans executed

Plans:
- [x] 09-01-PLAN.md — Better Auth setup, Drizzle adapter, auth schema, API catch-all, middleware
- [x] 09-02-PLAN.md — Login and registration pages with auth forms
- [x] 09-03-PLAN.md — Header auth button (login/logout) visible on all pages
- [x] 09-04-PLAN.md — Thread posting API + reply API + auth-aware forms
- [x] 09-05-PLAN.md — User profile page + thread rating system

### Phase 10: Polish and Launch
**Goal**: The application is production-ready — pages have correct SEO metadata, the retro layout is visually verified against Rotter.net on a Chromium/Windows reference browser, and the app is live on Vercel with a production Turso database
**Depends on**: Phase 9
**Requirements**: (cross-cutting — no dedicated v1 requirements; delivers production quality for all 53 mapped requirements)
**Success Criteria** (what must be TRUE):
  1. Every page type has `generateMetadata` configured with title, description, and Open Graph tags — verified by pasting URLs into a social link preview tool
  2. A side-by-side comparison of MultiRotter against Rotter.net in Chromium on Windows shows no structural or color deviations in the table layouts, nav bars, and thread tables
  3. The Vercel production deployment is live at the target domain with production Turso credentials and all env vars set — no `NEXT_PUBLIC_*` secrets exposed
  4. Lighthouse PWA audit on the production URL passes all installability and offline checks
**Plans:** 3/3 plans complete

Plans:
- [x] 10-01-PLAN.md — SEO metadata on all pages (title, description, OG tags)
- [x] 10-02-PLAN.md — OG image and robots.txt static assets
- [x] 10-03-PLAN.md — Vercel deployment config and custom 404 page

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation and Design System | 0/4 | Planning complete | - |
| 2. Homepage | 2/2 | Complete   | 2026-03-22 |
| 3. Forum Listing | 3/3 | Complete   | 2026-03-22 |
| 4. Thread Page | 4/4 | Complete   | 2026-03-22 |
| 5. News Flash Page | 2/2 | Complete   | 2026-03-22 |
| 6. Headlines Page | 2/2 | Complete   | 2026-03-24 |
| 7. Data Layer and Content Pipeline | 5/5 | Complete   | 2026-03-24 |
| 8. PWA Completion | 4/4 | Complete   | 2026-03-24 |
| 9. Authentication and User Features | 4/5 | In Progress|  |
| 10. Polish and Launch | 3/3 | Complete    | 2026-03-24 |
