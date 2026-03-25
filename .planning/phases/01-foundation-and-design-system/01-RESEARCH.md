# Phase 1: Foundation and Design System - Research

**Researched:** 2026-03-22
**Domain:** Next.js 15 App Router scaffold, CSS Modules design tokens, SVG icon creation, table-based React components, Serwist PWA shell
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
All implementation choices are at Claude's discretion — pure infrastructure phase. Key references:
- Exact hex colors, typography sizes, and layout dimensions are specified in `data/design/DESIGN_SPECIFICATION.md`
- Raw HTML sources available in `data/design/` for pixel-level reference
- PROJECT.md constraints: table-based layout (`<table>` elements), CSS Modules, no CSS frameworks, Arial primary font
- Requirements: DSGN-01 through DSGN-04, LYOT-01 through LYOT-05

### Claude's Discretion
All implementation choices are at Claude's discretion.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DSGN-01 | CSS variables define exact Rotter hex color palette | Full palette extracted from DESIGN_SPECIFICATION.md and confirmed against scoops_forum.html inline styles |
| DSGN-02 | Typography hierarchy matches Rotter (Arial primary, 15px thread titles, 16px post titles, 12px metadata) | All font classes confirmed in style.css and scoops_forum.html inline `<style>` block |
| DSGN-03 | SVG icon set recreates all Rotter GIF icons (thread normal/hot/fire/camera, toolbar, reply tree, stars 1-5) | Full icon inventory in DESIGN_SPECIFICATION.md § 11; pixel sizes and visual descriptions confirmed |
| DSGN-04 | Table components include explicit `<tbody>` to prevent React hydration mismatch | Confirmed browser behavior and React 19 hydration rules — `<tbody>` auto-insertion by browsers is the root cause |
| LYOT-01 | HeaderBar component: logo, date, search box on gradient background (1012px centered) | Homepage HTML confirms width=1012, bg=bg00.gif gradient, logo=335px, date=white bold size=-1 |
| LYOT-02 | Blue navigation bar (25px tall) with text-based nav buttons | Design spec confirms height 25px, image-based in original (recreate as CSS-styled text buttons) |
| LYOT-03 | Orange navigation bar (24px tall) with text-based nav buttons | Design spec confirms height 24px, orange accent color |
| LYOT-04 | Dropdown menus: hover-triggered, #c6e0fb background, #D9D9D9 items | Confirmed in scoops_forum.html: `.drop-list` class and ShowDiv1/HideDiv1 JS — replaced with CSS :hover |
| LYOT-05 | All page layouts use table-based structure (actual `<table>` elements) | Confirmed in original HTML; React hydration trap documented |
</phase_requirements>

---

## Summary

Phase 1 creates the complete Next.js 15 App Router project from scratch — no existing scaffold exists (`/src` directory is absent, no `package.json`). The deliverables are: design tokens in `globals.css`, SVG icon set in `public/icons/`, and four shared layout components (HeaderBar, BlueNavBar, OrangeNavBar, DropdownMenu).

The design source material is exceptionally complete: a 950-line pixel-level specification at `data/design/DESIGN_SPECIFICATION.md`, raw HTML at `data/design/homepage.html` and `data/design/scoops_forum.html`, and the original `data/design/style.css`. Every color, font size, layout dimension, and class name has been confirmed directly from these sources. No approximation is needed — exact values are documented below.

The primary technical challenge in this phase is the table-based React hydration trap. Browsers auto-insert `<tbody>` elements into any `<table>` that lacks them, but React 19 (with server components and streaming) renders without the auto-inserted element, causing a DOM mismatch that fills the console with hydration errors. Every `<table>` component must include an explicit `<tbody>`. The Serwist PWA shell (`@serwist/next`) must be wired at scaffold time — it cannot be bolted on later without structural rework.

