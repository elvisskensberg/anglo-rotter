# Requirements: MultiRotter PWA

**Defined:** 2026-03-22
**Core Value:** Users can post and consume breaking news scoops in real-time through a faithful replica of Rotter.net's iconic retro forum interface, installable as a PWA.

## v1 Requirements

### Design System (DSGN)

- [x] **DSGN-01**: CSS variables define exact Rotter hex color palette (#71B7E6, #3293CD, #000099, #FDFDFD, #eeeeee, etc.)
- [x] **DSGN-02**: Typography hierarchy matches Rotter (Arial primary, 15px thread titles, 16px post titles, 12px metadata)
- [x] **DSGN-03**: SVG icon set recreates all Rotter GIF icons (thread normal/hot/fire/camera, toolbar, reply tree, stars 1-5)
- [x] **DSGN-04**: Table components include explicit `<tbody>` to prevent React hydration mismatch

### Layout (LYOT)

- [x] **LYOT-01**: HeaderBar component displays logo, date, and search box on gradient background (1012px centered)
- [x] **LYOT-02**: Blue navigation bar (25px tall) with text-based nav buttons
- [x] **LYOT-03**: Orange navigation bar (24px tall) with text-based nav buttons
- [x] **LYOT-04**: Dropdown menus trigger on hover with #c6e0fb background and #D9D9D9 items
- [x] **LYOT-05**: All page layouts use table-based structure (actual `<table>` elements)

### Homepage (HOME)

- [x] **HOME-01**: 3-column layout: left sidebar (300px), center breaking news (450px), right column
- [x] **HOME-02**: Breaking news center shows timestamped headlines (red time + navy #000099 headline)
- [x] **HOME-03**: Left sidebar contains scrolling ticker div (300px wide, 430px tall, overflow-y:scroll)
- [x] **HOME-04**: Auto-refresh at configurable interval (default ~13 minutes)
- [x] **HOME-05**: Ad placeholder slots in correct positions

### Forum Listing (FORUM)

- [x] **FORUM-01**: 6-column thread table (icon, title 55%, author+date, last reply, replies, views)
- [x] **FORUM-02**: Alternating row colors (#FDFDFD / #eeeeee)
- [x] **FORUM-03**: Hot thread indicators: icon changes to hot variant, view count turns red
- [x] **FORUM-04**: Thread tooltip on icon hover (mouse-following, #7D92A9 header, #e6f2ff body)
- [x] **FORUM-05**: Pagination with red page numbers and rows-per-page dropdown (15/30/50/100/150/200/250/300)
- [x] **FORUM-06**: Forum toolbar with Login/Help/Search/Post icons (33x33)
- [x] **FORUM-07**: Multiple forum sections accessible via dropdown (scoops, politics, media, etc.)

### Thread Page (THRD)

- [x] **THRD-01**: Original post block with author info row (#eeeeee): username, star rating, member since, post count, raters/points
- [x] **THRD-02**: Post content area (#FDFDFD) with h1 title (16px bold) and content in 70%-width nested table
- [x] **THRD-03**: Action buttons row: edit, up, reply, view all, back to forum
- [x] **THRD-04**: Reply thread tree table with 4 columns (thread, author, date, number)
- [x] **THRD-05**: Nested reply indentation (4 spaces per level) with message/reply_message icons
- [x] **THRD-06**: Alternating row colors in reply tree (#eeeeee / #FDFDFD)
- [x] **THRD-07**: Quick reply form (hidden by default, toggled by button)
- [x] **THRD-08**: Breadcrumb navigation (#3293CD bar): Forums > Section > Thread #

### News Page (NEWS)

- [x] **NEWS-01**: Body background #eaf4ff, header with logo and #3984ad teal bar
- [x] **NEWS-02**: Category tabs row (#3984ad bg, white text): News, Sports, Economy, Tech, All
- [x] **NEWS-03**: News items table: each row 24px, 4 columns (source icon, headline, time, source name)
- [x] **NEWS-04**: Auto-refresh every 5 minutes

### Headlines Page (HDLN)

- [x] **HDLN-01**: Chronological thread listing with 4-column table (icon 16x16, title 70%, time+date, author)
- [x] **HDLN-02**: Sort toggle between chronological and by-last-reply views
- [x] **HDLN-03**: Thread icon types: normal, fire (alert), camera (media)
- [x] **HDLN-04**: Two-column layout: 160px sidebar + main content

### Data Layer (DATA)

- [x] **DATA-01**: TypeScript interfaces for Thread, Post, ForumListing, NewsItem, User
- [x] **DATA-02**: API routes: /api/forums/[forumId], /api/threads/[threadId], /api/news
- [x] **DATA-03**: Turso (libSQL) database with Drizzle ORM schema for forums, threads, posts, users
- [x] **DATA-04**: Seed data from scraped Rotter.net content (translated to English)
- [x] **DATA-05**: Content scraper service (adapt existing Python script or Node.js equivalent)
- [x] **DATA-06**: Auto-refresh polling on frontend per page type

### PWA (PWA)

- [x] **PWA-01**: Web app manifest with name "MultiRotter", theme_color #71B7E6, icons at multiple sizes
- [x] **PWA-02**: Serwist service worker with caching strategy matrix (CacheFirst for static, NetworkFirst for API)
- [x] **PWA-03**: Offline page displaying cached content
- [x] **PWA-04**: Push notification support for breaking news (VAPID + web-push)
- [x] **PWA-05**: App install prompt banner
- [x] **PWA-06**: Installable on mobile and desktop

### Authentication (AUTH)

- [x] **AUTH-01**: User can sign up with email and password (Better Auth)
- [x] **AUTH-02**: User session persists across browser refresh
- [x] **AUTH-03**: User can log out from any page

### User Features (USER)

- [x] **USER-01**: Authenticated user can post new threads
- [x] **USER-02**: Authenticated user can reply to threads (quick reply + full reply)
- [x] **USER-03**: User profile displays post count, member since date, star rating
- [x] **USER-04**: Thread rating/feedback system (raters count + points)

## v2 Requirements

### Moderation

- **MODR-01**: Admin can remove threads/posts
- **MODR-02**: Admin can ban users
- **MODR-03**: User can report content

### Social

- **SOCL-01**: Private messaging between users
- **SOCL-02**: Buddy list / follow system
- **SOCL-03**: User can bookmark threads
- **SOCL-04**: Thread subscription notifications

### Content

- **CONT-01**: Real-time Red Alert integration (Israeli Home Front Command API)
- **CONT-02**: Multi-language support (Hebrew + English)
- **CONT-03**: RSS feed output
- **CONT-04**: Search with full-text indexing

### Infrastructure

- **INFR-01**: Ad integration (Google DFP)
- **INFR-02**: Analytics dashboard
- **INFR-03**: CDN for uploaded images

## Out of Scope

| Feature | Reason |
|---------|--------|
| RTL support | English-only LTR version; would require entire layout rework |
| Ad integration | No ads in v1; focus on core forum functionality first |
| Payment processing | Free platform, no monetization in v1 |
| Real-time WebSocket | Polling at Rotter's own cadences (5-60 min) is sufficient; push notifications handle breaking news |
| Mobile-specific pages | PWA handles responsive; no separate /mobile/ routes like Rotter |
| Hebrew content | English only; translation happens at scrape time |
| Video hosting | Storage/bandwidth complexity; link to external platforms instead |
| OAuth social login | Email/password is sufficient for v1; matches Rotter's own auth model |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DSGN-01 | Phase 1 | Complete |
| DSGN-02 | Phase 1 | Complete |
| DSGN-03 | Phase 1 | Complete |
| DSGN-04 | Phase 1 | Complete |
| LYOT-01 | Phase 1 | Complete |
| LYOT-02 | Phase 1 | Complete |
| LYOT-03 | Phase 1 | Complete |
| LYOT-04 | Phase 1 | Complete |
| LYOT-05 | Phase 1 | Complete |
| HOME-01 | Phase 2 | Complete |
| HOME-02 | Phase 2 | Complete |
| HOME-03 | Phase 2 | Complete |
| HOME-04 | Phase 2 | Complete |
| HOME-05 | Phase 2 | Complete |
| FORUM-01 | Phase 3 | Complete |
| FORUM-02 | Phase 3 | Complete |
| FORUM-03 | Phase 3 | Complete |
| FORUM-04 | Phase 3 | Complete |
| FORUM-05 | Phase 3 | Complete |
| FORUM-06 | Phase 3 | Complete |
| FORUM-07 | Phase 3 | Complete |
| THRD-01 | Phase 4 | Complete |
| THRD-02 | Phase 4 | Complete |
| THRD-03 | Phase 4 | Complete |
| THRD-04 | Phase 4 | Complete |
| THRD-05 | Phase 4 | Complete |
| THRD-06 | Phase 4 | Complete |
| THRD-07 | Phase 4 | Complete |
| THRD-08 | Phase 4 | Complete |
| NEWS-01 | Phase 5 | Complete |
| NEWS-02 | Phase 5 | Complete |
| NEWS-03 | Phase 5 | Complete |
| NEWS-04 | Phase 5 | Complete |
| HDLN-01 | Phase 6 | Complete |
| HDLN-02 | Phase 6 | Complete |
| HDLN-03 | Phase 6 | Complete |
| HDLN-04 | Phase 6 | Complete |
| DATA-01 | Phase 7 | Complete |
| DATA-02 | Phase 7 | Complete |
| DATA-03 | Phase 7 | Complete |
| DATA-04 | Phase 7 | Complete |
| DATA-05 | Phase 7 | Complete |
| DATA-06 | Phase 7 | Complete |
| PWA-01 | Phase 8 | Complete |
| PWA-02 | Phase 8 | Complete |
| PWA-03 | Phase 8 | Complete |
| PWA-04 | Phase 8 | Complete |
| PWA-05 | Phase 8 | Complete |
| PWA-06 | Phase 8 | Complete |
| AUTH-01 | Phase 9 | Complete |
| AUTH-02 | Phase 9 | Complete |
| AUTH-03 | Phase 9 | Complete |
| USER-01 | Phase 9 | Complete |
| USER-02 | Phase 9 | Complete |
| USER-03 | Phase 9 | Complete |
| USER-04 | Phase 9 | Complete |

**Coverage:**
- v1 requirements: 53 total
- Mapped to phases: 53
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-22*
*Last updated: 2026-03-22 after initial definition*
