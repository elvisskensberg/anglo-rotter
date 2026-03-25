# Phase 3: Forum Listing - Research

**Researched:** 2026-03-22
**Domain:** React table layout, mouse-following tooltip, client-side pagination, CSS Modules, TypeScript seed data
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- 6-column table matching Rotter's exact structure: icon (fixed width), title (55%), author+date, last reply, replies count, views count
- Alternating row colors: #FDFDFD / #eeeeee using `var(--rotter-row-odd)` and `var(--rotter-row-even)` tokens
- Table header row with #3293CD blue background
- Icon changes from thread-normal.svg to thread-hot.svg when views > 1000 or replies > 50
- View count text turns red for hot threads
- Fire icon (thread-fire.svg) for viral threads (views > 5000)
- Absolute-positioned div that follows mouse cursor on thread icon hover
- Tooltip header: #7D92A9 background with thread title
- Tooltip body: #e6f2ff background with first 200 chars of post content
- Shows/hides on mouseenter/mouseleave of the icon cell
- Position offset: 15px right and below cursor
- Red page numbers at bottom of table
- Rows-per-page dropdown with options: 15, 30, 50, 100, 150, 200, 250, 300
- Default: 30 rows per page
- Client-side pagination (hardcoded seed data, no API)
- Row of 33x33 toolbar icons: Login, Help, Search, Post (from Phase 1 SVG set)
- Positioned above the thread table
- Dropdown selector in nav area for forum sections: Scoops, Politics, Media, Economy, Sports, Culture
- Default: Scoops (main forum)
- Switching sections filters seed data by category
- TypeScript interfaces: ForumThread with id, title, author, date, lastReply, replyCount, viewCount, category, excerpt
- Minimum 60 seed threads to demonstrate pagination

### Claude's Discretion

