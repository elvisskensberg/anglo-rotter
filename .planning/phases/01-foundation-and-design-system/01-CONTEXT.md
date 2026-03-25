# Phase 1: Foundation and Design System - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the Next.js 15 project scaffold with all visual building blocks: CSS design tokens (exact Rotter hex palette), SVG icon set, typography hierarchy, table-based layout components (HeaderBar, NavBar blue/orange, dropdown menus), and Serwist PWA shell — so that all future phases can import tokens, icons, and layout components without making any visual decision.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Key references:
- Exact hex colors, typography sizes, and layout dimensions are specified in `data/design/DESIGN_SPECIFICATION.md`
- Raw HTML sources available in `data/design/` for pixel-level reference
- PROJECT.md constraints: table-based layout (`<table>` elements), CSS Modules, no CSS frameworks, Arial primary font
- Requirements: DSGN-01 through DSGN-04, LYOT-01 through LYOT-05

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `data/design/DESIGN_SPECIFICATION.md` — 950+ line pixel-level design spec extracted from live Rotter.net
- `data/design/*.html` — Raw HTML source for homepage, scoops forum, thread page, news page, forum list
- `data/design/style.css` — Original Rotter.net CSS file
- `scripts/extract_threads.py` — Existing Python scraper (for later phases)
- `data/snapshots/`, `data/threads/` — Scraped forum content (75 threads, 120 posts)

### Established Patterns
- No existing codebase yet — this phase creates the foundation
- PROJECT.md specifies: Next.js 15 App Router, TypeScript, CSS Modules, table-based layouts
- CLAUDE.md conventions: PascalCase components, camelCase utils, `@/*` import alias

### Integration Points
- Root layout (`src/app/layout.tsx`) will be the entry point
- `globals.css` for CSS custom properties (design tokens)
- `src/components/` for shared layout components
- `public/icons/` for SVG icon set

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. All visual specifications are defined in the design specification document.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
