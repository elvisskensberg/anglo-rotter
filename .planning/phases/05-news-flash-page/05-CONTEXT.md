# Phase 5: News Flash Page - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the news flash (mivzakim) page with teal header layout, category tab filtering, news item table, and auto-refresh — all using hardcoded seed data.

</domain>

<decisions>
## Implementation Decisions

### Page Layout
- Body background: #eaf4ff
- Header with logo and #3984ad teal bar
- Category tabs row: #3984ad background, white text
- Categories: News, Sports, Economy, Tech, All
- Default tab: All (shows all categories)

### News Items Table
- Each row 24px height
- 4 columns: source icon, headline, time, source name
- Alternating row colors matching Rotter pattern
- Source icons are placeholder colored circles (real source logos deferred to data layer phase)

### Auto-Refresh
- Every 5 minutes (300000ms) per design spec
- Same pattern as homepage: useEffect + setInterval + router.refresh()
- Configurable via env var

### Seed Data
- NewsItem interface: id, headline, time, source, sourceIcon, category
- Minimum 30 seed news items across all categories
- Use data/design/news_page.html for structure reference

### Claude's Discretion
- Component decomposition (NewsCategoryTabs, NewsItemRow, NewsTable, NewsPageLayout)
- Exact source icon placeholder style
- Tab active/inactive styling details

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Layout shell (HeaderBar, BlueNavBar, OrangeNavBar)
- Table component with tbody
- CSS tokens (50+)
- Auto-refresh pattern from HomepageLayout
- Seed data pattern from homepage-seed.ts and forum-seed.ts

### Established Patterns
- CSS Modules with var(--rotter-*) tokens
- 'use client' for interactive components
- Typed seed data in src/data/

### Integration Points
- New route: src/app/news/page.tsx
- NavBar links should include news page

</code_context>

<specifics>
## Specific Ideas

- Reference data/design/news_page.html for exact table structure
- Reference data/design/DESIGN_SPECIFICATION.md for teal color values

</specifics>

<deferred>
## Deferred Ideas

None

</deferred>
