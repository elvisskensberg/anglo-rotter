# Architecture Patterns

**Domain:** Retro forum PWA (Next.js 15, table-based UI, SQLite, scraping pipeline)
**Project:** MultiRotter — English LTR clone of Rotter.net
**Researched:** 2026-03-22
**Confidence:** HIGH (backed by official Next.js docs + verified community patterns)

---

## Recommended Architecture

The system has four distinct runtime concerns that must be kept separate:

1. **Rendering layer** — Next.js App Router pages and components
2. **Data API layer** — Route handlers serving forum/thread/news JSON
3. **Content pipeline** — Scraper + translator that populates the data store
4. **PWA shell** — Service worker, manifest, push notification server

```
Browser (PWA Shell)
  |
  |-- Service Worker (sw.js)
  |     |-- Cache-first: static assets, icons, fonts, CSS
  |     |-- Network-first: /api/** (fall back to cached stale data)
  |     |-- Push: listens for breaking news events
  |
  |-- Next.js App Router Pages (SSR/ISR)
        |-- layout.tsx  (root shell: nav bars, header, footer)
        |-- /           (homepage: 3-col, Breaking News center)
        |-- /forum/[forumId]          (thread table)
        |-- /forum/[forumId]/[threadId] (OP + reply tree)
        |-- /news                     (mivzakim flashes)
        |-- /headlines                (chronological list)
        |-- /headlines/latest         (by last reply)
        |-- /search                   (client-side text search)
        |-- /user/[username]          (profile popup)
        |
        |-- /api/forums/[forumId]     (Route Handler → libSQL)
        |-- /api/threads/[threadId]   (Route Handler → libSQL)
        |-- /api/news                 (Route Handler → libSQL)
        |-- /api/push/subscribe       (Route Handler → subscriptions table)
        |-- /api/push/send            (Server Action, web-push lib)
        |-- /api/scrape               (Vercel Cron trigger endpoint)

Data Store (Turso / libSQL)
  |-- threads         (id, forum_id, title, author, created_at, views, replies, parent_id)
  |-- posts           (id, thread_id, parent_id, author, content, created_at)
  |-- news_items      (id, category, headline, source, published_at)
  |-- users           (id, username, email_hash, post_count, member_since, rating)
  |-- push_subscriptions (id, user_id, endpoint, keys_json)

Content Pipeline (Vercel Cron / GitHub Actions)
  |-- Scraper (Node.js fetch → Rotter.net Hebrew HTML)
  |-- Parser  (cheerio → structured JSON)
  |-- Translator (DeepL / Google Translate API → English text)
  |-- Writer  (upserts into libSQL via Turso HTTP API)
```

---

## Component Boundaries

### Layer 1: Rendering (Next.js App Router)

All pages default to **Server Components** (no JS shipped by default). Client Components are isolated islands for interactivity only.

| Component | Type | Responsibility | Why Client |
|-----------|------|---------------|------------|
| `layout.tsx` | Server | Root shell: head, PWA manifest link, global CSS | — |
| `HeaderBar` | Server | Logo, date, search box (static structure) | — |
| `BlueNavBar` | Server | Static nav links rendered from constants | — |
| `OrangeNavBar` | Server | Static orange nav links | — |
| `DropdownMenu` | **Client** | `onMouseOver` visibility toggle | DOM events |
| `ThreadTable` | Server | Renders thread rows from fetched data | — |
| `ThreadRow` | Server | Single row: icon, title, author, date, replies, views | — |
| `ThreadIcon` | Server | Selects normal/hot/fire/camera SVG | — |
| `ThreadTooltip` | **Client** | Follows cursor, shows preview | `mousemove` |
| `Pagination` | **Client** | Page number + rows-per-page dropdown | Click events |
| `OriginalPost` | Server | OP block: author info + content | — |
| `ReplyTree` | Server | Renders flat list as indented visual tree | — |
| `QuickReplyForm` | **Client** | Hidden toggle form with controlled inputs | Form state |
| `BreakingNews` | **Client** | Auto-refresh polling via `setInterval` | Timer, fetch |
| `AutoRefresh` | **Client** | `useAutoRefresh` hook wrapper (any page) | Timer |
| `NewsTabs` | **Client** | Tab selection state | Click events |
| `InstallPrompt` | **Client** | PWA install banner logic | `beforeinstallprompt` |
| `PushManager` | **Client** | Subscribe/unsubscribe to Web Push | ServiceWorker API |