- Component decomposition (ThreadRow, ForumToolbar, PaginationBar, ForumDropdown, ThreadTooltip)
- CSS Module structure and class naming
- Exact tooltip animation/transition timing
- Thread icon size in table (recommend 16x16 per design spec)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FORUM-01 | 6-column thread table (icon, title 55%, author+date, last reply, replies, views) | Confirmed from scoops_forum.html rows — exact column structure documented |
| FORUM-02 | Alternating row colors (#FDFDFD / #eeeeee) | Confirmed in HTML and globals.css tokens `--rotter-row-odd` / `--rotter-row-even` already defined |
| FORUM-03 | Hot thread indicators: icon changes, view count turns red | Confirmed from HTML — hot_icon_general.gif + red view count + hot_icon_news.gif next to views. Threshold determined client-side per CONTEXT.md decisions |
| FORUM-04 | Thread tooltip on icon hover (mouse-following, #7D92A9 header, #e6f2ff body) | Full JS logic captured from scoops_forum.html. React reimplementation pattern documented |
| FORUM-05 | Pagination with red page numbers and rows-per-page dropdown (15/30/50/100/150/200/250/300) | HTML pagination bar confirmed at line 568 of scoops_forum.html. Dropdown options match exactly |
| FORUM-06 | Forum toolbar with Login/Help/Search/Post icons (33x33) | HTML toolbar confirmed at line 439. All 4 SVGs exist in public/icons/. Icon labels documented |
| FORUM-07 | Multiple forum sections accessible via dropdown (scoops, politics, media, etc.) | Forum select dropdown confirmed at lines 280-293 of scoops_forum.html. Options listed |
</phase_requirements>

---

## Summary

Phase 3 delivers the forum thread listing page — the core interface users see when browsing scoops. All visual patterns are directly confirmed from `data/design/scoops_forum.html` (the live Rotter source). The thread table, hot indicators, tooltip system, pagination bar, toolbar, and forum dropdown are all present in that HTML with exact color values, sizes, and JS behavior documented.

The main engineering challenge is the **mouse-following tooltip**: Rotter's original uses IE-era `document.all` and `event.x/y` globals. The React equivalent uses `onMouseMove` with `e.clientX`/`e.clientY` on the icon cell, storing position in state, and rendering a fixed-position div. This requires `'use client'` on the ForumThreadTable component. All other features (alternating rows, pagination, toolbar) are straightforward CSS Modules + React state.

The **seed data** is the second key challenge: the scoops snapshot (`data/snapshots/scoops1_2026-03-22.json`) has 60 threads but is missing `replyCount`, `viewCount`, `lastReply`, and `excerpt` fields. These must be fabricated in the seed file. The raw threads file (`data/threads/raw_threads_2026-03-22.json`) contains post content for excerpts. A seed generator function should fabricate realistic reply/view counts with enough variance to demonstrate both hot and normal thread states.

**Primary recommendation:** Build ForumThreadTable as the central 'use client' component containing tooltip state and pagination state. Decompose into ThreadRow, ForumToolbar, PaginationBar, and ForumSectionDropdown sub-components.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React 19 | 19.0.0 | Component rendering, event handling, state | Already installed |
| Next.js App Router | 15.1.6 | Route `src/app/forum/[forumId]/page.tsx` | Already installed |
| CSS Modules | Built-in | Scoped styles with `var(--rotter-*)` tokens | Established in Phase 1+2 |
| TypeScript | 5.x | ForumThread interface, type safety | Already installed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next/image | Built-in | Thread icon rendering | If SVG needs optimization; plain `<img>` acceptable for 16x16 icons per Phase 1 pattern |
| identity-obj-proxy | Dev dep | CSS Module mocking in Jest | Already configured in jest.config.js |

### No New Dependencies
This phase requires zero new npm packages. Everything needed is already installed.

**Installation:** None required.

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   └── forum/
│       └── [forumId]/
│           └── page.tsx              # Server component — params → seed data lookup
├── components/
│   └── forum/
│       ├── index.ts                  # Barrel exports
│       ├── ForumThreadTable.tsx      # 'use client' — owns tooltip + pagination state
│       ├── ForumThreadTable.module.css
│       ├── ThreadRow.tsx             # Pure presentational row
│       ├── ThreadRow.module.css
│       ├── ForumToolbar.tsx          # Login/Help/Search/Post icons row
│       ├── ForumToolbar.module.css
│       ├── PaginationBar.tsx         # Page numbers + rows-per-page
│       ├── PaginationBar.module.css
│       ├── ForumSectionDropdown.tsx  # Section selector (Scoops, Politics, etc.)
│       └── ForumSectionDropdown.module.css
└── data/
    └── forum-seed.ts                 # ForumThread[] typed seed data
```

### Pattern 1: Client Boundary at ForumThreadTable Level

**What:** `ForumThreadTable` carries `'use client'` and manages tooltip + pagination state. The page.tsx stays a server component (matching the Phase 2 pattern where `HomepageLayout` owns the `'use client'` boundary).

**When to use:** Any time a component needs `useState` or DOM event handlers (`onMouseMove`).

**Example:**
```typescript
// src/components/forum/ForumThreadTable.tsx
'use client';

import { useState } from 'react';
import type { ForumThread } from '@/data/forum-seed';
import { ThreadRow } from './ThreadRow';
import { PaginationBar } from './PaginationBar';
import { ForumToolbar } from './ForumToolbar';
import styles from './ForumThreadTable.module.css';

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  title: string;
  excerpt: string;
}

interface ForumThreadTableProps {
  threads: ForumThread[];
}

export function ForumThreadTable({ threads }: ForumThreadTableProps) {
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false, x: 0, y: 0, title: '', excerpt: '',
  });

  const totalPages = Math.ceil(threads.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const pageThreads = threads.slice(start, start + rowsPerPage);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltip.visible) {
      setTooltip(prev => ({ ...prev, x: e.clientX + 15, y: e.clientY + 15 }));
    }
  };

  return (
    <div onMouseMove={handleMouseMove}>
      <ForumToolbar />
      {/* tooltip div */}
      {tooltip.visible && (
        <div
          className={styles.tooltip}
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {/* header + body */}
        </div>
      )}
      <table border={0} width="100%" cellSpacing={0} cellPadding={3}>
        <tbody>
          {/* header row */}
          {pageThreads.map((thread, i) => (
            <ThreadRow
              key={thread.id}
              thread={thread}
              isEven={i % 2 === 1}
              onIconEnter={(title, excerpt, x, y) =>
                setTooltip({ visible: true, x, y, title, excerpt })
              }
              onIconLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
            />
          ))}
        </tbody>
      </table>
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(n) => { setRowsPerPage(n); setCurrentPage(1); }}
      />
    </div>
  );
}
```

### Pattern 2: Tooltip as Fixed-Position Overlay

**What:** The tooltip is rendered in the ForumThreadTable's root div rather than inside a table cell, so it can escape table stacking context. Position is set via inline style using `clientX + 15` / `clientY + 15` (matching Rotter's original `+15` offset).

**When to use:** Any time an element must overlay other content regardless of table nesting.

**Key detail from original source (line 462-466 of scoops_forum.html):**
```javascript
// Rotter's original:
document.all[layerName].style.top =
  (e.clientY + 15 + ((document.documentElement && document.documentElement.scrollTop)
  || document.body.scrollTop)) + "px";
