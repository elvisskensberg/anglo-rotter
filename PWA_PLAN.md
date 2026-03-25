# MultiRotter PWA - Rotter.net English Clone Plan

## Goal
Replicate Rotter.net as a Progressive Web App (PWA) in English, preserving the **exact same retro layout, color scheme, and structure** -- but LTR and in English.

---

## Design System (Extracted from Rotter.net)

### Color Palette
```
--color-header-blue:      #71B7E6    /* Main header/logo bar, column headers */
--color-subheader-blue:   #3293CD    /* Forum header row, breadcrumbs */
--color-nav-blue:         #2D8DCE    /* Navigation bar, dropdown menus */
--color-news-teal:        #3984ad    /* News page header */
--color-dropdown-bg:      #c6e0fb    /* Dropdown menu background */
--color-dropdown-item:    #D9D9D9    /* Dropdown item default */
--color-row-odd:          #FDFDFD    /* Thread row (odd) */
--color-row-even:         #eeeeee    /* Thread row (even) */
--color-body-forum:       #FEFEFE    /* Forum body background */
--color-body-news:        #eaf4ff    /* News page background */
--color-body-home:        #FFFFFF    /* Homepage background */
--color-text-primary:     #000099    /* Primary link/text color (dark navy) */
--color-text-default:     #000000    /* Default text */
--color-text-visited:     #909090    /* Visited links (forum) */
--color-text-header:      #FFFFFF    /* Header text */
--color-time-red:         red        /* Timestamps */
--color-views-orange:     #ff9933    /* View count (normal) */
--color-views-hot:        red        /* View count (hot) */
--color-sort-orange:      #ff6600    /* Sort option links */
--color-green-rating:     #006633    /* User ratings */
--color-orange-accent:    #FF8400    /* Orange accent bars */
--color-tooltip-header:   #7D92A9    /* Tooltip header bg */
--color-tooltip-content:  #e6f2ff    /* Tooltip content bg */
--color-enews-header:     red        /* English news header */
```

### Typography
```
--font-primary:     "Arial", "Helvetica", sans-serif
--font-secondary:   "Tahoma", sans-serif
--font-decorative:  "Georgia", serif

--size-thread-title:  15px  (bold)
--size-post-title:    16px  (bold)
--size-menu:          16px  (bold, white)
--size-body-text:     14px  (font size="2" equivalent)
--size-small-meta:    12px  (font size="1" equivalent)
--size-tooltip-title: 10pt
--size-tooltip-body:  9pt
--size-news-category: 19px
--size-news-time:     9pt   (red, bold)
--size-news-headline: 10pt  (navy #000099)
```

### Layout Constants
```
--width-container:    1012px  (homepage fixed width)
--width-sidebar:      300px   (right column → left column in LTR)
--width-center:       450px   (breaking news center)
--width-nav-bar:      975px   (navigation bars)
--width-forum-full:   100%    (forum pages full-width)
--height-blue-bar:    25px
--height-orange-bar:  24px
--icon-size:          16x16   (thread icons)
--toolbar-icon-size:  33x33   (login/help/search/post)
```

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Next.js 15 (App Router) | PWA support, SSR, static export capable |
| **Styling** | CSS Modules + CSS Variables | Match exact Rotter layout without framework overhead |
| **Layout** | CSS Tables / Table elements | Faithful to original table-based layout |
| **PWA** | next-pwa / Workbox | Offline support, installable |
| **Data** | JSON files + API routes | Start static, add real-time later |
| **State** | React Context (minimal) | Forum state, user preferences |
| **Icons** | SVG recreations of Rotter GIFs | Same visual, modern format |
| **Direction** | LTR | English version (Rotter is RTL) |

---

## Pages to Build (Matching Rotter 1:1)

### Page Map

| # | Rotter Page | Route | Priority |
|---|------------|-------|----------|
| 1 | Homepage (3-column, breaking news) | `/` | P0 |
| 2 | Forum listing (scoops1 thread table) | `/forum/[forumId]` | P0 |
| 3 | Thread page (OP + reply tree) | `/forum/[forumId]/[threadId]` | P0 |
| 4 | News flashes (mivzakim) | `/news` | P1 |
| 5 | Forum headlines (chronological list) | `/headlines` | P1 |
| 6 | Forum headlines (by last reply) | `/headlines/latest` | P1 |
| 7 | User profile popup | `/user/[username]` | P2 |
| 8 | Search results | `/search` | P2 |
| 9 | New thread form | `/forum/[forumId]/new` | P2 |
| 10 | Reply form | (inline on thread page) | P2 |

---

## Phase Breakdown

### Phase 1: Project Setup & Design System
**Goal:** Bootstrapped Next.js PWA with exact Rotter design tokens and shared layout components.