**Primary recommendation:** Bootstrap with `create-next-app@latest`, configure Serwist immediately in Wave 0 (before any page code), write all CSS tokens in `globals.css` as `--rotter-*` custom properties, and implement all four layout components in the same wave.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.1 | Full-stack React framework, App Router, SSR, API routes | Required by project decision; verified current via `npm view next version` |
| react | 19.x (bundled with Next 16) | UI component model | Bundled with Next.js |
| typescript | 5.9.3 | Type safety | Required by project conventions |
| @serwist/next | 9.5.7 | PWA service worker integration for Next.js | Confirmed decision in STATE.md: next-pwa is abandoned, @ducanh2912/next-pwa superseded |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS Modules (built-in) | N/A | Component-scoped CSS | Every component file gets a `.module.css` sibling |
| CSS Custom Properties (native) | N/A | Design tokens in globals.css | Global palette, typography, layout constants |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS Modules | Tailwind CSS | Tailwind classes don't map to inline-style values (e.g., bgcolor="71B7E6") — CSS Modules allow direct `background-color: var(--rotter-header-blue)` |
| CSS Modules | styled-components | No SSR penalty with CSS Modules; avoids runtime CSS injection |
| `@serwist/next` | `next-pwa` | next-pwa is unmaintained (last publish 2022); Serwist is the maintained successor |

**Installation:**
```bash
npx create-next-app@latest multirotter --typescript --app --no-tailwind --no-eslint --src-dir --import-alias "@/*"
cd multirotter
npm install @serwist/next
```

**Version verification:** Confirmed 2026-03-22 via npm registry:
- `next`: 16.2.1
- `@serwist/next`: 9.5.7
- `typescript`: 5.9.3

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout: html/body, imports globals.css, Serwist SW registration
│   ├── page.tsx            # Homepage (Phase 2+)
│   └── globals.css         # ALL CSS custom properties (design tokens)
├── components/
│   ├── layout/
│   │   ├── HeaderBar.tsx           # Logo + date + search, 1012px centered
│   │   ├── HeaderBar.module.css
│   │   ├── BlueNavBar.tsx          # 25px blue navigation bar
│   │   ├── BlueNavBar.module.css
│   │   ├── OrangeNavBar.tsx        # 24px orange navigation bar
│   │   ├── OrangeNavBar.module.css
│   │   ├── DropdownMenu.tsx        # CSS :hover dropdown
│   │   └── DropdownMenu.module.css
│   └── ui/
│       └── (future shared primitives)
├── lib/
│   └── (utilities — Phase 7+)
└── types/
    └── (TypeScript interfaces — Phase 7+)