document.all[layerName].style.left = (parseInt(e.clientX, 10) - 375) + "px";
```

The original uses `clientX - 375` (RTL mirror math). In our LTR version: use `clientX + 15` consistently. The tooltip needs `position: fixed` (not `absolute`) to correctly follow cursor as the user scrolls.

**Tooltip HTML structure (from lines 496-515 of scoops_forum.html):**
```
outer table: width=350, border=0, cellspacing=0, cellpadding=0
  → black border row: bgcolor=#000000, cellspacing=1
    → header row: bgcolor=#7D92A9
      → title text: class tooltiptitle (white, arial bold 10pt)
    → body row: bgcolor=#e6f2ff
      → content text: class tooltipcontent (black, arial 9pt)
```

**React equivalent CSS:**
```css
/* ForumThreadTable.module.css */
.tooltip {
  position: fixed;
  z-index: 4;
  width: 350px;
  border: 1px solid #000000;
  pointer-events: none;   /* must not capture mouse events */
}
.tooltipHeader {
  background-color: var(--rotter-tooltip-header);  /* #7D92A9 */
  padding: 4px 8px;
  font-family: var(--rotter-font-primary);
  font-weight: bold;
  font-size: var(--rotter-size-tooltip-title);  /* 10pt */
  color: #ffffff;
}
.tooltipBody {
  background-color: var(--rotter-tooltip-content);  /* #e6f2ff */
  padding: 4px 8px;
  font-family: var(--rotter-font-primary);
  font-size: var(--rotter-size-tooltip-body);  /* 9pt */
  color: #000000;
}
```

### Pattern 3: Hot Thread Logic

**What:** Thread icon and view count color are determined by `viewCount` and `replyCount` at render time. No server-side flag needed.

**Thresholds (from CONTEXT.md decisions):**
- Normal: `viewCount <= 1000 && replyCount <= 50` → `thread-normal.svg`, orange views `var(--rotter-views-orange)` = `#ff9933`
- Hot: `viewCount > 1000 || replyCount > 50` → `thread-hot.svg`, red views `var(--rotter-views-hot)` = `red`
- Viral (fire): `viewCount > 5000` → `thread-fire.svg`, red views + hot-news icon visible

**Confirmed from HTML analysis:** Thread 940155 has 101 replies and 17,649 views → `hot_icon_general.gif` + red view count + `hot_icon_news.gif` next to views. Thread 940170 has 131 replies and 21,016 views → same. Threads with < 30 replies and ~3000 views show `icon_general.gif` + orange views. The boundary aligns with `replies > 50` being a reliable hot signal.

**Example:**
```typescript
// Inside ThreadRow.tsx
function getThreadState(thread: ForumThread): 'normal' | 'hot' | 'fire' {
  if (thread.viewCount > 5000) return 'fire';
  if (thread.viewCount > 1000 || thread.replyCount > 50) return 'hot';
  return 'normal';
}

const iconMap = {
  normal: '/icons/thread-normal.svg',
  hot: '/icons/thread-hot.svg',
  fire: '/icons/thread-fire.svg',
};
```

