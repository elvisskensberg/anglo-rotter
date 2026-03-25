# Phase 2: Homepage - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the complete homepage with a pixel-faithful 3-column table layout (left sidebar ticker, center breaking news feed, right ad placeholders), auto-refresh behavior, and hardcoded seed data — all rendered within the Phase 1 layout shell (HeaderBar, BlueNavBar, OrangeNavBar).

</domain>

<decisions>
## Implementation Decisions

### Homepage Content Layout
- Each breaking news headline is rendered as inline elements: `<span>` red timestamp + `&nbsp;` + `<a>` navy headline link + `<br/>` — matching Rotter's actual HTML source (inline spans, not table rows)
- Show 20 hardcoded seed headlines — enough to demonstrate scrolling without being excessive
- Left sidebar ticker uses placeholder text blocks — real ticker content comes from data layer (Phase 7)
- Right column has ad placeholder divs with correct Rotter dimensions and gray border — visible but clearly placeholder

### Auto-Refresh Behavior
- Use `useEffect` with `setInterval` + `router.refresh()` for server component revalidation — matches Next.js App Router pattern
- Default refresh interval: 13 minutes (780000ms) — matches Rotter's exact interval from design spec
- Configurable via `NEXT_PUBLIC_REFRESH_INTERVAL_MS` env var with 780000 default

### Seed Data Format
- Store seed data in `src/data/homepage-seed.ts` as a typed array of `{time: string, headline: string, url: string}`
- Use real translated Rotter headlines from `data/snapshots/` for authentic feel
- Hardcode forum category names and links in sidebar matching Rotter's structure

### Claude's Discretion
- Exact pixel dimensions for ad placeholders (use Rotter's actual ad slot sizes from design spec)
- Component decomposition within the homepage (e.g., separate BreakingNewsFeed, TickerSidebar, AdSlot components)
- CSS Module naming conventions for homepage-specific styles

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/layout/HeaderBar.tsx` — header with gradient, logo, date
- `src/components/layout/BlueNavBar.tsx` — 25px blue nav bar with dropdowns
- `src/components/layout/OrangeNavBar.tsx` — 24px orange nav bar
- `src/components/layout/DropdownMenu.tsx` — hover-triggered dropdown
- `src/components/ui/Table.tsx` — base table with mandatory tbody
- `src/app/globals.css` — 50 `--rotter-*` CSS custom properties
- `data/design/DESIGN_SPECIFICATION.md` — pixel-level layout reference
- `data/design/homepage.html` — raw Rotter homepage HTML source

### Established Patterns
- CSS Modules with `var(--rotter-*)` token references (no hardcoded hex in components)
- Table-based layouts with explicit `<tbody>`
- PascalCase component files, camelCase utilities
- `@/*` import alias for `src/*`

### Integration Points
- `src/app/page.tsx` — currently renders HeaderBar + NavBars + placeholder text; Phase 2 replaces the main content
- `src/components/layout/index.ts` — barrel export for layout components

</code_context>

<specifics>
## Specific Ideas

- Reference `data/design/homepage.html` for exact column widths, spacings, and nesting structure
- Reference `data/design/DESIGN_SPECIFICATION.md` sections on homepage layout for ad slot positions
- Use `data/snapshots/` content to create authentic English seed headlines

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