| Task | Details |
|------|---------|
| 1.1 | `npx create-next-app@latest` with App Router, TypeScript |
| 1.2 | Configure PWA manifest (`manifest.json`): name "MultiRotter", theme color `#71B7E6`, bg `#FFFFFF` |
| 1.3 | Create `globals.css` with all CSS variables from design system above |
| 1.4 | Create SVG icon set matching Rotter GIFs: `icon_general`, `hot_icon`, `fire_icon`, `camera_icon`, `message`, `reply_message`, star ratings (1-5), toolbar icons |
| 1.5 | Create `<HeaderBar>` component: logo area, date display, search box (1012px centered, `bg00` gradient background) |
| 1.6 | Create `<BlueNavBar>` component: horizontal nav buttons (25px tall, blue gradient) |
| 1.7 | Create `<OrangeNavBar>` component: horizontal nav buttons (24px tall, orange) |
| 1.8 | Create `<DropdownMenu>` component: `onmouseover` triggered, `#c6e0fb` bg, `#D9D9D9` items |
| 1.9 | Create `<Footer>` component |
| 1.10 | Wire service worker + offline shell |

### Phase 2: Homepage (3-Column Layout)
**Goal:** Exact replica of Rotter homepage in English LTR.

| Task | Details |
|------|---------|
| 2.1 | Outer container: `<table width="1012">` centered (or CSS table equivalent) |
| 2.2 | Header row: `<HeaderBar>` with gradient background |
| 2.3 | Blue + Orange navigation bars |
| 2.4 | Dropdown menu bar (blue `#2D8DCE` bg, forum category dropdowns) |
| 2.5 | **Left sidebar** (was right in RTL): scrolling ticker div (300px, 430px tall, `overflow-y:scroll`), prayer times placeholder, ad placeholders |
| 2.6 | **Center column** (450px): Breaking News section with decorative tab header ("Breaking News" in yellow bold), news items (red timestamp + navy headline) |
| 2.7 | **Right column**: ad placeholder, additional content |
| 2.8 | Auto-refresh meta tag (13 min) or `setInterval` equivalent |
| 2.9 | Seed with sample English breaking news data |

### Phase 3: Forum Listing Page
**Goal:** Exact replica of Rotter scoops forum thread table.

| Task | Details |
|------|---------|
| 3.1 | Page layout: full-width, `bgcolor="#FEFEFE"` |
| 3.2 | Logo bar: full-width `#71B7E6` background with forum logo |
| 3.3 | Shared nav bars (reuse from Phase 1) |
| 3.4 | Forum toolbar: Login, Help, Search, Post icons (33x33) with labels |
| 3.5 | Moderator list display |
| 3.6 | Thread table header: `#3293CD` breadcrumb row + `#71B7E6` column headers |
| 3.7 | **6-column thread table** matching exact Rotter structure: |
|     | Col 1: Icon (normal/hot/fire/camera, 16x16) |
|     | Col 2: Title (55%, 15px bold, `#000099` link) |
|     | Col 3: Author + Date (center, date `#000099`, time red) |
|     | Col 4: Last Reply (date + time + "by USERNAME" blue link) |
|     | Col 5: Replies (bold, `#000099`) |
|     | Col 6: Views (orange `#ff9933`, or red if hot + `hot_icon_news`) |
| 3.8 | Alternating row colors: `#FDFDFD` / `#eeeeee` |
| 3.9 | Thread tooltip on icon hover: `#7D92A9` header, `#e6f2ff` body, follows cursor |
| 3.10 | Pagination: red page numbers, rows-per-page dropdown (15/30/50/100/150/200/250/300) |
| 3.11 | Seed with sample English forum data |

### Phase 4: Thread Page
**Goal:** Exact replica of Rotter thread view with OP + reply tree.

| Task | Details |
|------|---------|
| 4.1 | Same header/nav structure |
| 4.2 | Thread metadata bar: `#3293CD` breadcrumb, role icons legend |
| 4.3 | Thread controls bar: `#71B7E6`, thread number, view toggles, first/last reply buttons |
| 4.4 | **Original Post block:** |
|     | Author info row (`#eeeeee`): username (bold, linked), star rating image, member since, post count, raters/points (green `#006633`) |
|     | Action icons row (`#eeeeee`): message, profile, add buddy, business card, IP |
|     | Content row (`#FDFDFD`): `<h1>` title (16px bold), content in 70%-width nested table, text `#000099` |
|     | Action buttons row (`#eeeeee`): edit, up, reply, view all, back to forum |
| 4.5 | **Reply thread tree table:** |
|     | 4-column header (`#eeeeee`): Thread, Author, Date, Number |
|     | Top-level replies: `message.gif` icon + title |
|     | Nested replies: indented (4 spaces per level), `reply_message.gif` icon |
|     | Alternating `#eeeeee` / `#FDFDFD` rows |
| 4.6 | Quick reply form (hidden by default, toggled by JS) |
| 4.7 | Report thread form (hidden) |
| 4.8 | Seed with sample thread data including nested replies |