**Rule:** If a component only touches data and renders HTML, keep it a Server Component. Add `'use client'` only when the component needs browser APIs, event handlers, or React state.

### Layer 2: Data API (Route Handlers)

Route handlers live at `src/app/api/`. They are the exclusive gateway to the database. Pages never import `libSQL` directly — they call these routes.

| Route | Method | Returns | Notes |
|-------|--------|---------|-------|
| `/api/forums/[forumId]` | GET | `{ threads: Thread[], total: number }` | Supports `?page=&limit=` |
| `/api/threads/[threadId]` | GET | `{ post: Post, replies: Post[] }` | Flat list, sorted by `created_at` |
| `/api/news` | GET | `{ items: NewsItem[] }` | Supports `?category=` |
| `/api/auth/register` | POST | `{ user }` | bcrypt hash stored |
| `/api/auth/login` | POST | `{ token }` | JWT or NextAuth session |
| `/api/posts` | POST | `{ post }` | Authenticated; writes to DB |
| `/api/push/subscribe` | POST | `{ ok }` | Stores VAPID subscription |
| `/api/scrape` | POST | `{ ok }` | Cron trigger; requires secret header |

### Layer 3: Content Pipeline

The scraper is a separate concern — it populates the DB but never serves requests.

| Stage | Technology | Input | Output |
|-------|-----------|-------|--------|
| Scraper | Node.js `fetch` + `cheerio` | Rotter.net HTML | Raw Hebrew text + structure |
| Parser | Custom TypeScript | Raw HTML | Typed `RawThread[]`, `RawPost[]` |
| Translator | DeepL API (or Google Translate) | Hebrew strings | English strings |
| Writer | `@libsql/client` | Translated records | Upserted rows in Turso |

Trigger: Vercel Cron (`vercel.json` `crons` field) hits `/api/scrape` every 15 minutes. The endpoint requires a `CRON_SECRET` header check before running.

### Layer 4: PWA Shell

| Concern | File | Strategy |
|---------|------|----------|
| Manifest | `app/manifest.ts` | Next.js built-in manifest file convention |
| Service Worker | `public/sw.js` | Manual (no next-pwa dependency needed) |
| Static asset cache | SW `install` event | Cache-first: CSS, SVG icons, fonts |
| API cache | SW `fetch` intercept | Network-first with stale fallback for `/api/**` |
| Push handler | SW `push` event | Show notification with title/body from payload |
| Notification click | SW `notificationclick` | `clients.openWindow('/')` |
| VAPID keys | `.env` | `NEXT_PUBLIC_VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY` |
| Push server | `app/actions.ts` | Server Action using `web-push` npm package |

---

## Data Flow

### Read Path (page load)

```
User → Browser
  → Next.js Page (Server Component)
    → fetch('/api/forums/[id]')        # or direct DB query via lib/db.ts
      → libSQL client → Turso Cloud
        ← rows
      ← JSON
    ← React tree (HTML)
  ← Initial HTML + minimal JS
→ Service Worker caches response
```

For pages with `export const revalidate = 60` (ISR), the second visitor within 60 seconds gets the cached HTML from Vercel's CDN. After 60 seconds, the next request triggers background regeneration.

### Auto-Refresh Path (live updates)

```
Client Component mounts (e.g. BreakingNews)
  → useAutoRefresh(interval=780000) hook starts setInterval
    → every N ms: fetch('/api/news')
      → Turso returns fresh rows
    → setState → React re-renders only the news list
```