public/
├── icons/
│   ├── thread-normal.svg
│   ├── thread-hot.svg
│   ├── thread-fire.svg
│   ├── thread-camera.svg
│   ├── thread-new.svg
│   ├── message.svg
│   ├── reply-message.svg
│   ├── star-1.svg through star-5.svg
│   ├── toolbar-login.svg
│   ├── toolbar-help.svg
│   ├── toolbar-search.svg
│   └── toolbar-post.svg
├── images/
│   └── logo.svg             # Rotter-style logo placeholder
└── manifest.json            # PWA manifest (minimal for Phase 1)
```

### Pattern 1: CSS Custom Properties as Design Tokens

**What:** All Rotter-specific values defined as `--rotter-*` CSS variables in `globals.css`. Components reference variables, never hardcoded hex values.

**When to use:** Every color, font size, layout dimension, and spacing constant.

**Example:**
```css
/* src/app/globals.css */
:root {
  /* --- Rotter Color Palette (exact hex from DESIGN_SPECIFICATION.md) --- */

  /* Background colors */
  --rotter-header-blue: #71B7E6;        /* Main header/logo bar, column headers */
  --rotter-subheader-blue: #3293CD;     /* Forum header row, breadcrumbs */
  --rotter-nav-blue: #2D8DCE;           /* Navigation bar background */
  --rotter-news-teal: #3984ad;          /* News page header */
  --rotter-dropdown-bg: #c6e0fb;        /* Dropdown menu background */
  --rotter-dropdown-item: #D9D9D9;      /* Dropdown item default bg */
  --rotter-dropdown-item-hover: #FFFFFF;/* Dropdown item hover bg */
  --rotter-row-odd: #FDFDFD;            /* Thread row odd */
  --rotter-row-even: #eeeeee;           /* Thread row even */
  --rotter-body-forum: #FEFEFE;         /* Forum body background */
  --rotter-body-news: #eaf4ff;          /* News page background */
  --rotter-body-home: #FFFFFF;          /* Homepage background */

  /* Text colors */
  --rotter-text-primary: #000099;       /* Primary link/text (dark navy) */
  --rotter-text-default: #000000;       /* Default body text */
  --rotter-text-visited: #909090;       /* Visited links (forum) */
  --rotter-text-header: #FFFFFF;        /* Header/nav text */
  --rotter-text-time: red;              /* Timestamps */
  --rotter-views-orange: #ff9933;       /* View count (normal) */
  --rotter-views-hot: red;              /* View count (hot thread) */
  --rotter-sort-orange: #ff6600;        /* Sort option links */
  --rotter-green-rating: #006633;       /* User rating points */
  --rotter-orange-accent: #FF8400;      /* Orange accent bars */
  --rotter-tooltip-header: #7D92A9;     /* Tooltip header bg */
  --rotter-tooltip-content: #e6f2ff;   /* Tooltip content bg */
  --rotter-lastby-link: #0000FF;        /* "Last reply by" link */

  /* --- Typography (confirmed from scoops_forum.html inline CSS) --- */
  --rotter-font-primary: Arial, Helvetica, sans-serif;
  --rotter-font-secondary: Tahoma, sans-serif;
  --rotter-font-decorative: Georgia, serif;

  --rotter-size-thread-title: 15px;     /* .text15bn */
  --rotter-size-post-title: 16px;       /* .text16b */
  --rotter-size-menu: 16px;             /* .menu1 */
  --rotter-size-body: 14px;             /* font size="2" equivalent */
  --rotter-size-meta: 12px;             /* font size="1" equivalent */
  --rotter-size-tooltip-title: 10pt;
  --rotter-size-tooltip-body: 9pt;
  --rotter-size-news-time: 9pt;
  --rotter-size-news-headline: 10pt;

  /* --- Layout Constants --- */
  --rotter-container-width: 1012px;     /* Homepage outer table */
  --rotter-nav-width: 975px;            /* Navigation bars */
  --rotter-sidebar-width: 300px;        /* Left sidebar (LTR mirror) */
  --rotter-center-width: 450px;         /* Breaking news center */
  --rotter-blue-bar-height: 25px;
  --rotter-orange-bar-height: 24px;
  --rotter-icon-size: 16px;             /* Thread icons */
  --rotter-toolbar-icon-size: 33px;     /* Login/help/search/post */
}
```

### Pattern 2: Table Component with Mandatory tbody

**What:** All table-based React components must include explicit `<tbody>`. The browser's auto-insertion of `<tbody>` into a `<table>` that lacks one creates a DOM node that React's server-rendered HTML doesn't include, triggering a hydration mismatch in the console.

**When to use:** Every `<table>` in every component.

**Example:**
```tsx
// Source: React 19 SSR hydration rules + confirmed in STATE.md decision log
export function ThreadTable({ rows }: { rows: ThreadRow[] }) {
  return (
    <table width="100%" cellSpacing={0} cellPadding={3} border={0}>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} style={{ backgroundColor: row.isOdd ? '#FDFDFD' : '#eeeeee' }}>
            <td>{/* ... */}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// WRONG — browser inserts <tbody>, React hydration mismatch:
// <table><tr>...</tr></table>
```

### Pattern 3: CSS Hover Dropdown (replacing JS ShowDiv1/HideDiv1)

**What:** Original Rotter uses `onmouseover="ShowDiv1()"` IE-era JavaScript to show dropdown menus. Replace with CSS `:hover` on a parent container — same visual behavior, no JavaScript.

**When to use:** Blue nav bar dropdown menus (LYOT-04).

**Example:**
```tsx
// DropdownMenu.tsx
export function DropdownMenu({ label, items }: DropdownMenuProps) {
  return (
    <div className={styles.dropdownWrapper}>
      <span className={styles.dropdownTrigger}>{label}</span>
      <div className={styles.dropdownPanel}>
        {items.map((item) => (
          <div key={item.href} className={styles.dropdownItem}>
            <a href={item.href}>{item.label}</a>
          </div>
        ))}
      </div>
    </div>
  );
}
```
```css
/* DropdownMenu.module.css */
.dropdownWrapper {
  position: relative;
  display: inline-block;
}

.dropdownPanel {
  display: none;
  position: absolute;
  background: var(--rotter-dropdown-bg);  /* #c6e0fb */
  z-index: 1;
  min-width: 150px;
}

.dropdownWrapper:hover .dropdownPanel {
  display: block;
}

.dropdownItem {
  background-color: var(--rotter-dropdown-item);  /* #D9D9D9 */
  padding: 1px 30px 1px 15px;
  font: 10pt Arial;
  text-align: left;  /* LTR mirror of Rotter's text-align:right */
}

.dropdownItem:hover {
  background-color: var(--rotter-dropdown-item-hover);  /* #FFFFFF */
}
```

### Pattern 4: SVG Icon with image-rendering: pixelated

**What:** SVG icons recreating Rotter's GIF icons must use `image-rendering: pixelated` to preserve the crisp pixel-art appearance when scaled. Rotter's original GIFs are low-resolution pixel art.

**When to use:** All SVG icons in `public/icons/` that replace Rotter GIFs.

**Example:**
```tsx
// Used inline for thread icons (16x16)
<img
  src="/icons/thread-normal.svg"
  width={16}
  height={16}
  alt=""
  style={{ imageRendering: 'pixelated' }}
/>
```

### Pattern 5: HeaderBar with Gradient Background

**What:** The Rotter header uses a repeating horizontal gradient image (`bg00.gif`) as the background. Replace with CSS `background-image: linear-gradient(...)` or a local image, centered in a 1012px container.

**When to use:** HeaderBar component only.

**Example:**
```tsx
// HeaderBar.tsx
export function HeaderBar({ dateString }: { dateString: string }) {
  return (
    <div className={styles.headerOuter}>
      <table
        width={1012}
        border={0}
        cellSpacing={0}
        cellPadding={0}
        className={styles.headerTable}
      >
        <tbody>
          <tr>
            <td width={335} className={styles.logoCell}>
              {/* Logo: SVG or img */}
            </td>
            <td className={styles.dateCell}>
              <span className={styles.dateText}>{dateString}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
```
```css
/* HeaderBar.module.css */
.headerOuter {
  display: flex;
  justify-content: center;
}

.headerTable {
  background-image: linear-gradient(to right, #71B7E6, #3293CD, #71B7E6);
  /* Approximate bg00.gif — replace with actual image if visual doesn't match */
}

.dateText {
  color: #ffffff;
  font-size: 12px;  /* font size=-1 equivalent */
  font-weight: bold;
  font-family: var(--rotter-font-primary);
}
```

### Anti-Patterns to Avoid

- **`<table>` without `<tbody>`:** Causes React 19 hydration errors on every page load. Every table must have an explicit `<tbody>`.
- **Hardcoding hex values in component CSS:** Use CSS custom properties from `globals.css`. If a color is hardcoded in a component, it will diverge from the canonical palette.
- **Using Tailwind utility classes for layout:** CSS Modules only. Tailwind generates classes like `bg-blue-400` that don't correspond to `#71B7E6` precisely, and the project decision is no CSS frameworks.
- **Creating a separate CSS file for each icon:** SVG icons go in `public/icons/` as static files, not CSS. They are referenced by `<img>` tags with explicit width/height.
- **Using CSS `display: flex` or `display: grid` for the nav bars or main layout:** The project requires actual `<table>` elements. Use flex/grid only for utilities that are not part of the core Rotter layout (e.g., centering the outer container within the viewport).
- **Registering the Serwist service worker in a client component:** Serwist's `next` adapter requires configuration in `next.config.ts` and a separate `sw.ts` entry point — it cannot be added later without modifying the build pipeline.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Service worker lifecycle | Custom SW registration + update logic | `@serwist/next` | SW precaching, update detection, and skipWaiting flow have many edge cases; Serwist handles all of them |
| SVG as React components | `<svg>` JSX inline in component files | Static SVG files in `public/icons/`, referenced via `<img>` | Static files don't increase JS bundle size; `<img>` supports `image-rendering: pixelated` cleanly |
| Date formatting | Custom date formatter | `Intl.DateTimeFormat` (built-in) | No dependency needed; handles locale formatting reliably |

**Key insight:** The design system is a pixel-replication problem, not a creative design problem. Every value is already specified. The risk is incorrect transcription, not architectural decision. Use the source files as the authoritative reference, not memory.

---

## Common Pitfalls

### Pitfall 1: React Hydration Mismatch from Missing tbody

**What goes wrong:** Browser console fills with `Error: Hydration failed because the server rendered HTML didn't match the client.` on every page. The UI may partially flash or reset.

**Why it happens:** Browsers auto-insert `<tbody>` when parsing HTML tables. React 19 SSR emits `<table><tr>...` without `<tbody>`. The browser sees `<table><tbody><tr>...` in the DOM, but React expects `<table><tr>...`. Mismatch.

**How to avoid:** Every `<table>` JSX element must contain `<tbody>` as its immediate child containing rows.

**Warning signs:** Any `<table>` in JSX that doesn't have `<tbody>` as immediate child of `<table>` and direct parent of `<tr>`.

### Pitfall 2: Next.js 16 vs. 15 API Differences

**What goes wrong:** Code examples from training data and web searches reference Next.js 15 APIs, but the current version is 16.2.1. Some configuration keys and component APIs may differ.

**Why it happens:** Next.js releases frequently. The CLAUDE.md references "Next.js 15.1.6" but the registry shows 16.2.1 as current.

**How to avoid:** Use `create-next-app@latest` which installs the current version. Read the generated `next.config.ts` and `package.json` to confirm actual installed version. Check Next.js changelog for breaking changes between 15 and 16 before writing config.

**Warning signs:** TypeScript errors in `next.config.ts`, unknown config keys, import path changes.

### Pitfall 3: Serwist Configuration Order

**What goes wrong:** Service worker fails to register, manifest is missing, or PWA install prompt never fires.

**Why it happens:** `@serwist/next` requires specific setup in `next.config.ts` AND a `sw.ts` entry point AND `manifest.json` in `public/`. If any of these are missing or in the wrong order, the SW either doesn't build or registers but does nothing.

**How to avoid:** Follow Serwist's exact setup sequence: (1) install `@serwist/next`, (2) create `src/app/sw.ts` with `defaultCache` import, (3) wrap `next.config.ts` export with `withSerwist({swSrc: 'src/app/sw.ts', ...})`, (4) create `public/manifest.json`. All four steps must happen before `next build`.

**Warning signs:** No `sw.js` file in `.next/` output, no `manifest.json` in `.next/static/`, browser DevTools Application tab shows no service worker registered.

### Pitfall 4: `image-rendering: pixelated` Not Applied to SVG Icons

**What goes wrong:** SVG icons look blurry or anti-aliased when rendered at 16x16, losing the pixel-art character of the original GIF icons.

**Why it happens:** SVG files render with sub-pixel anti-aliasing by default. `image-rendering: pixelated` is needed on the `<img>` element (not on the SVG file itself).

**How to avoid:** Every `<img>` rendering an icon SVG must have `style={{ imageRendering: 'pixelated' }}` or a CSS class that sets it.

**Warning signs:** Icons look smooth/blurred rather than sharp-edged when viewed at small sizes (16x16 or 33x33).

### Pitfall 5: Hex Values Without # Prefix in Original CSS

**What goes wrong:** Colors look wrong; some elements have black/white fallback instead of the intended color.

**Why it happens:** Rotter's inline HTML styles frequently omit the `#` prefix: `bgcolor="71B7E6"` (not `#71B7E6`), `color=000099` (not `#000099`). Browsers tolerate this in old HTML attributes, but CSS requires the prefix.

**How to avoid:** All CSS values must include the `#`. The CSS custom properties already include it. When transcribing from the source HTML, always add `#`.

**Warning signs:** Element background is white or black when it should be colored; color differs from the reference screenshot.

### Pitfall 6: LTR Mirror Requires Swapping left/right

**What goes wrong:** Sidebar appears on wrong side; dropdown position is off; nav caps appear at the wrong end.

**Why it happens:** Rotter is RTL. The spec describes the "right column" as the sidebar. In LTR, the sidebar must be the LEFT column. All `text-align:right` in the original becomes `text-align:left` in the LTR clone. Dropdown positioning uses `right:` in original; use `left:` in the LTR version.

**How to avoid:** When reading the design spec, mentally substitute: "right" → "left", "right end cap" → "left end cap", `text-align:right` → `text-align:left`.

**Warning signs:** Layout mirrors are visually identical to Rotter (the opposite of what we want).

---

## Code Examples

Verified patterns from official sources and confirmed spec:

### Complete globals.css CSS Tokens Block
```css
/* src/app/globals.css — Design tokens only; no resets here */

*, *::before, *::after {
  box-sizing: border-box;
}

:root {
  /* ===== ROTTER COLOR PALETTE ===== */
  /* Source: data/design/DESIGN_SPECIFICATION.md § 8, confirmed in scoops_forum.html */

  /* Backgrounds */
  --rotter-header-blue: #71B7E6;
  --rotter-subheader-blue: #3293CD;
  --rotter-nav-blue: #2D8DCE;
  --rotter-news-teal: #3984ad;
  --rotter-dropdown-bg: #c6e0fb;
  --rotter-dropdown-item: #D9D9D9;
  --rotter-dropdown-item-hover: #FFFFFF;
  --rotter-row-odd: #FDFDFD;
  --rotter-row-even: #eeeeee;
  --rotter-body-forum: #FEFEFE;
  --rotter-body-news: #eaf4ff;
  --rotter-body-home: #FFFFFF;
  --rotter-orange-accent: #FF8400;
  --rotter-orange-accent-light: #FFDE7F;
  --rotter-tooltip-header: #7D92A9;
  --rotter-tooltip-content: #e6f2ff;

  /* Text */
  --rotter-text-primary: #000099;
  --rotter-text-default: #000000;
  --rotter-text-visited: #909090;
  --rotter-text-header: #FFFFFF;
  --rotter-text-time: red;
  --rotter-text-red: red;
  --rotter-views-orange: #ff9933;
  --rotter-views-hot: red;
  --rotter-sort-orange: #ff6600;
  --rotter-green-rating: #006633;
  --rotter-lastby-link: #0000FF;

  /* ===== TYPOGRAPHY ===== */
  --rotter-font-primary: Arial, Helvetica, sans-serif;
  --rotter-font-secondary: Tahoma, sans-serif;
  --rotter-font-decorative: Georgia, serif;

  --rotter-size-xs: 9pt;          /* news time */
  --rotter-size-sm: 12px;         /* font size="1", metadata */
  --rotter-size-base: 14px;       /* font size="2", body text */
  --rotter-size-thread-title: 15px; /* .text15bn */
  --rotter-size-post-title: 16px;   /* .text16b */
  --rotter-size-menu: 16px;         /* .menu1 nav labels */
  --rotter-size-news-headline: 10pt;
  --rotter-size-tooltip-title: 10pt;
  --rotter-size-tooltip-body: 9pt;

  /* ===== LAYOUT CONSTANTS ===== */
  --rotter-container: 1012px;       /* Homepage outer table width */
  --rotter-nav-bar-width: 975px;    /* Blue/orange nav bar width */
  --rotter-sidebar: 300px;          /* Sidebar (LTR: left column) */
  --rotter-center-col: 450px;       /* Breaking news center column */
  --rotter-blue-bar-height: 25px;
  --rotter-orange-bar-height: 24px;
  --rotter-icon-sm: 16px;           /* Thread icons */
  --rotter-icon-toolbar: 33px;      /* Login/Help/Search/Post */
}

/* Link defaults matching Rotter forum pages */
a:link { text-decoration: none; }
a:visited { text-decoration: none; }
a:hover { text-decoration: underline; }
a:active { text-decoration: underline; }
```

### BlueNavBar Component
```tsx
// src/components/layout/BlueNavBar.tsx
// Source: data/design/DESIGN_SPECIFICATION.md § 2 Navigation Bars
// Blue bar height: 25px. Original used GIF image buttons — replaced with styled text.

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Archive", href: "/archive" },
  { label: "Exchange Rate", href: "/exchange" },
  { label: "Opinion", href: "/opinion" },
  { label: "Calendar", href: "/calendar" },
  { label: "News Flashes", href: "/news" },
  { label: "Weather", href: "/weather" },
  { label: "Home", href: "/" },
];

export function BlueNavBar() {
  return (
    <table
      width={975}
      border={0}
      cellSpacing={0}
      cellPadding={0}
      style={{ height: 25 }}
    >
      <tbody>
        <tr style={{ backgroundColor: "var(--rotter-nav-blue)", height: 25 }}>
          {NAV_ITEMS.map((item) => (
            <td key={item.href} style={{ padding: "0 4px" }}>
              <a
                href={item.href}
                style={{
                  fontFamily: "var(--rotter-font-primary)",
                  fontSize: "var(--rotter-size-menu)",
                  color: "var(--rotter-text-header)",
                  fontWeight: "bold",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </a>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
```

### Serwist next.config.ts Setup
```ts
// next.config.ts
// Source: @serwist/next v9.x documentation
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
});

export default withSerwist({
  // Next.js config options here
});
```

```ts
// src/app/sw.ts
// Service worker entry point
import { defaultCache } from "@serwist/next/worker";
import { installSerwist } from "@serwist/sw";

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next-pwa` for PWA | `@serwist/next` | 2023-2024 | next-pwa is unmaintained; use Serwist |
| Next.js Pages Router | App Router (default) | Next.js 13+ | App Router is now the default in create-next-app |
| JavaScript `onmouseover` dropdowns | CSS `:hover` pseudo-class | Always better in React | Eliminates JS event handler attachment on SSR components |
| `<table>` without `<tbody>` | Always explicit `<tbody>` | React 18+ strict hydration | Required to avoid hydration errors |
| `next` v15.x | `next` v16.2.1 | March 2026 | Current version as of npm registry check |

**Deprecated/outdated:**
- `next-pwa` (npm: `next-pwa`): Last published 2022; do not use
- `@ducanh2912/next-pwa`: Superseded by Serwist per STATE.md
- IE-specific `document.all` JavaScript: Original Rotter code; do not replicate in React

---

## Open Questions

1. **HeaderBar gradient background image**
   - What we know: Original uses `bg00.gif` — a repeating horizontal gradient image (confirmed from homepage.html source)
   - What's unclear: Whether a CSS gradient approximation is close enough visually, or whether we should create a local copy of `bg00.gif` or a new SVG replacement
   - Recommendation: Start with CSS linear-gradient approximating the blue-to-lighter-blue gradient; compare against reference screenshot; replace with local image asset if the visual deviates perceptibly

2. **Forum logo in HeaderBar vs. forum page logo**
   - What we know: Homepage uses `logo1.gif` (335px); forum pages use `logo_012b.gif`
   - What's unclear: Whether we create one SVG logo or two variants
   - Recommendation: Create a single `public/images/logo.svg` as a placeholder; Phase 2/3 will refine per-page usage

3. **Next.js 16 vs. CLAUDE.md's reference to Next.js 15.1.6**
   - What we know: CLAUDE.md technology stack lists Next.js 15.1.6, but `npm view next version` returns 16.2.1
   - What's unclear: Whether the CLAUDE.md references an older project that was not this one, or if it was written before the version bump
   - Recommendation: Use `create-next-app@latest` (installs 16.2.1). Update CLAUDE.md technology stack at phase completion. Verify no breaking API changes between 15 and 16 that affect App Router patterns used here.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest 29 + @testing-library/react 14 (per CLAUDE.md) |
| Config file | `jest.config.js` (to be created in Wave 0) |
| Quick run command | `npx jest --testPathPattern=components/layout` |
| Full suite command | `npx jest` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DSGN-01 | CSS custom properties resolvable from any component | smoke | `npx jest tests/design-tokens.test.ts` | ❌ Wave 0 |
| DSGN-02 | Typography classes render at correct pixel sizes | unit | `npx jest tests/typography.test.ts` | ❌ Wave 0 |
| DSGN-03 | SVG icons render at correct pixel size with image-rendering:pixelated | unit | `npx jest tests/icons.test.tsx` | ❌ Wave 0 |
| DSGN-04 | Table components include explicit `<tbody>` | unit | `npx jest tests/table-hydration.test.tsx` | ❌ Wave 0 |
| LYOT-01 | HeaderBar renders with gradient background, logo, date | unit | `npx jest tests/HeaderBar.test.tsx` | ❌ Wave 0 |
| LYOT-02 | BlueNavBar renders 25px height with correct bg color | unit | `npx jest tests/BlueNavBar.test.tsx` | ❌ Wave 0 |
| LYOT-03 | OrangeNavBar renders 24px height | unit | `npx jest tests/OrangeNavBar.test.tsx` | ❌ Wave 0 |
| LYOT-04 | DropdownMenu shows panel on hover trigger | unit | `npx jest tests/DropdownMenu.test.tsx` | ❌ Wave 0 |
| LYOT-05 | Page layouts use `<table>` elements (not div/flex) | unit | `npx jest tests/layout-tables.test.tsx` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx jest --testPathPattern=components/layout --passWithNoTests`
- **Per wave merge:** `npx jest`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/app/globals.css` — CSS tokens (design tokens file itself is Wave 0 output, not a test)
- [ ] `tests/design-tokens.test.ts` — verifies `--rotter-*` custom properties defined
- [ ] `tests/HeaderBar.test.tsx` — renders HeaderBar, checks className/structure
- [ ] `tests/BlueNavBar.test.tsx` — checks height style, background color token
- [ ] `tests/OrangeNavBar.test.tsx` — checks height style
- [ ] `tests/DropdownMenu.test.tsx` — checks dropdown panel visibility
- [ ] `tests/icons.test.tsx` — checks SVG files exist in public/icons/, img elements have imageRendering
- [ ] `tests/table-hydration.test.tsx` — checks every table-rendering component has tbody
- [ ] `jest.config.js` — framework config
- [ ] `jest.setup.ts` — @testing-library/jest-dom setup

---

## Sources

### Primary (HIGH confidence)
- `data/design/DESIGN_SPECIFICATION.md` — Complete Rotter.net design spec, all hex values, typography, icon inventory, layout dimensions
- `data/design/scoops_forum.html` — Raw Rotter forum HTML; confirmed all CSS class definitions and dropdown JavaScript
- `data/design/homepage.html` — Raw Rotter homepage HTML; confirmed header structure and auto-refresh meta tag
- `data/design/style.css` — Original Rotter style.css; confirmed text class definitions
- `npm view next version` → 16.2.1 (verified 2026-03-22)
- `npm view @serwist/next version` → 9.5.7 (verified 2026-03-22)
- `npm view typescript version` → 5.9.3 (verified 2026-03-22)

### Secondary (MEDIUM confidence)
- `.planning/STATE.md` — Confirmed Serwist decision and tbody hydration decision
- `PWA_PLAN.md` — Pre-existing phase breakdown, color palette, layout constants (cross-verified against DESIGN_SPECIFICATION.md)

### Tertiary (LOW confidence)
- CLAUDE.md technology stack section references Next.js 15.1.6 — superseded by registry check showing 16.2.1

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions verified against npm registry 2026-03-22
- Design tokens: HIGH — every value confirmed directly from raw HTML source files
- Architecture patterns: HIGH — CSS Modules + custom properties + explicit tbody are established React patterns
- Pitfalls: HIGH — hydration trap confirmed by STATE.md decision log; others confirmed from source analysis
- Serwist setup: MEDIUM — API pattern confirmed from package name/version; exact config keys should be verified against `@serwist/next` README at install time

**Research date:** 2026-03-22
**Valid until:** 2026-04-22 (Next.js is fast-moving; re-verify version if implementation is delayed more than 30 days)