### Phase 5: News Flash Page
**Goal:** Replica of Rotter mivzakim (news flashes) page.

| Task | Details |
|------|---------|
| 5.1 | Body: `bgcolor="#eaf4ff"` |
| 5.2 | Header: logo (290px) + sub-header (`#3984ad` bg, white text, date, search, forum links) |
| 5.3 | Category tabs row: `#3984ad` bg, white text, centered: News, Sports, Economy, Tech, All |
| 5.4 | News items table: each row 24px height, `#FFFFFF` bg, 4 columns (source icon, headline, time, source name) |
| 5.5 | Auto-refresh every 5-9 minutes |
| 5.6 | Seed with sample English news items |

### Phase 6: Forum Headlines Page
**Goal:** Chronological thread listing (simplified 4-column view).

| Task | Details |
|------|---------|
| 6.1 | Title: red, 25px, bold: "Scoops Forum Headlines - Chronological Order" |
| 6.2 | Sort toggle link (orange `#ff6600`): "Click here for headlines sorted by last reply" |
| 6.3 | Two-column layout: 160px left sidebar (ads) + main content |
| 6.4 | **4-column thread table:** Icon (16x16), Title (70%, 15px bold), Time + Date, Author (red bold `text13r`) |
| 6.5 | Thread icon types: `new_icon_general` (normal), `new_icon_fire` (alert), `new_icon_camera` (media) |
| 6.6 | Alternating `#FDFDFD` / `#eeeeee` rows |

### Phase 7: Data Layer & API
**Goal:** Connect to real data sources, enable dynamic content.

| Task | Details |
|------|---------|
| 7.1 | Define TypeScript interfaces: `Thread`, `Post`, `ForumListing`, `NewsItem`, `User` |
| 7.2 | Create API routes: `/api/forums/[forumId]`, `/api/threads/[threadId]`, `/api/news` |
| 7.3 | Create scraper service (adapt `extract_threads.py` to Node.js or keep as Python cron) |
| 7.4 | JSON file storage: `data/forums/`, `data/threads/`, `data/news/` |
| 7.5 | Auto-refresh polling on frontend (configurable interval per page) |
| 7.6 | Search implementation (client-side text search initially) |

### Phase 8: PWA & Mobile
**Goal:** Installable, offline-capable, mobile-friendly.

| Task | Details |
|------|---------|
| 8.1 | `manifest.json`: name, icons (multiple sizes), theme_color `#71B7E6`, background_color `#FFFFFF` |
| 8.2 | Service worker: cache-first for static assets, network-first for API data |
| 8.3 | Offline page with cached content |
| 8.4 | Push notifications support (breaking news alerts) |
| 8.5 | Mobile viewport: keep same layout but allow horizontal scroll (authentic to Rotter) OR add simple responsive breakpoint at 640px |
| 8.6 | App install prompt banner |

### Phase 9: User Features
**Goal:** Forum interaction capabilities.

| Task | Details |
|------|---------|
| 9.1 | User registration / login (simple auth) |
| 9.2 | Post new thread form |
| 9.3 | Reply to thread (quick reply + full reply) |
| 9.4 | User profile page (post count, member since, rating) |
| 9.5 | Thread rating/feedback system |
| 9.6 | Private messaging between users |
| 9.7 | Bookmark threads |
| 9.8 | Subscribe to thread notifications |

### Phase 10: Polish & Launch
**Goal:** Production-ready with content seeding.

| Task | Details |
|------|---------|
| 10.1 | Recreate all navigation GIF buttons as modern equivalents (SVG/CSS styled to look identical) |
| 10.2 | Create logo: "MultiRotter" in Rotter style (white serif text on blue gradient) |
| 10.3 | Background pattern image (`rreka.gif` equivalent) |
| 10.4 | Tooltip system (mouse-following, `#7D92A9` header + `#e6f2ff` body) |
| 10.5 | SEO: OG tags, meta descriptions |
| 10.6 | Performance: static generation where possible, ISR for dynamic content |
| 10.7 | Deploy to Vercel / Cloudflare Pages |

---

## File Structure

