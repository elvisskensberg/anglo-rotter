# Feature Landscape

**Domain:** Citizen journalism forum / news aggregation PWA
**Project:** MultiRotter (English LTR clone of Rotter.net)
**Researched:** 2026-03-22
**Confidence:** HIGH for forum features (well-established domain), MEDIUM for PWA-specific behaviors

---

## Table Stakes

Features users expect from a citizen journalism forum. Missing any of these and the platform feels broken or incomplete — users leave immediately.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Thread listing with sort/pagination | Core forum mechanic — every forum has it | Low | 6-column table (icon, title, author/date, last reply, replies, views); pagination with rows-per-page dropdown (15/30/50/100/150/200/250/300) |
| Thread view with reply tree | Threaded nested replies are the DNA of Rotter's UX | Medium | 4-level nesting with indentation; linear fallback not appropriate here — Rotter is specifically a threaded tree forum |
| Hot thread indicators | Users need visual signals for trending content | Low | Icon change (general → hot → fire) + red view count; threshold-based on view count |
| Breaking news feed on homepage | The entire value proposition — citizen scoops before mainstream media | Low | Red timestamp + navy headline pairs; center column; auto-populated from scoops forum |
| Auto-refresh | News forums must stay current without manual reload | Low | Per-page intervals: homepage 13min, news 9min, English news 5min, forum list 60min — configurable |
| Category navigation (dropdown menus) | Users navigate between forum categories | Medium | Hover-triggered dropdowns; blue nav bar + orange nav bar; matches Rotter's two-bar system |
| Thread tooltip on hover | Rotter signature feature — preview without click | Medium | Mouse-following tooltip with thread preview; `#7D92A9` header + `#e6f2ff` body |
| Forum headlines page | Chronological and by-last-reply views are core navigation patterns | Low | Two views: chronological + latest-reply; 4-column table (icon, title, time, author) |
| News flash page (mivzakim) | Aggregated news items with category tabs is standard for news portals | Medium | Category tabs (News, Sports, Economy, Tech, All); 4-column rows; source icons |
| Search | Users must be able to find threads/posts | Low–Medium | Start with client-side text search; full-text DB search in v2 |
| User registration and login | Any forum with user-generated content requires identity | Medium | Email/password auth; session management; rate limiting on post |
| Post new thread | Primary contribution mechanic — without it it's read-only | Medium | Title + body form; category selection; CAPTCHA or rate limit to prevent spam |
| Reply to thread | Secondary contribution mechanic — discussion requires replies | Medium | Quick reply (inline toggle) + full reply form; nesting reply to specific posts |
| User profile (post count, member since, star rating) | Community trust signals — users vet each other by history | Low | Username, post count, join date, star rating (1–5), rater count and points |
| Thread rating/feedback | Rotter's trust mechanism for surfacing quality scoops | Low | Per-thread up/feedback rating; green `#006633` point display on author info |
| Alternating row colors | Visual scannability — every table-based forum has this | Low | Odd `#FDFDFD`, even `#eeeeee` — already in design spec |
| Visited link state | Users must know what they've read | Low | Visited links: `#909090`; critical for news consumption loops |
| Breadcrumb navigation | Orientation in nested forum structure | Low | Forum > Category > Thread — standard wayfinding |
| PWA installability | The product is explicitly a PWA — install prompt is non-negotiable | Medium | `manifest.json`, service worker, install prompt banner |
| Offline shell / cached content | PWA contract — install implies some offline capability | Medium | Cache-first for static assets; stale-while-revalidate for forum data |

---

## Differentiators

