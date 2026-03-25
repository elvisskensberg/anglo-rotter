# Phase 2: Homepage - Research

**Researched:** 2026-03-22
**Domain:** Next.js App Router, CSS Modules, table-based layout, seed data, auto-refresh
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- Each breaking news headline is a table row with 2 cells: red timestamp (`color: red`) + navy headline link (`color: #000099`) — matches Rotter's exact pattern from design spec
- Show 20 hardcoded seed headlines — enough to demonstrate scrolling without being excessive
- Left sidebar ticker uses placeholder text blocks — real ticker content comes from data layer (Phase 7)
- Right column has ad placeholder divs with correct Rotter dimensions and gray border — visible but clearly placeholder
- Use `useEffect` with `setInterval` + `router.refresh()` for server component revalidation — matches Next.js App Router pattern
- Default refresh interval: 13 minutes (780000ms) — matches Rotter's exact interval from design spec
- Configurable via `NEXT_PUBLIC_REFRESH_INTERVAL_MS` env var with 780000 default
- Store seed data in `src/data/homepage-seed.ts` as a typed array of `{time: string, headline: string, url: string}`
- Use real translated Rotter headlines from `data/snapshots/` for authentic feel
- Hardcode forum category names and links in sidebar matching Rotter's structure

### Claude's Discretion