The interval is configurable per page to match Rotter's original behavior (homepage: 13 min, news page: 5-9 min).

### Write Path (new post)

```
User submits QuickReplyForm
  → Server Action (or POST to /api/posts)
    → Auth check (JWT / session)
    → Validate input
    → INSERT into posts (libSQL)
    → revalidatePath('/forum/[id]/[threadId]')
  ← 200 OK
→ Client navigates / re-fetches thread
```

### Push Notification Path (breaking news)

```
Scraper inserts new news_items row
  → /api/scrape calls sendNotification() Server Action
    → web-push sends to all stored VAPID subscriptions
      → Browser Service Worker receives 'push' event
        → showNotification(title, body)
          → User taps → openWindow('/')
```

### Threading Data Model (flat tree)

Rotter uses flat threading with parent references (not recursive nesting). The DB schema matches this exactly:

```sql
posts (
  id          TEXT PRIMARY KEY,
  thread_id   TEXT NOT NULL,
  parent_id   TEXT,            -- NULL = top-level reply; non-NULL = child reply
  author      TEXT NOT NULL,
  content     TEXT NOT NULL,
  created_at  INTEGER NOT NULL -- Unix timestamp
)
```

The server fetches all posts for a thread in one query ordered by `created_at`. The `ReplyTree` component renders them as an indented visual tree by walking `parent_id` references client-side (or in a server-side transform). Rotter limits visual nesting to ~3-4 levels; deeper nesting stays at the same indent level.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: SQLite Local File on Vercel
**What:** Using `better-sqlite3` or a local `.db` file path on Vercel
**Why bad:** Vercel's serverless functions run in ephemeral containers — the filesystem is wiped on every deploy. Any data written between deploys is lost.
**Instead:** Use Turso (`@libsql/client`) with `libsql://your-db.turso.io` as the database URL. Switch to `file:local.db` only for local development.

### Anti-Pattern 2: Marking Every Component `'use client'`
**What:** Adding `'use client'` to layout, page, or data-display components as a default habit
**Why bad:** Moves data fetching to the browser, ships unnecessary JS, breaks SSR hydration cascade
**Instead:** Keep Server Components as the default. Only push `'use client'` to leaf components that need browser APIs (event handlers, timers, DOM access).

### Anti-Pattern 3: Direct DB Access in Pages
**What:** Importing `libsql` or file-read functions directly inside page components
**Why bad:** Breaks separation of concerns, makes caching and revalidation harder to reason about, makes routes untestable
**Instead:** All data access goes through `/api/**` route handlers or a dedicated `lib/db.ts` module used only from Server Components and API routes.

### Anti-Pattern 4: Recursive CTE for Thread Rendering
**What:** Using SQL `WITH RECURSIVE` to fetch nested replies
**Why bad:** Rotter's threading is visually flat (indented but not infinitely nested). A single `SELECT * FROM posts WHERE thread_id = ? ORDER BY created_at` + client-side tree walk is simpler and faster.
**Instead:** Fetch flat, transform to tree in the `ReplyTree` server component using a `Map<parent_id, Post[]>` grouping.

### Anti-Pattern 5: next-pwa for Service Worker
**What:** Adding `@ducanh2912/next-pwa` or `next-pwa` as a dependency
**Why bad:** These packages add webpack complexity, have lag on Next.js version support, and Next.js 15 now recommends writing `public/sw.js` manually (as shown in official docs). Serwist is the official offline-first recommendation if a library is truly needed.
**Instead:** Write `public/sw.js` directly (it is small — 50-100 lines). Use `app/manifest.ts` for the manifest (Next.js built-in).

### Anti-Pattern 6: WebSocket / SSE for Real-Time Updates
**What:** Implementing Server-Sent Events or WebSocket connections for live updates
**Why bad:** Rotter itself uses polling (meta refresh tags). Vercel serverless does not support persistent connections. Adds significant complexity.
**Instead:** `setInterval` polling in client components, ISR with short `revalidate` on API routes. This is sufficient and faithful to the original.