```
multirotter/
  public/
    manifest.json
    sw.js
    icons/
      icon-192.png
      icon-512.png
      thread/
        icon_general.svg
        hot_icon.svg
        fire_icon.svg
        camera_icon.svg
      toolbar/
        login.svg
        help.svg
        search.svg
        post.svg
      reply/
        message.svg
        reply_message.svg
      stars/
        1_star.svg ... 5_star.svg
      nav/
        blue_*.svg
        orange_*.svg
    images/
      bg00_gradient.png       # Header background pattern
      rreka_pattern.png       # Body background pattern
      logo.svg                # MultiRotter logo
      logo_forum.svg          # Forum variant
  src/
    app/
      layout.tsx              # Root layout with PWA meta
      page.tsx                # Homepage (3-column)
      globals.css             # All CSS variables + base styles
      forum/
        [forumId]/
          page.tsx            # Forum listing (thread table)
          [threadId]/
            page.tsx          # Thread view (OP + replies)
          new/
            page.tsx          # New thread form
      news/
        page.tsx              # News flashes
      headlines/
        page.tsx              # Chronological headlines
        latest/
          page.tsx            # By last reply
      search/
        page.tsx              # Search results
      user/
        [username]/
          page.tsx            # User profile
      api/
        forums/
          [forumId]/
            route.ts          # Forum data API
        threads/
          [threadId]/
            route.ts          # Thread data API
        news/
          route.ts            # News feed API
    components/
      layout/
        HeaderBar.tsx         # Logo + date + search (gradient bg)
        BlueNavBar.tsx        # Blue navigation buttons bar
        OrangeNavBar.tsx      # Orange navigation buttons bar
        DropdownMenu.tsx      # Hoverable dropdown menus
        Footer.tsx
      forum/
        ThreadTable.tsx       # 6-column thread listing table
        ThreadRow.tsx         # Single thread row (alternating colors)
        ThreadIcon.tsx        # Icon selector (normal/hot/fire/camera)
        ThreadTooltip.tsx     # Mouse-following preview tooltip
        Pagination.tsx        # Red page numbers + rows dropdown
        ForumToolbar.tsx      # Login/Help/Search/Post icons
        ModeratorList.tsx     # Moderator display
      thread/
        OriginalPost.tsx      # OP block (author info + content)
        ReplyTree.tsx         # Threaded reply tree table
        ReplyRow.tsx          # Single reply (with indentation)
        AuthorInfo.tsx        # Username + stars + stats
        ActionButtons.tsx     # Edit/Up/Reply/ViewAll/Back
        QuickReplyForm.tsx    # Hidden toggle reply form
      news/
        BreakingNews.tsx      # Center column breaking news feed
        NewsItem.tsx          # Single: red time + navy headline
        NewsTabs.tsx          # Category tab bar
      home/
        Sidebar.tsx           # Left sidebar (ticker, ads placeholder)
        CenterColumn.tsx      # Breaking news center (450px)
      shared/
        AdPlaceholder.tsx     # Placeholder for ad slots
        Breadcrumb.tsx        # Forum > Scoops > Thread #
    types/
      forum.ts                # Thread, Post, Forum interfaces
      news.ts                 # NewsItem, NewsCategory
      user.ts                 # User, UserProfile
    data/
      sample-forums.json      # Seed data
      sample-threads.json
      sample-news.json
    lib/
      scraper.ts              # Data fetching from Rotter or external sources
      formatDate.ts           # Date formatting utilities
      constants.ts            # Forum names, categories, config
    hooks/
      useAutoRefresh.ts       # Auto-refresh hook (configurable interval)
      useTooltip.ts           # Mouse-following tooltip
```

---

## Key Design Decisions

### 1. Table-Based Layout (Faithful to Original)
Use actual `<table>` elements (not CSS Grid/Flexbox) for the forum listing and thread views to exactly match Rotter's rendering. Use CSS table-display for the homepage 3-column layout.

### 2. LTR Mirror of RTL
Rotter is RTL. Our English version mirrors everything:
- Left sidebar ← Right sidebar
- Text alignment flipped where appropriate
- Navigation reads left-to-right
- Same visual weight and proportions

### 3. No Modern Design "Improvements"
The retro aesthetic IS the design. Do not:
- Add rounded corners
- Add shadows or gradients (except where Rotter has them)
- Use modern spacing/padding conventions
- Add animations or transitions
- Use a CSS framework

### 4. Color-Exact Replication
Every hex code from the design spec is preserved as CSS variables. No "close enough" -- use the exact values.

### 5. Icon Recreation
Rotter uses GIF icons from the early 2000s. Recreate each one as SVG with the same visual appearance (same colors, same pixel feel, same size).

---

## Success Criteria

- [ ] Side-by-side comparison with Rotter.net shows matching layout structure
- [ ] Same color palette (every hex matches)
- [ ] Same typography hierarchy (sizes, weights, families)
- [ ] Same table structure for forum listings (6 columns, alternating rows)
- [ ] Same thread page structure (author info + content + reply tree)
- [ ] Same homepage 3-column layout with breaking news center
- [ ] Same navigation bars (blue + orange)
- [ ] Same tooltip behavior on thread icon hover
- [ ] Hot thread indicators match (icon change + red view count)
- [ ] Installable as PWA on mobile and desktop
- [ ] Works offline with cached content
- [ ] All content in English