Features that give MultiRotter competitive advantage over generic forum clones. Not universally expected, but high-value when present.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Red Alert / Breaking emergency threads | Rotter's most distinctive cultural feature — missile alerts, security events surface as special thread type | Medium | Visual treatment distinct from regular threads (fire icon + red styling); "Red Alert" prefix in title; could integrate with Israeli Home Front Command public API for real alerts |
| Push notifications for breaking news | PWA + breaking news = natural pairing; most news forums don't do this well | High | Requires Web Push API + service worker + backend subscription store; iOS 16.4+ only if installed; delivers before user opens app |
| Retro aesthetic as identity | The design IS the differentiator; authenticity draws Rotter expats and retro-internet nostalgists | Low (already specced) | No modernization; GIF-aesthetic SVGs; exact hex palette; table-based layout — this is already the core bet |
| Scrape-seeded content | Empty forum is a death loop; bootstrapping with translated Rotter content jumpstarts community | High | Python scraper → English translation pipeline → SQLite seed; legal/ethical risk to manage |
| "Scoop before mainstream media" culture | Rotter's founding value — surfacing this in UX (scoop badges, first-to-post signals) | Medium | Could add "First Scoop" indicator for threads that originate new news; low friction posting to encourage speed |
| Forum moderator display | Rotter shows moderator list prominently — community trust signal | Low | Moderator list in forum header; linked to profiles |
| Configurable rows-per-page | Power user feature; Rotter offers 15/30/50/100/150/200/250/300 options | Low | Dropdown in pagination controls; localStorage persistence |
| Exclusive forum sidebar ticker | Right-sidebar scrolling ticker of exclusive/featured threads | Low | Auto-scrolling `overflow-y:scroll` div; 300px × 430px; distinct from main feed |
| Thread count + view count visible in list | Standard forum UX but important for news triage — readers scan by reply count to assess importance | Low | Already in 6-column spec; hot threshold (red views) is the differentiator |
| Sort by last reply | Threads that are actively being discussed vs. just posted — different consumption modes | Low | Toggle between chronological and last-reply sort on headlines page |

---

## Anti-Features

Features to explicitly NOT build, with rationale. Building these would waste engineering cycles, introduce risk, or contradict the project's identity.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Real-time WebSocket chat | Adds infrastructure complexity (persistent connections, scaling, presence) disproportionate to value for a news forum; Rotter itself doesn't have it; polling is sufficient | Use `setInterval` polling + `auto-refresh` meta tags as Rotter does |
| Private messaging (v1) | Requires inbox UI, notification routing, spam management — significant scope for a clone that doesn't prioritize social graph | Mark as v2; users can interact via thread replies |
| Moderation admin panel (v1) | Complex role-based UI; Rotter's moderation is minimal and community-driven | Seed with trusted content; add basic report flag first; admin panel is v2 |
| Ad integration (DFP / Taboola) | Requires ad account setup, GDPR consent flows, performance cost from third-party scripts — none of this serves v1 validation | Leave ad placeholder divs in layout (matching Rotter structure) but serve empty |
| RTL / Hebrew support | Project explicitly LTR English-only; adding RTL doubles CSS complexity and testing surface | English-only; LTR mirror of Rotter's layout |
| Separate mobile pages | Rotter does this via user-agent detection and `/mobile/` routes; the PWA contract replaces this | PWA + responsive viewport (640px breakpoint) handles mobile |
| Karma/Reddit-style upvote feed ranking | Changes the fundamental character of the platform from chronological citizen journalism to algorithmic curation; Rotter is chronological + reply-activity sorted, not upvote-sorted | Keep chronological sort as default; hot indicator is threshold-based (view count), not vote-based |
| Email newsletter / digest | Subscription management, deliverability, unsubscribe compliance — high ops burden for v1 | Push notifications via PWA are the modern equivalent; build that instead |
| Rich text editor (WYSIWYG) | Rotter uses plain text; a WYSIWYG editor requires sanitization, XSS hardening, and adds posting friction | Plain textarea with basic line-break preservation; markdown if needed in v2 |
| User-to-user following/social graph | This is a news forum, not a social network; following turns it into Twitter-lite | User profiles show history; community is flat/equal by design |
| Payment / premium tiers | Rotter is free; introducing payment gates breaks the citizen journalism ethos | Keep free; monetize via ads in v2 if ever |
| Infinite scroll | Breaks browser back-button behavior in classic forum UX; Rotter uses explicit pagination | Stick with explicit pagination with rows-per-page control |