---

## Scalability Considerations

This is a single-operator hobby project. Scalability considerations are framed for keeping Vercel costs near zero.

| Concern | At 100 users | At 10K users | Notes |
|---------|--------------|--------------|-------|
| DB reads | Turso free tier (1B row reads/mo) | Turso Scaler tier | libSQL HTTP is fast, no connection pool needed |
| Page renders | Vercel hobby (free) | Vercel Pro | ISR means most pages hit CDN, not serverless |
| Scraper | Vercel Cron (1/day on free tier) | GitHub Actions | Free tier crons are limited; GH Actions = free |
| Push notifications | `web-push` via serverless | Same | Each push = 1 function invocation; fine at scale |
| Static assets | Vercel CDN | Same | SVG icons, CSS — no cost concern |

**Key decision:** Vercel free tier only allows 1 cron job per day. For 15-minute scraping, use a GitHub Actions scheduled workflow that POSTs to `/api/scrape` with a secret header.

---

## Suggested Build Order

Dependencies flow bottom-up. Each layer must exist before the layer above can be built.

### Stage 1: Foundation (no data needed)
Build the skeleton that all pages share. Nothing interactive yet.

1. **Design tokens** — `globals.css` with all CSS variables, font imports
2. **SVG icon set** — thread icons, toolbar icons, star ratings, reply icons
3. **Layout shell** — `HeaderBar`, `BlueNavBar`, `OrangeNavBar`, `Footer` (all Server Components)
4. **DropdownMenu** — first client component; validates `'use client'` boundary pattern
5. **Root layout** — `app/layout.tsx` wiring all shell components
6. **PWA manifest** — `app/manifest.ts` (can be done in 10 minutes, unblocks installability)
7. **Service worker** — `public/sw.js` (static asset caching only; extend later for push)

**Unlocks:** All subsequent pages can use the shell without re-doing layout work.

### Stage 2: Static Pages (hardcoded data)
Build every page with seed JSON before touching the database. This validates the UI independently of the data layer.

8. **Homepage** — 3-column table layout, hardcoded breaking news items in center column
9. **Forum listing page** — `ThreadTable`, `ThreadRow`, 6-column structure with seed data
10. **Thread page** — `OriginalPost`, `ReplyTree`, `ReplyRow` with seed nested replies
11. **News flash page** — category tabs, news item rows, `#eaf4ff` background
12. **Headlines pages** — chronological + by-last-reply (reuse `ThreadRow` with 4-col variant)

**Unlocks:** Full visual validation against Rotter.net before any backend work.

### Stage 3: Data Layer
Connect the UI to a real, persistent data store.

13. **TypeScript interfaces** — `Thread`, `Post`, `NewsItem`, `User` in `src/types/`
14. **`lib/db.ts`** — Turso `createClient()` wrapper; local vs. production URL switch
15. **Database schema** — `threads`, `posts`, `news_items`, `users` tables (migration script)
16. **API route: forums** — `/api/forums/[forumId]` → libSQL query → JSON
17. **API route: threads** — `/api/threads/[threadId]` → flat posts + tree transform
18. **API route: news** — `/api/news` → filtered by category
19. **Wire pages to API** — replace seed JSON with `fetch('/api/...')` in Server Components
20. **ISR revalidation** — set `revalidate` seconds per page type (news: 60s, threads: 300s)

**Unlocks:** Real data flowing through the already-built UI.

### Stage 4: Content Pipeline
Populate the DB with scraped + translated content.

21. **Scraper module** — `lib/scraper.ts`: fetch Rotter HTML, parse with `cheerio`
22. **Translator integration** — DeepL API call for each Hebrew string
23. **Writer module** — upsert scraped records into Turso
24. **`/api/scrape` endpoint** — POST handler with `CRON_SECRET` check, calls scraper
25. **GitHub Actions workflow** — scheduled trigger every 15 minutes → POST `/api/scrape`
26. **Auto-refresh hooks** — `useAutoRefresh` client hook wired to `BreakingNews`, `NewsPage`