### Pattern 4: Thread Data Interface

**What:** The ForumThread interface extends beyond what the scoops snapshot provides. `replyCount`, `viewCount`, `lastReply`, and `excerpt` must be fabricated in the seed file.

```typescript
// src/data/forum-seed.ts
export interface ForumThread {
  id: number;
  title: string;
  author: string;
  /** Date string "DD.MM.YY" for display */
  date: string;
  /** Time string "HH:MM" (red) */
  time: string;
  lastReplyDate: string;
  lastReplyTime: string;
  lastReplyAuthor: string;
  lastReplyNum: number;
  replyCount: number;
  viewCount: number;
  /** First 200 chars of post content for tooltip */
  excerpt: string;
  /** Forum section for filtering */
  category: 'scoops' | 'politics' | 'media' | 'economy' | 'sports' | 'culture';
  url: string;
}
```

**Seed generation strategy:** Map the 60 scoops threads from the snapshot. Fabricate `replyCount` and `viewCount` using a deterministic function (e.g., based on thread ID modulo) so tests remain reproducible. Ensure ~15% of threads are "hot" and ~5% are "fire" to demonstrate all visual states.

### Pattern 5: Forum Route Structure

**What:** `src/app/forum/[forumId]/page.tsx` is a server component that:
1. Maps `forumId` param to a category string
2. Filters `FORUM_SEED` by category
3. Passes filtered threads to `ForumThreadTable`

```typescript
// src/app/forum/[forumId]/page.tsx
import { HeaderBar, BlueNavBar, OrangeNavBar } from '@/components/layout';
import { ForumThreadTable } from '@/components/forum';
import { FORUM_SEED } from '@/data/forum-seed';

interface Props {
  params: { forumId: string };
}

const FORUM_CATEGORY_MAP: Record<string, string> = {
  scoops: 'scoops',
  politics: 'politics',
  media: 'media',
  economy: 'economy',
  sports: 'sports',
  culture: 'culture',
};

export default function ForumPage({ params }: Props) {
  const category = FORUM_CATEGORY_MAP[params.forumId] ?? 'scoops';
  const threads = FORUM_SEED.filter(t => t.category === category);
  return (
    <div>
      <HeaderBar />
      <BlueNavBar />
      <OrangeNavBar />
      <ForumThreadTable threads={threads} />
    </div>
  );
}
```

### Pattern 6: Pagination Bar

**What:** Rotter shows `דף 1 | 2 | 3 | ... | 100` with current page unlinked and other pages as red bold links. Rows-per-page dropdown submits inline (no form — client-side only).

**From HTML (line 568 of scoops_forum.html):** Page 1 is plain text, pages 2+ are `<font color=red size=2><b>N</b></font>` inside `<a>` tags. The `|` separators are plain text.

```typescript
// PaginationBar renders first page as plain text, rest as linked
// Rows-per-page is a controlled <select> with onChange
```

### Pattern 7: Forum Toolbar

**What:** A `<table>` with one row, each cell containing a 33x33 icon image above a label. Four icons: Login, Help, Search, Post.

**From HTML (line 439 of scoops_forum.html):**
- Each cell: `align="Center" nowrap WIDTH="50"`
- Icon: 33x33 `<img>`
- Label: `<font size="-1" face="Arial" color="#000099">` text below icon via `<BR>`
- All icons already exist in `public/icons/` as `toolbar-login.svg`, `toolbar-help.svg`, `toolbar-search.svg`, `toolbar-post.svg`

### Anti-Patterns to Avoid