- Exact pixel dimensions for ad placeholders (use Rotter's actual ad slot sizes from design spec)
- Component decomposition within the homepage (e.g., separate BreakingNewsFeed, TickerSidebar, AdSlot components)
- CSS Module naming conventions for homepage-specific styles

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HOME-01 | 3-column layout: left sidebar (300px), center breaking news (450px), right column | Confirmed exact widths from homepage.html line 382/858/1041; outer table `width:1012px` with `table-layout:fixed` |
| HOME-02 | Breaking news center shows timestamped headlines (red time + navy #000099 headline) | Confirmed exact inline style pattern from homepage.html line 861+ and DESIGN_SPECIFICATION.md §2; time is `9pt red bold`, headline is `10pt color:000099` |
| HOME-03 | Left sidebar contains scrolling ticker div (300px wide, 430px tall, overflow-y:scroll) | Confirmed from homepage.html line 439: `position:relative;width:300px;height:430px;overflow-y:scroll;overflow-x:hidden` |
| HOME-04 | Auto-refresh at configurable interval (default ~13 minutes) | Confirmed from homepage.html line 17: `<meta http-equiv=refresh content="770">` (770s ≈ 13min); Next.js pattern: useEffect + setInterval + router.refresh() |
| HOME-05 | Ad placeholder slots in correct positions | Confirmed from homepage.html: Right_Cube (300x250 or 300x600), Center_Pos2 (450x300), Left_Cube (250x300); Below_Header (970x90) |
</phase_requirements>

---

## Summary

Phase 2 delivers the homepage three-column layout inside the Phase 1 shell. The source of truth is `data/design/homepage.html` (the raw Rotter HTML) and `data/design/DESIGN_SPECIFICATION.md`. All structural decisions are already locked in CONTEXT.md; research confirms them against the actual HTML source.

The three-column table uses `style="width:1012px;table-layout:fixed;"` with `border="0" cellspacing="1" bgcolor="#000000"` — the black cellspacing creates the 1px black borders between columns. The left column is 300px, center is 450px, and the right column fills the remaining ~262px. This is an actual `<table>` layout requirement — no CSS grid or flexbox. The `Table` component from Phase 1 must be used (which enforces explicit `<tbody>`).

Auto-refresh is implemented in Next.js App Router using `useEffect` + `setInterval` + `router.refresh()` (from `next/navigation`). The `router.refresh()` call re-fetches server component data without full page navigation, matching Rotter's meta-refresh behavior. A `'use client'` wrapper component is needed around the server-rendered page content.

Seed data comes directly from `data/snapshots/scoops1_2026-03-22.json` which has 60 threads with `title_en` (English) translations, dates, and URLs — perfect for 20-item seed list.

**Primary recommendation:** Build as a 'use client' page component wrapping static HTML structure; use `router.refresh()` on a timer for the auto-refresh; store seed data as typed const array in `src/data/homepage-seed.ts`.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | 15.1.6 (project-pinned) | Page routing, server component refresh | Already installed; `router.refresh()` is the App Router auto-refresh pattern |
| React | 19.0.0 (project-pinned) | Component rendering | Already installed |
| CSS Modules | Built-in (Next.js) | Scoped styles with `var(--rotter-*)` tokens | Already established in Phase 1 |
| TypeScript | 5.x (project-pinned) | Type safety for seed data interface | Already installed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next/navigation` | 15.1.6 | `useRouter()` for `router.refresh()` | Required in client component for auto-refresh |
| `src/components/ui/Table.tsx` | Phase 1 | Enforces explicit tbody | All `<table>` elements must use this |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `router.refresh()` | `window.location.reload()` | Hard reload loses React state; router.refresh is softer and Next.js idiomatic |
| `router.refresh()` | `<meta http-equiv=refresh>` | Meta-refresh is not SPA-compatible; loses client state |
| CSS Modules | Tailwind | Project constraint: CSS Modules match Rotter inline style pattern; Tailwind classes would be semantically wrong for a pixel-faithful clone |

**Installation:** No new packages needed — all required packages are already installed.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   └── page.tsx                     # Homepage — replace placeholder with HomepageLayout
├── components/
│   └── homepage/
│       ├── HomepageLayout.tsx        # 'use client' wrapper, setInterval + router.refresh
│       ├── HomepageLayout.module.css
│       ├── BreakingNewsFeed.tsx      # Center column: headline table rows
│       ├── BreakingNewsFeed.module.css
│       ├── TickerSidebar.tsx         # Left column: 300x430 scroll div + placeholder items
│       ├── TickerSidebar.module.css
│       ├── AdSlot.tsx                # Reusable placeholder div with correct dimensions
│       ├── AdSlot.module.css
│       └── index.ts                 # Barrel export
└── data/
    └── homepage-seed.ts             # 20 typed seed headlines
```

### Pattern 1: Client Wrapper for Auto-Refresh
**What:** A `'use client'` component wraps the page content and owns the setInterval timer that calls `router.refresh()`. The page shell (`page.tsx`) is a server component that imports this wrapper.
**When to use:** Any page requiring auto-refresh in Next.js App Router without full page reload.
**Example:**
```typescript
// src/components/homepage/HomepageLayout.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const REFRESH_MS = Number(process.env.NEXT_PUBLIC_REFRESH_INTERVAL_MS ?? 780000);

export function HomepageLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), REFRESH_MS);
    return () => clearInterval(id);
  }, [router]);

  return <>{children}</>;
}
```

### Pattern 2: Three-Column Table Layout
**What:** Outer `<table>` with `width:1012px`, `table-layout:fixed`, `cellspacing="1"`, `bgcolor="#000000"`. Three `<td>` cells in a single `<tr>` — the `bgcolor="#000000"` on the table and `cellspacing="1"` create the 1px black column separators.
**When to use:** Homepage and any other page using Rotter's 3-column structure.
**Example:**
```typescript
// Source: data/design/homepage.html line 377-382, 858, 1041
<Table
  style={{ width: "1012px", tableLayout: "fixed" }}
  border={0}
  cellSpacing={1}
  bgColor="#000000"
>
  <tbody>
    <tr>
      {/* Left: ticker */}
      <td style={{ width: "300px", textAlign: "center", verticalAlign: "top", backgroundColor: "#ffffff" }}>
        <TickerSidebar />
      </td>
      {/* Center: breaking news */}
      <td style={{ textAlign: "center", width: "450px", verticalAlign: "top", backgroundColor: "#ffffff" }}>
        <BreakingNewsFeed headlines={SEED_HEADLINES} />
      </td>
      {/* Right: ads */}
      <td style={{ verticalAlign: "top", backgroundColor: "#ffffff" }}>
        <AdSlot width={250} height={300} label="Left Cube" />
      </td>
    </tr>
  </tbody>
</Table>
```

### Pattern 3: Breaking News Headline Row
**What:** Each headline is inline HTML — `<span>` for time + `<a>` for headline + `<br>`. Not a separate `<tr>` per item — Rotter uses a single `<td>` with all items stacked inline.
**When to use:** BreakingNewsFeed component internals.
**Example:**
```typescript
// Source: data/design/homepage.html line 861+ and DESIGN_SPECIFICATION.md §2
{headlines.map((item, i) => (
  <React.Fragment key={i}>
    <span style={{ fontSize: "9pt", color: "red" }}>
      <b>{item.time}</b>
    </span>
    {"\u00a0"}
    <a href={item.url} target="news">
      <span style={{ fontSize: "10pt", color: "#000099" }}>{item.headline}</span>
    </a>
    <br />
  </React.Fragment>
))}
```

### Pattern 4: Ticker Scrolling Div
**What:** A fixed-size `<div>` with `overflow-y:scroll` holds the ticker content. Inner content is positioned absolutely within a relative container.
**When to use:** Left sidebar ticker (HOME-03).
**Example:**
```typescript
// Source: data/design/homepage.html line 439
<div style={{
  position: "relative",
  width: "300px",
  height: "430px",
  overflowY: "scroll",
  overflowX: "hidden",
  direction: "ltr",  // LTR mirror (original is dir:rtl)
  textAlign: "left",
}}>
  <div style={{ width: "260px", position: "absolute" }}>
    {/* ticker items */}
  </div>
</div>
```

### Pattern 5: Ticker Item Styling
**What:** Each ticker item has a red bold date label (`.diego_title`) and navy linked content (`.diego_content`).
**When to use:** Sidebar ticker items.
**Example:**
```typescript
// Source: data/design/homepage.html line 421-437, DESIGN_SPECIFICATION.md §10
// .diego_title: font-weight:bold; font-size:10pt; color:red
// .diego_content: color:#000099; font-size:8pt; text-decoration:none
<span className={styles.diegoTitle}>03/22 19:07</span>
{"\u00a0\u00a0"}
<a className={styles.diegoContent} href={item.url} target="new">
  {item.text} <b>({item.category})</b>
</a>
<br /><br />
```

### Anti-Patterns to Avoid

- **Bare `<table>` without Table component:** Always use `<Table>` from `src/components/ui/Table.tsx` — bare tables cause React 19 hydration mismatch (established in Phase 1)
- **CSS Grid or Flexbox for the 3-column layout:** Must use actual `<table>` elements per project constraint
- **Hardcoding color hex in component JSX:** Use `var(--rotter-*)` tokens in CSS Modules only; tokens are in `globals.css`
- **`window.location.reload()` for auto-refresh:** Loses React state; use `router.refresh()` which only re-fetches server data
- **Starting setInterval without cleanup:** Always return `() => clearInterval(id)` from useEffect to prevent memory leaks on unmount
- **`useEffect` without `[router]` dependency:** Include `router` in deps array to satisfy exhaustive-deps lint rule

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Interval auto-refresh | Custom polling system | `useEffect + setInterval + router.refresh()` | One-liner with proper cleanup; router.refresh() is Next.js designed API |
| Table structure | Raw `<table>` | `Table` component from Phase 1 | Enforces explicit tbody; prevents React 19 hydration errors |
| Color tokens | Hardcoded hex strings | `var(--rotter-*)` CSS custom properties from `globals.css` | 50 tokens already defined; changes propagate everywhere |
| Type definitions | Inline object shapes | TypeScript interface in `homepage-seed.ts` | Reused by BreakingNewsFeed props and future data layer (Phase 7) |

**Key insight:** Rotter's homepage is static HTML with periodic hard refresh. The Next.js equivalent is server components + `router.refresh()` — the architecture maps cleanly without any complex state management.

---

## Common Pitfalls

### Pitfall 1: `bgColor` vs `backgroundColor` in React
**What goes wrong:** Rotter's HTML uses `bgcolor="#000000"` as an attribute on `<table>`. React uses the `bgColor` prop (camelCase) for the HTML attribute, but CSS Modules use `backgroundColor`. Mixing them causes confusion.
**Why it happens:** React maps HTML attribute `bgcolor` to `bgColor` prop, but many developers write `style={{ backgroundColor: ... }}` instead, which works but differs from Rotter's HTML approach.
**How to avoid:** For `<table>` elements that need `bgcolor` to match Rotter's exact HTML, pass it as a prop to `Table`: `<Table bgColor="#000000">`. For cells, use `style={{ backgroundColor: "#ffffff" }}`.
**Warning signs:** Table borders/separators not appearing (means the black `bgcolor` on the outer table isn't being set correctly).

### Pitfall 2: `table-layout:fixed` Requires Explicit Column Widths
**What goes wrong:** Setting `table-layout:fixed` without explicit `width` on each `<td>` causes the browser to divide columns evenly rather than using 300/450/262 split.
**Why it happens:** `table-layout:fixed` uses the first row's cell widths to define all column widths. If no width is set, columns become equal.
**How to avoid:** Set `style={{ width: "300px" }}` on the left td and `style={{ width: "450px" }}` on the center td. Right td takes remaining space.
**Warning signs:** Three equal-width columns instead of 300/450/remaining split.

### Pitfall 3: `router.refresh()` Requires `'use client'`
**What goes wrong:** Calling `useRouter()` or `useEffect` in a Server Component throws at build time.
**Why it happens:** `useRouter` and `useEffect` are client-only React hooks; Server Components run on the server and cannot use browser APIs.
**How to avoid:** The `HomepageLayout` wrapper must have `'use client'` at the top. The outer `page.tsx` can remain a server component that imports `HomepageLayout`.
**Warning signs:** Build error "useState/useEffect can only be used in a Client Component."

### Pitfall 4: Seed Data Time Format
**What goes wrong:** Rotter displays times as `HH:MM` (e.g., `19:07`) but the snapshot data stores full date strings like `"22/03/2026 18:42"`.
**Why it happens:** Snapshot `date` field is full date+time; the homepage display only shows time.
**How to avoid:** In `homepage-seed.ts`, extract the time portion: if `date` contains a space, take `date.split(' ')[1]`; otherwise use a fixed mock time. Alternatively define the seed as a static array with pre-parsed times.
**Warning signs:** Time cell showing `22/03/2026 18:42` instead of `18:42`.

### Pitfall 5: `overflow-y:scroll` on the Ticker Div
**What goes wrong:** In some browsers, `overflow-y: scroll` shows a permanent scrollbar even when content is short, while `overflow-y: auto` only shows when needed.
**Why it happens:** Rotter explicitly uses `overflow-y:scroll` (not auto) — this is intentional visual behavior.
**How to avoid:** Keep `overflow-y: scroll` to match the original. The scrollbar visual is part of the authentic look.
**Warning signs:** No scrollbar visible even with many items (means using `overflow-y: auto` or `hidden`).

### Pitfall 6: LTR Mirroring of Ticker Content
**What goes wrong:** Rotter's ticker div uses `direction:rtl; text-align:right`. Our LTR mirror must use `direction:ltr; text-align:left`. If you copy Rotter's HTML verbatim, text appears right-aligned.
**Why it happens:** The original site is RTL; the sidebar direction is explicitly set.
**How to avoid:** In `TickerSidebar.tsx`, explicitly set `direction: "ltr"` and `textAlign: "left"` on the outer scroll div.
**Warning signs:** Ticker text hugging the right side of the sidebar.

---

## Code Examples

Verified patterns from actual source files:

### Seed Data Interface
```typescript
// src/data/homepage-seed.ts
export interface HomeplineSeedItem {
  time: string;      // e.g., "19:07"
  headline: string;  // e.g., "IDF confirms air defense engagement over Dimona"
  url: string;       // e.g., "/forum/scoops1/940168"
}

// Source: data/snapshots/scoops1_2026-03-22.json — use title_en field
export const HOMEPAGE_SEED: HomeplineSeedItem[] = [
  { time: "18:42", headline: "Red Alert: Shlomi, Mateh Asher, Ma'ale Yosef", url: "/forum/scoops1/940171" },
  { time: "18:42", headline: "UAV infiltration: Yirka, Ma'alot-Tarshiha, Mateh Asher", url: "/forum/scoops1/940169" },
  // ...18 more
];
```

### Ad Slot Dimensions (from homepage.html DFP slot definitions)
```
Main_Page_Below_Header  : 970x90   (below orange nav bar)
Main_Page_Right_Cube    : 300x250 or 300x600   (left sidebar — LTR mirror of right)
Main_Page_Center_Pos2   : 450x300  (center column mid-page)
Main_Page_Left_Cube     : 250x300  (right column — LTR mirror of left)
```

### CSS Module Token Usage
```css
/* src/components/homepage/BreakingNewsFeed.module.css */
/* Source: globals.css tokens */
.timeLabel {
  font-size: 9pt;
  color: var(--rotter-text-time);   /* red */
  font-weight: bold;
}

.headlineLink {
  font-size: 10pt;
  color: var(--rotter-text-primary); /* #000099 */
  text-decoration: none;
}

.headlineLink:hover {
  text-decoration: underline;
}
```

### Ticker Item CSS
```css
/* src/components/homepage/TickerSidebar.module.css */
.diegoTitle {
  font-weight: bold;
  font-size: 10pt;
  color: var(--rotter-text-time);   /* red */
}

.diegoContent {
  color: var(--rotter-text-primary); /* #000099 */
  font-size: 8pt;
  text-decoration: none;
}

.diegoContent:hover {
  text-decoration: underline;
}
```

### AdSlot Placeholder
```typescript
// Source: homepage.html DFP slot sizes
interface AdSlotProps {
  width: number;
  height: number;
  label: string;
}

export function AdSlot({ width, height, label }: AdSlotProps) {
  return (
    <div style={{
      width: `${width}px`,
      height: `${height}px`,
      border: "1px solid #cccccc",
      backgroundColor: "#f5f5f5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "11px",
      color: "#999999",
      margin: "3px auto",
    }}>
      Ad: {label} ({width}x{height})
    </div>
  );
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `<meta http-equiv=refresh>` hard reload | `useEffect + setInterval + router.refresh()` | Next.js App Router (2022) | Soft refresh: only server data re-fetches, React state preserved |
| `useRouter` from `next/router` (Pages Router) | `useRouter` from `next/navigation` (App Router) | Next.js 13+ | Different import path — wrong import causes runtime error |

**Deprecated/outdated:**
- `next/router`: The old Pages Router hook. This project uses App Router; correct import is `next/navigation`.
- `getStaticProps`/`getServerSideProps`: Pages Router patterns. App Router uses async Server Components by default.

---

## Open Questions

1. **Breaking news section header decoration**
   - What we know: Rotter uses `bl_l.gif`, `bl_t_bg.gif`, `bl_rr.gif` decorative images for the "חדשות מתפרצות" header bar (DESIGN_SPECIFICATION.md §11)
   - What's unclear: Should Phase 2 include an English "Breaking News" header with decorative styling, or just the feed itself?
   - Recommendation: Include a simple styled header bar using CSS colors matching the decoration colors (`#3293CD` blue tab style) — no external image dependencies. The CONTEXT.md doesn't mention the header explicitly, so use Claude's discretion to add a visually consistent label.

2. **Right column width**
   - What we know: Left = 300px, center = 450px, outer table = 1012px, cellspacing = 1 (adds 4px for 3 columns), so right = 1012 - 300 - 450 - 4 = 258px
   - What's unclear: Whether to set explicit width on the right `<td>` or let it fill
   - Recommendation: Do not set explicit width — let `table-layout:fixed` fill remaining space naturally, same as original Rotter HTML.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest 29.7.0 + @testing-library/react 14.1.2 |
| Config file | `jest.config.js` (project root) |
| Quick run command | `pnpm test --testPathPattern=homepage` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOME-01 | 3-column table renders with correct widths | unit | `pnpm test --testPathPattern=homepage` | ❌ Wave 0 |
| HOME-02 | Breaking news renders red time + navy headline | unit | `pnpm test --testPathPattern=homepage` | ❌ Wave 0 |
| HOME-03 | Sidebar div has overflow-y:scroll and 300x430 size | unit | `pnpm test --testPathPattern=homepage` | ❌ Wave 0 |
| HOME-04 | setInterval called with correct interval ms | unit (mock timer) | `pnpm test --testPathPattern=homepage` | ❌ Wave 0 |
| HOME-05 | Ad placeholders render with correct dimensions | unit | `pnpm test --testPathPattern=homepage` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm test --testPathPattern=homepage`
- **Per wave merge:** `pnpm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/homepage.test.tsx` — covers HOME-01 through HOME-05
- [ ] `src/__tests__/AdSlot.test.tsx` — covers HOME-05 (ad placeholder dimensions)

---

## Sources

### Primary (HIGH confidence)
- `data/design/homepage.html` — Raw Rotter homepage HTML; exact column widths, ticker div, breaking news structure confirmed directly from source lines 377-1041
- `data/design/DESIGN_SPECIFICATION.md` — Pixel-level spec §2 (Homepage), §8 (Colors), §10 (CSS Classes), §11 (Icons), §14 (Ad Placements)
- `src/app/globals.css` — All `--rotter-*` CSS custom properties (50 tokens)
- `src/components/ui/Table.tsx` — Table component API; confirms callers must include explicit `<tbody>`
- `data/snapshots/scoops1_2026-03-22.json` — 60 threads with `title_en` translations; source for 20 seed headlines

### Secondary (MEDIUM confidence)
- Next.js App Router docs pattern for `router.refresh()` + `useEffect` — confirmed by Next.js 15 App Router architecture

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages already installed, versions project-pinned
- Architecture: HIGH — directly reverse-engineered from actual Rotter HTML source
- Pitfalls: HIGH — derived from real HTML structure and React/Next.js known behaviors
- Color/dimension values: HIGH — read from actual Rotter homepage.html and DESIGN_SPECIFICATION.md

**Research date:** 2026-03-22
**Valid until:** 2026-06-22 (stable — all sources are local files or project-pinned packages)