**Unlocks:** Site has real Hebrew-sourced English content automatically refreshing.

### Stage 5: Interactivity
Thread interaction and user accounts.

27. **Auth** — Registration, login, JWT/session (NextAuth.js recommended)
28. **New thread form** — `/forum/[forumId]/new` page, Server Action write
29. **Quick reply form** — inline `QuickReplyForm` client component on thread page
30. **Thread tooltip** — `useTooltip` hook + `ThreadTooltip` client component
31. **Hot thread indicators** — logic: views > threshold → red count + hot icon
32. **Thread rating** — star rating POST endpoint + display

**Unlocks:** Forum is interactive, not just read-only.

### Stage 6: PWA Completion
Push notifications and full offline support.

33. **VAPID keys** — generate + store in `.env`
34. **Push subscription storage** — `push_subscriptions` table + `/api/push/subscribe`
35. **Push send Server Action** — `web-push` call from scraper pipeline
36. **Offline page** — cached shell with "you are offline" message
37. **Extended SW caching** — network-first for `/api/**` with stale fallback
38. **Install prompt** — `InstallPrompt` client component

**Unlocks:** Full PWA: installable, offline-capable, push-enabled.

### Stage 7: Polish
39. **SEO** — OG tags, `generateMetadata` per page
40. **Performance** — Partial Prerendering (`experimental_ppr`) for thread pages if available
41. **Search** — client-side filter on fetched forum data; `/search` page
42. **User profiles** — `/user/[username]` page
43. **Vercel deployment** — environment variables, domain, production Turso URL

---

## Key Architectural Invariants

These rules must hold throughout the build to avoid rewrites:

1. **One DB access path:** `lib/db.ts` → Turso. No other code touches the database.
2. **Server by default:** Every new component starts as a Server Component. Add `'use client'` only when the browser API list above is required.
3. **API routes own the data contract:** Pages never construct SQL. They call `/api/**` and receive typed JSON.
4. **Scraper is fire-and-forget:** The scraper writes to DB and returns. It does not serve requests. It does not depend on request state.
5. **ISR is the primary freshness mechanism:** Auto-refresh client polling is for UX fidelity (matching Rotter's behavior), not for data correctness.
6. **Table layout is intentional:** `<table>` elements for the forum listing, thread table, and homepage 3-column layout are architectural requirements, not legacy debt. Do not refactor to CSS Grid.

---

## Sources

- [Next.js PWA Official Guide](https://nextjs.org/docs/app/guides/progressive-web-apps) — manifest, service worker, push notifications (HIGH confidence, official, updated 2026-02-11)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — component boundary rules (HIGH confidence, official)
- [Common Next.js App Router Mistakes — Vercel](https://vercel.com/blog/common-mistakes-with-the-next-js-app-router-and-how-to-fix-them) — anti-patterns (HIGH confidence, official)
- [Turso + Vercel integration](https://vercel.com/marketplace/tursocloud) — SQLite on serverless (HIGH confidence, official)
- [Bringing SQLite to Vercel Functions with Turso](https://turso.tech/blog/serverless) — ephemeral filesystem problem + solution (HIGH confidence, official)
- [Next.js ISR Guide](https://nextjs.org/docs/app/guides/incremental-static-regeneration) — revalidate patterns (HIGH confidence, official)
- [Vercel Cron Jobs](https://vercel.com/templates/next.js/vercel-cron) — scheduled scraping trigger (MEDIUM confidence, official template)
- [Serwist for offline](https://github.com/serwist/serwist) — offline-first SW library if needed (MEDIUM confidence, referenced in official Next.js docs)
- [Threaded comment data model](https://medium.com/@pmadhav279/building-dynamic-conversations-a-step-by-step-guide-to-implementing-a-nested-comment-system-in-56055a586a50) — flat + parent_id pattern (MEDIUM confidence, community)