- **Putting tooltip inside a `<td>`:** Table cells have `overflow: hidden` behavior and stacking context issues. Render tooltip as a sibling to the table, not inside it.
- **Using `position: absolute` for tooltip:** The tooltip must stay at the cursor position even when the page is scrolled. Use `position: fixed` with `clientX/Y` (which are viewport-relative).
- **Wrapping table in `<Table>` component for the thread rows:** The `Table` component from `src/components/ui/Table.tsx` is acceptable to use, but the caller MUST supply `<tbody>`. Do not assume auto-wrapping.
- **Using `bgcolor` JSX prop with capital C:** TypeScript strict mode rejects `bgColor`. Use lowercase `bgcolor` on native HTML table elements (confirmed by Phase 2 decision log).
- **Importing from barrel in same directory:** `HomepageLayout` pattern established in Phase 2 — import siblings directly to avoid circular dependency.
- **Fabricating seed with all threads having same view count:** Need variance to show hot/normal/fire states. Use deterministic variance (modulo or seeded pseudo-random).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tooltip positioning | Custom viewport boundary math | `position: fixed` + `clientX/Y` | Browser handles viewport clipping naturally |
| Pagination arithmetic | Complex slice logic | Simple `slice(start, start + rowsPerPage)` | Array.slice handles edge cases (last page) |
| CSS token access | Hardcoded hex colors | `var(--rotter-*)` from globals.css | All tokens already defined: `--rotter-row-odd`, `--rotter-row-even`, `--rotter-views-orange`, `--rotter-views-hot`, `--rotter-tooltip-header`, `--rotter-tooltip-content`, `--rotter-icon-toolbar` (33px) |
| Icon resolution | Switch statement with dynamic imports | Static `src` string from a lookup object | Simpler, no async, works with Next.js static analysis |

**Key insight:** All visual tokens are already in `globals.css`. The entire phase can use `var(--rotter-*)` throughout — no new CSS variables needed.

---

## Common Pitfalls

### Pitfall 1: Tooltip Captures Mouse Events
**What goes wrong:** The tooltip div intercepts `onMouseMove` events, causing tooltip to freeze at the edge of the tooltip div boundary.
**Why it happens:** The tooltip div overlays the cursor and becomes the event target.
**How to avoid:** Add `pointer-events: none` to the tooltip CSS. This is mandatory.
**Warning signs:** Tooltip "sticks" when cursor reaches tooltip boundary.

### Pitfall 2: Tooltip Uses `position: absolute` Instead of `fixed`
**What goes wrong:** Tooltip appears at the wrong position when the page is scrolled because `absolute` is relative to the nearest positioned ancestor.
**Why it happens:** Rotter's original used `scrollTop` correction math for the same reason. In React we avoid the correction by using `fixed`.
**How to avoid:** Use `position: fixed; left: {clientX + 15}px; top: {clientY + 15}px`.
**Warning signs:** Tooltip appears far above or below cursor after any page scroll.

### Pitfall 3: Pagination Resets on Row Count Change
**What goes wrong:** User is on page 3, changes rows-per-page to 100, lands on a non-existent page.
**Why it happens:** `currentPage` stays at 3 but `totalPages` may now be 1.
**How to avoid:** In `onRowsPerPageChange` handler, reset `currentPage` to 1.
**Warning signs:** Empty table renders after changing rows-per-page dropdown.

