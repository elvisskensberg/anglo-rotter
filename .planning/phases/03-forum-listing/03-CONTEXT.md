# Phase 3: Forum Listing - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the forum thread listing page with a pixel-faithful 6-column Rotter table, hot thread visual indicators, mouse-following tooltip on hover, pagination with configurable rows-per-page, forum toolbar with action icons, and a forum section dropdown — all using hardcoded seed data within the Phase 1 layout shell.

</domain>

<decisions>
## Implementation Decisions

### Thread Table Layout
- 6-column table matching Rotter's exact structure: icon (fixed width), title (55%), author+date, last reply, replies count, views count
- Alternating row colors: #FDFDFD / #eeeeee using `var(--rotter-row-light)` and `var(--rotter-row-alt)` tokens
- Table header row with #3293CD blue background

### Hot Thread Indicators
- Icon changes from thread-normal.svg to thread-hot.svg when views > 1000 or replies > 50
- View count text turns red for hot threads
- Fire icon (thread-fire.svg) for viral threads (views > 5000)

### Mouse-Following Tooltip
- Absolute-positioned div that follows mouse cursor on thread icon hover
- Header: #7D92A9 background with thread title
- Body: #e6f2ff background with first 200 chars of post content
- Shows/hides on mouseenter/mouseleave of the icon cell
- Position offset: 15px right and below cursor

### Pagination
- Red page numbers at bottom of table
- Rows-per-page dropdown with options: 15, 30, 50, 100, 150, 200, 250, 300
- Default: 30 rows per page
- Client-side pagination (hardcoded seed data, no API)

### Forum Toolbar
- Row of 33x33 toolbar icons: Login, Help, Search, Post (from Phase 1 SVG set)
- Positioned above the thread table

### Forum Sections
- Dropdown selector in nav area for forum sections: Scoops, Politics, Media, Economy, Sports, Culture
- Default: Scoops (main forum)
- Switching sections filters seed data by category

### Seed Data
- Use `data/threads/` and `data/snapshots/` content translated to English
- TypeScript interfaces: ForumThread with id, title, author, date, lastReply, replyCount, viewCount, category, excerpt
- Minimum 60 seed threads to demonstrate pagination

### Claude's Discretion
- Component decomposition (ThreadRow, ForumToolbar, PaginationBar, ForumDropdown, ThreadTooltip)
- CSS Module structure and class naming
- Exact tooltip animation/transition timing
- Thread icon size in table (recommend 16x16 per design spec)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/layout/` — HeaderBar, BlueNavBar, OrangeNavBar, DropdownMenu
- `src/components/ui/Table.tsx` — base table with mandatory tbody
- `src/components/homepage/` — BreakingNewsFeed, TickerSidebar, AdSlot patterns
- `src/app/globals.css` — 50+ `--rotter-*` CSS custom properties including row colors
- `public/icons/` — thread-normal, thread-hot, thread-fire, thread-camera, toolbar-* SVGs
- `data/design/scoops_forum.html` — raw Rotter forum HTML source
- `data/design/DESIGN_SPECIFICATION.md` — forum table structure reference

### Established Patterns
- CSS Modules with `var(--rotter-*)` tokens (no hardcoded hex)
- Table-based layouts with explicit `<tbody>`
- PascalCase components, camelCase utilities
- Seed data in `src/data/` as typed TypeScript arrays
- `'use client'` for interactive components, server components by default

### Integration Points
- New route: `src/app/forum/[forumId]/page.tsx`
- Forum page uses same layout shell (HeaderBar + NavBars)
- NavBar dropdown links should point to forum routes

</code_context>

<specifics>
## Specific Ideas

- Reference `data/design/scoops_forum.html` for exact table structure and column widths
- Reference `data/design/DESIGN_SPECIFICATION.md` for tooltip colors and forum toolbar specs
- Tooltip follows mouse using `onMouseMove` event with `clientX`/`clientY`

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