---

## Feature Dependencies

```
User Registration + Login
  → Post New Thread
  → Reply to Thread
  → Thread Rating/Feedback
  → User Profile (post count, member since)

Thread Listing (Forum View)
  → Thread Tooltip on Hover
  → Hot Thread Indicators (view count threshold)
  → Pagination + Rows-per-page

Thread View
  → Reply Tree (nesting requires thread view scaffold)
  → Quick Reply Form (requires auth)
  → Thread Rating (requires auth)

Data Layer (API Routes + SQLite)
  → Breaking News Feed (homepage center column)
  → News Flash Page (mivzakim)
  → Forum Headlines Page
  → Auto-refresh (needs something to refresh to)

PWA Manifest + Service Worker
  → Offline Shell
  → Push Notifications (service worker is prerequisite)
  → App Install Prompt

Scraper Pipeline
  → Seeded Content (required to avoid empty forum at launch)
  → Breaking News Feed (can't populate without data)

Search
  → No strong dependencies; can be client-side on existing data
```

---

## MVP Recommendation

The MVP is a read-heavy, content-seeded forum that proves the aesthetic and navigation work. User-generated content is secondary to establishing the reading experience.

**Prioritize (Phase 1–6):**
1. Exact visual replication — design system, layout, color palette, icons (the differentiator IS the aesthetic)
2. Homepage with breaking news feed — center column; auto-refresh; seeded data
3. Forum listing — 6-column thread table; hot indicators; tooltip; pagination
4. Thread view — OP block; reply tree; author info; star ratings display
5. News flash page — category tabs; mivzakim items
6. Forum headlines page — chronological + by-last-reply

**Phase 7 (Data Layer):**
7. API routes; SQLite storage; scraper-seeded content; auto-refresh polling

**Phase 8 (PWA):**
8. manifest.json; service worker; offline shell; push notifications

**Phase 9 (User Features — last because forum can function read-only):**
9. Auth (registration/login); post thread; reply; thread rating; user profile

**Defer to v2:**
- Private messaging
- Moderation admin panel
- Red Alert API integration (display is in-scope; live API feed is v2)
- Full-text search (client-side search is v1)
- Push notification subscription management UI

---

## Sources

- Rotter.net design specification extracted from live site (`data/design/DESIGN_SPECIFICATION.md`)
- PROJECT.md and PWA_PLAN.md (project requirements and phase breakdown)
- [Top 15 Forum Software Features for Online Communities in 2026](https://socialengine.com/blog/top-15-features-of-forum-software-for-building-online-community-in-2025/) — forum feature baseline
- [Web Discussions: Flat by Design](https://blog.codinghorror.com/web-discussions-flat-by-design/) — threaded vs. flat discussion tradeoffs
- [WebSocket vs Polling: Real-Time Web Communication Guide 2025](https://www.mergesociety.com/code-report/websocket-polling) — polling sufficient for news forum refresh cadence
- [Using Push Notifications in PWAs: The Complete Guide](https://www.magicbell.com/blog/using-push-notifications-in-pwas) — PWA push notification capabilities and iOS constraints
- [DCForum GitHub](https://github.com/DCForum/dcforum) — original DCForum/DCBoard feature reference (Rotter's actual forum engine)
- [Rotter.net: Israel's Pioneering Internet Platform](https://moreshet.com/en/rotter-net-israel-s-pioneering-internet-platform) — Rotter cultural/historical context
- [Popularity and Quality in Social News Aggregators: Reddit and Hacker News](https://www.researchgate.net/publication/311491206_Popularity_and_Quality_in_Social_News_Aggregators_A_Study_of_Reddit_and_Hacker_News) — news aggregation ranking mechanics