### Pitfall 4: Section Dropdown Navigation vs. Filter
**What goes wrong:** Section dropdown built as a `<select onChange="location.href=...">` style (Rotter's original) instead of client-side state.
**Why it happens:** Copying Rotter's pattern directly.
**How to avoid:** Use `onChange` to update a `selectedCategory` state variable; filter `FORUM_SEED` in the component. No navigation needed since all categories are in one seed file.
**Warning signs:** Page reloads on section change, losing pagination state.

### Pitfall 5: Missing `tbody` in Thread Table
**What goes wrong:** React hydration mismatch warning in production.
**Why it happens:** Browser auto-inserts `<tbody>` in DOM; React expects explicit `<tbody>` in virtual DOM.
**How to avoid:** Always include explicit `<tbody>` in any `<table>` (established project rule from Phase 1 decision log).
**Warning signs:** Console warning: "Expected server HTML to contain a matching tbody".

### Pitfall 6: Seed Data Missing Required Fields
**What goes wrong:** Hot thread logic fails because `replyCount` and `viewCount` are `undefined`.
**Why it happens:** The scoops snapshot only has `id, title, title_en, author, date, url, category` — no reply or view counts were scraped.
**How to avoid:** The forum-seed.ts must fabricate `replyCount`, `viewCount`, `lastReply*`, and `excerpt` fields. Use a deterministic formula based on thread ID to keep tests stable.
**Warning signs:** TypeScript compiler errors on `thread.viewCount` being `undefined`.

---

## Code Examples

Verified patterns from source HTML analysis:

### Thread Row — Exact Column Structure
```tsx
// Confirmed from scoops_forum.html lines 615-633
// Each TR has: icon | title 55% | author+date | last-reply | reply-count | views
<tr style={{ backgroundColor: isEven ? 'var(--rotter-row-even)' : 'var(--rotter-row-odd)' }}>
  {/* Col 1: Icon (1% width, RIGHT align, VALIGN TOP) */}
  <td align="right" valign="top">
    <a
      onMouseEnter={(e) => onIconEnter(thread.title, thread.excerpt, e.clientX, e.clientY)}
      onMouseLeave={onIconLeave}
      href="javascript:void(0)"
    >
      <img src={iconSrc} width={16} height={16} border={0} alt="" />
    </a>
  </td>

  {/* Col 2: Title 55% (right align, VALIGN TOP) */}
  <td align="right" valign="top" width="55%">
    <span className={styles.text15bn}>
      <a href={thread.url}><b>{thread.title}</b></a>
    </span>
  </td>

  {/* Col 3: Author + Date (CENTER, VALIGN TOP) */}
  <td align="center" valign="top">
    <font size={1} color="#000099">{thread.date}&nbsp;&nbsp;</font>
    <font size={1} color="red">{thread.time}</font>
    <br />
    <a href={`/user/${thread.author}`} className={styles.text13}>
      <b>{thread.author}</b>
    </a>
  </td>

  {/* Col 4: Last Reply (CENTER, VALIGN TOP) */}
  <td align="center" valign="top">
    <font size={1} color="#000099">{thread.lastReplyDate}</font>
    <font size={1} color="red">&nbsp;&nbsp;{thread.lastReplyTime}</font>
    <br />
    <a href={`${thread.url}#${thread.lastReplyNum}`} style={{ color: '#0000FF' }}>
      {thread.lastReplyAuthor}
    </a>
  </td>

  {/* Col 5: Reply Count (CENTER, VALIGN TOP) */}
  <td align="center" valign="top">
    <font size={2} color="#000099" face="Arial"><b>{thread.replyCount}</b></font>
  </td>

  {/* Col 6: Views (RIGHT align, VALIGN TOP) */}
  <td align="right" valign="top">
    &nbsp;
    <font size={-1} color={isHot ? 'red' : '#ff9933'}><b>{thread.viewCount}</b></font>
    {isFire && <img src="/icons/hot-news.svg" width={16} height={16} alt="hot" />}
    &nbsp;
  </td>
</tr>
```

### Column Header Row
```tsx
// From scoops_forum.html line 592-614
// BGCOLOR="71B7E6" (using CSS var: --rotter-header-blue)
<tr style={{ backgroundColor: 'var(--rotter-header-blue)' }}>
  <td align="center" width="1%">
    <img src="/icons/expand-threads.svg" width={16} height={16} alt="" />
  </td>
  <td align="right" width="55%">
    <font size="-1" face="Arial" color="white"><b>Titles</b></font>
  </td>
  <td align="center">
    <font size="-1" face="Arial" color="white"><b>Author</b></font>
  </td>
  <td align="center">
    <font size="-1" face="Arial" color="white"><b>Last Reply</b></font>
  </td>
  <td align="center">
    <font size="-1" face="Arial" color="white"><b>Replies</b></font>
  </td>
  <td align="center">
    <font size="-1" face="Arial" color="white"><b>Views</b></font>
  </td>
</tr>
```

### Breadcrumb Header Row (Blue #3293CD)
```tsx
// From scoops_forum.html line 578-588
// Outer table has bgcolor="#000000" (creates 1px black border effect)
// Inner table with cellpadding=3 has the blue header
<tr style={{ backgroundColor: 'var(--rotter-subheader-blue)' }}>
  <th align="right" colSpan={6}>
    <a href="/forum">
      <font face="Arial" color="#ffffff" size={2}>Forums</font>
    </a>
    &nbsp;&gt;&nbsp;
    <font face="Arial" color="#ffffff" size={2}>Scoops</font>
  </th>
</tr>
```

### Rows-Per-Page Dropdown
```tsx
// From scoops_forum.html lines 548-562
// Original: POST form submission. Our version: onChange state handler
<select
  value={rowsPerPage}
  onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
  style={{ fontFamily: 'Arial', fontSize: '13px', color: '#000099', fontWeight: 'bold' }}
>
  {[15, 30, 50, 100, 150, 200, 250, 300].map(n => (
    <option key={n} value={n}>{n}</option>
  ))}
</select>
```

### Forum Toolbar Icon Cell
```tsx
// From scoops_forum.html line 439 (one of four identical cells)
<td align="center" style={{ whiteSpace: 'nowrap', width: 50 }}>
  <a href="/login">
    <img src="/icons/toolbar-login.svg" height={33} width={33} border={0} alt="Login" />
  </a>
  <br />
  <a href="/login">
    <font size="-1" face="Arial" color="#000099">Login</font>
  </a>
</td>
```

### Deterministic Seed Data Pattern
```typescript
// Fabricate realistic view/reply counts from thread id
function fabricateStats(threadId: number) {
  const base = threadId % 100;
  const viewCount = base < 5
    ? 10000 + (base * 3000)   // ~5% fire-level
    : base < 20
    ? 2000 + (base * 200)     // ~15% hot
    : 100 + (base * 30);      // ~80% normal
  const replyCount = Math.floor(viewCount / 80);
  return { viewCount, replyCount };
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| IE `document.all` + `event.x/y` for tooltip | React `onMouseMove` with `e.clientX/Y` | ES5+ | Cleaner, no global state |
| Form POST for rows-per-page change | `onChange` state update (no navigation) | SPA era | No page reload, preserves position |
| Server-side hot thread flag | Client-side threshold check at render | This project | Simpler, works with seed data |

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest 29.7.0 + @testing-library/react 14.1.2 |
| Config file | `jest.config.js` (project root) |
| Quick run command | `pnpm test -- --testPathPattern=forum` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FORUM-01 | Thread table renders 6 columns in correct order | unit | `pnpm test -- --testPathPattern=ForumThreadTable` | ❌ Wave 0 |
| FORUM-02 | Alternating row colors applied to odd/even rows | unit | `pnpm test -- --testPathPattern=ThreadRow` | ❌ Wave 0 |
| FORUM-03 | Hot icon rendered when viewCount > 1000 | unit | `pnpm test -- --testPathPattern=ThreadRow` | ❌ Wave 0 |
| FORUM-03 | Fire icon rendered when viewCount > 5000 | unit | `pnpm test -- --testPathPattern=ThreadRow` | ❌ Wave 0 |
| FORUM-03 | View count color is red when thread is hot | unit | `pnpm test -- --testPathPattern=ThreadRow` | ❌ Wave 0 |
| FORUM-04 | Tooltip div hidden by default | unit | `pnpm test -- --testPathPattern=ForumThreadTable` | ❌ Wave 0 |
| FORUM-04 | Tooltip div becomes visible on icon mouseenter | unit | `pnpm test -- --testPathPattern=ForumThreadTable` | ❌ Wave 0 |
| FORUM-05 | PaginationBar renders correct page count | unit | `pnpm test -- --testPathPattern=PaginationBar` | ❌ Wave 0 |
| FORUM-05 | Rows-per-page change resets to page 1 | unit | `pnpm test -- --testPathPattern=PaginationBar` | ❌ Wave 0 |
| FORUM-06 | ForumToolbar renders 4 icons at 33x33 | unit | `pnpm test -- --testPathPattern=ForumToolbar` | ❌ Wave 0 |
| FORUM-07 | Section dropdown filters threads by category | unit | `pnpm test -- --testPathPattern=ForumThreadTable` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm test -- --testPathPattern=forum`
- **Per wave merge:** `pnpm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/ForumThreadTable.test.tsx` — covers FORUM-01, FORUM-04, FORUM-07
- [ ] `src/__tests__/ThreadRow.test.tsx` — covers FORUM-02, FORUM-03
- [ ] `src/__tests__/PaginationBar.test.tsx` — covers FORUM-05
- [ ] `src/__tests__/ForumToolbar.test.tsx` — covers FORUM-06

No new framework or shared fixtures needed — existing `jest.config.js`, `identity-obj-proxy`, and `@testing-library/react` setup is sufficient.

---

## Open Questions

1. **Tooltip position: `fixed` vs `absolute`**
   - What we know: Rotter's original adds `scrollTop` to compensate for `absolute` positioning; `fixed` removes that need
   - What's unclear: Does the forum page have enough content to scroll? If not, both approaches look identical
   - Recommendation: Use `fixed` — it's correct regardless of scroll state and simpler

2. **Thread icon `<img>` sizing — 16x16 explicit or rely on SVG natural size**
   - What we know: The `--rotter-icon-sm: 16px` token exists; Phase 1 confirmed 16x16 for thread icons
   - What's unclear: Whether SVGs in `public/icons/` have a viewBox that renders at 16x16 naturally
   - Recommendation: Always specify `width={16} height={16}` explicitly to match the original `icon_general.gif` which was a fixed-size GIF

3. **Section dropdown: navigation or filter-in-place**
   - What we know: CONTEXT.md says "switching sections filters seed data by category" — this is client-side filtering
   - What's unclear: Should the URL update to `/forum/politics` when switching sections?
   - Recommendation: For this phase, use `useRouter().push()` to navigate to `/forum/[category]` so the URL stays shareable — but this is a minor concern since it's seed data anyway

---

## Sources

### Primary (HIGH confidence)
- `data/design/scoops_forum.html` — Full live Rotter scoops forum HTML. Thread row structure (lines 615-752), tooltip JS (lines 451-519), toolbar HTML (line 439), pagination bar (line 568), forum select dropdown (lines 280-293), hot thread rows with reply/view counts verified directly
- `data/design/DESIGN_SPECIFICATION.md` — Synthesized spec, section 3 "Forum Listing (Scoops)". Column structure, hot indicator rules, tooltip colors, pagination format
- `src/app/globals.css` — All CSS tokens. Confirmed: `--rotter-row-odd`, `--rotter-row-even`, `--rotter-tooltip-header`, `--rotter-tooltip-content`, `--rotter-views-orange`, `--rotter-views-hot`, `--rotter-icon-toolbar`
- `public/icons/` directory listing — Confirmed all required SVG icons exist: `thread-normal.svg`, `thread-hot.svg`, `thread-fire.svg`, `hot-news.svg`, `toolbar-login.svg`, `toolbar-help.svg`, `toolbar-search.svg`, `toolbar-post.svg`, `expand-threads.svg`
- `data/snapshots/scoops1_2026-03-22.json` — Confirmed 60 threads available (total_threads_scraped: 60). Schema: id, title, title_en, author, date, url, category. Missing: replyCount, viewCount, lastReply, excerpt (must be fabricated)

### Secondary (MEDIUM confidence)
- Phase 1 + 2 decision logs in `STATE.md` — CSS Modules patterns, Table component contract, `'use client'` boundary placement, `bgcolor` lowercase requirement, identity-obj-proxy test patterns

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new packages; all existing technology
- Architecture: HIGH — patterns confirmed from Phase 1+2 codebase and direct HTML source
- Pitfalls: HIGH — tooltip pitfalls confirmed from Rotter source JS; pagination/seed pitfalls from direct data inspection
- Seed data gaps: HIGH — confirmed by direct JSON inspection that replyCount/viewCount are missing

**Research date:** 2026-03-22
**Valid until:** 2026-04-22 (stable domain — HTML source and design spec are frozen artifacts)
