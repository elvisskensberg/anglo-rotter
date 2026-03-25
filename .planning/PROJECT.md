# MultiRotter PWA

## What This Is

An English Progressive Web App clone of Rotter.net, Israel's oldest citizen journalism forum (est. 1997). Replicates the exact same retro table-based layout, color palette, and page structure -- mirrored from RTL to LTR and localized to English. A breaking-news-first, user-driven scoops platform where citizens post news before mainstream media.

## Core Value

Users can post and consume breaking news scoops in real-time through a faithful replica of Rotter.net's iconic retro forum interface, installable as a PWA.

## Requirements

### Validated

(None yet -- ship to validate)

### Active

- [ ] Exact visual replication of Rotter.net's layout (table-based, retro aesthetic)
- [ ] Homepage with 3-column layout and breaking news center feed
- [ ] Forum listing with 6-column thread table (icon, title, author/date, last reply, replies, views)
- [ ] Thread page with original post block and nested reply tree
- [ ] News flash page with category tabs
- [ ] Forum headlines page (chronological and by-last-reply views)
- [ ] Complete design system matching Rotter's exact hex color palette
- [ ] SVG icon set recreating Rotter's GIF icons
- [ ] Blue + orange navigation bars with dropdown menus
- [ ] Hot thread indicators (icon change + red view count)
- [ ] Thread tooltip on hover (mouse-following)
- [ ] Auto-refresh on all pages (configurable interval)
- [ ] Data scraping from Rotter.net with English translation
- [ ] API routes for forums, threads, and news
- [ ] User authentication (email/password)
- [ ] Post new threads and replies
- [ ] User profiles (post count, member since, star rating)
- [ ] Thread rating/feedback system
- [ ] PWA manifest, service worker, offline support
- [ ] Push notifications for breaking news
- [ ] Installable on mobile and desktop

### Out of Scope

- RTL support -- this is an English-only LTR version
- Ad integration (DFP/Taboola) -- no ads in v1
- Payment processing -- free platform
- Moderation admin panel -- v2 feature
- Real-time chat/WebSocket -- polling is sufficient for v1
- Private messaging between users -- v2 feature
- Hebrew content display -- English only
- Mobile-specific separate pages (Rotter's /mobile/) -- PWA handles responsive

## Context

### Design Specification
A complete pixel-level design spec has been extracted from the live Rotter.net site and stored at `data/design/DESIGN_SPECIFICATION.md` (950+ lines). This covers:
- Full HTML structure of all 7 page types
- Complete CSS class reference with exact hex codes
- All icon/image assets documented
- JavaScript functionality (tooltips, dropdowns, auto-refresh)
- Typography hierarchy with exact sizes/weights
- Table structures for forum listings and thread views

### Raw HTML Source
Saved at `data/design/` -- homepage, scoops forum, thread page, news page, English news, forum list, and the main CSS file.

### Scraped Content
Forum data captured at `data/snapshots/` and `data/threads/` with 75 threads indexed and 5 threads with full comments (120 posts). A Python scraper exists at `scripts/extract_threads.py`.

### Implementation Plan
A detailed 10-phase plan exists at `PWA_PLAN.md` with component hierarchy, file structure, and design tokens.

### Platform Research
Comprehensive report at `Rotter.md` covering history, traffic (~12.6M monthly visits), cultural significance, business model, and technical architecture (DCForum/DCBoard CGI, PHP, Windows-1255 encoding).

## Constraints

- **Layout**: Must use table-based layout (actual `<table>` elements) to faithfully replicate Rotter's rendering -- no CSS Grid/Flexbox for core layouts
- **Colors**: Exact hex values from Rotter.net (#71B7E6, #3293CD, #000099, #FDFDFD, #eeeeee, etc.) -- no approximations
- **Typography**: Arial primary, same size hierarchy (15px thread titles, 16px post titles, 12px metadata)
- **No modernization**: No rounded corners, no shadows (except where Rotter has them), no CSS frameworks, no animations
- **Tech stack**: Next.js 15 App Router + TypeScript + CSS Modules + PWA
- **Data**: SQLite + JSON files for storage, Vercel for hosting
- **Encoding**: Site outputs UTF-8 (unlike Rotter's Windows-1255)
- **Direction**: LTR (mirror of Rotter's RTL) -- left sidebar where Rotter has right, etc.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Table-based layout over CSS Grid | Faithful to original Rotter rendering | -- Pending |
| Next.js 15 App Router | Best PWA support, SSR, Vercel integration | -- Pending |
| SVG icons over original GIFs | Modern format, same visual, scalable | -- Pending |
| SQLite over PostgreSQL | No infra needed, works locally and on Vercel via Turso | -- Pending |
| Scrape + translate content model | Bootstrap with real data, not empty forum | -- Pending |
| CSS Modules over Tailwind/styled-components | Closest to writing raw CSS matching Rotter's inline styles | -- Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check -- still the right priority?
3. Audit Out of Scope -- reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-22 after initialization*
