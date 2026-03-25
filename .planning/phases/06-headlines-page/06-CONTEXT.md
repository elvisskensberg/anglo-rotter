# Phase 6: Headlines Page - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the Headlines Page — a chronological/sortable listing of all recent forum threads across sections. This is the `/headlines` route, distinct from the per-forum listing (Phase 3). It shows threads from ALL forums in a simplified 4-column table with a 2-column page layout (160px sidebar + main content).

</domain>

<decisions>
## Implementation Decisions

### Layout & Structure
- Two-column layout: 160px left sidebar (ad placeholder) + fluid main content area
- Page title as red bold h1 (25px): "Forum Scoops Headlines — Chronological"
- Sort toggle link in orange (#ff6600) switches between chronological and by-last-reply
- LTR direction (English version) — original is RTL

### Thread Table
- 4-column table: 16x16 icon | title (70% width) | time+date | author
- Header row with #71B7E6 blue background, white text
- Alternating row colors: #FDFDFD (odd) and #eeeeee (even)
- Title uses text15bn class equivalent (15px bold navy #000099)
- Time displayed bold (text13b), date below in small font size=1
- Author in red bold (text13r class equivalent)

### Thread Icons
- Normal: generic icon (16x16)
- Fire/Alert: fire icon for Red Alert / צבע אדום threads
- Camera: camera icon for media/video threads
- Icon type derived from seed data `category` or a new `iconType` field

### Sort Behavior
- Client-side sort toggle (no page reload) using React state
- Two modes: "chronological" (by post date desc) and "last-reply" (by lastReplyDate desc)
- Active sort shown as plain text, inactive as orange link

### Claude's Discretion
- Exact sidebar placeholder content (simple ad placeholder div is fine)
- Whether to add auto-refresh meta tag or skip for PWA
- Pagination approach (show all seed data or paginate)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/data/forum-seed.ts` — ForumThread interface with all needed fields (id, title, author, date, time, lastReplyDate, lastReplyTime, category, url, viewCount, replyCount, excerpt)
- `src/components/layout/` — HeaderBar, BlueNavBar, OrangeNavBar, DropdownMenu (shared chrome)
- `src/components/ui/Table.tsx` — base table component
- `src/components/forum/ThreadRow.tsx` — existing thread row (6-column version for forum listing)
- Design tokens in tailwind config for Rotter color palette

### Established Patterns
- Pages use shared layout from `src/app/layout.tsx`
- Seed data imported directly in page components
- Client components marked with 'use client' for interactivity
- Barrel exports via index.ts per component directory

### Integration Points
- New route: `src/app/headlines/page.tsx`
- BlueNavBar/OrangeNavBar already rendered in layout — just need the page content
- Seed data from `src/data/forum-seed.ts` already has all fields needed

</code_context>

<specifics>
## Specific Ideas

- Must match the exact Rotter.net forum list page (chronological) layout documented in `data/design/DESIGN_SPECIFICATION.md` Section 7
- The original page URL is `rotter.net/forum/listforum.php`
- English translation of all Hebrew UI labels

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
