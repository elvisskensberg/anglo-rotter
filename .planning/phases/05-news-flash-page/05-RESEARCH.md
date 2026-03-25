# Phase 5: News Flash Page - Research

**Researched:** 2026-03-23
**Domain:** Next.js page + React client component (table layout, category filtering, auto-refresh)
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Body background: #eaf4ff
- Header with logo and #3984ad teal bar
- Category tabs row: #3984ad background, white text
- Categories: News, Sports, Economy, Tech, All
- Default tab: All (shows all categories)
- Each row 24px height
- 4 columns: source icon, headline, time, source name
- Alternating row colors matching Rotter pattern
- Source icons are placeholder colored circles (real source logos deferred to data layer phase)
- Auto-refresh every 5 minutes (300000ms)
- Same pattern as homepage: useEffect + setInterval + router.refresh()
- Configurable via env var
- NewsItem interface: id, headline, time, source, sourceIcon, category
- Minimum 30 seed news items across all categories
- Use data/design/news_page.html for structure reference

### Claude's Discretion
- Component decomposition (NewsCategoryTabs, NewsItemRow, NewsTable, NewsPageLayout)
- Exact source icon placeholder style
- Tab active/inactive styling details

### Deferred Ideas (OUT OF SCOPE)
None
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| NEWS-01 | Body background #eaf4ff, header with logo and #3984ad teal bar | CSS token --rotter-body-news already defined; --rotter-news-teal already defined; header is a full-width table with two cells (logo left, info+tabs right) |
| NEWS-02 | Category tabs row (#3984ad bg, white text): News, Sports, Economy, Tech, All | .newstitles CSS class pattern confirmed in source HTML; client-side useState for active tab filter |
| NEWS-03 | News items table: each row 24px, 4 columns (source icon, headline, time, source name) | Real HTML uses 3 columns (time, source, headline) — adapted design adds icon column; 24px row height via inline style or CSS Module rule `td { height: 24px }` |
| NEWS-04 | Auto-refresh every 5 minutes | Identical to HOME-04 pattern; use NEXT_PUBLIC_NEWS_REFRESH_INTERVAL_MS (default 300000) |
</phase_requirements>

---

## Summary

Phase 5 is a greenfield page build that heavily reuses established Phase 1-4 patterns. The project already has all the CSS tokens, layout shell components (HeaderBar, BlueNavBar, OrangeNavBar), and auto-refresh logic needed. The primary new work is: a dedicated news-page header (different from the forum header — it uses a full-width table with logo left + teal info bar right), category tab filtering via React state, and the news items table.

The real Rotter news_page.html reveals the actual news table uses 3 columns (time, source name, headline) — the CONTEXT.md specifies a 4-column adapted design that adds a source icon placeholder column on the left. This is intentional — real source icons are deferred to the data layer phase. Source icon placeholders should be colored circles using the same CSS-in-JS inline style or a tiny CSS module class.

The header structure for the news page is distinctly different from the forum/homepage header: it is a full-width `<table>` (no 1012px container constraint) with `class="addLns1"` cells (background #3984ad), and it embeds both a date/search sub-row and the category tabs within the right cell. The route sits at `/news` (NavBar already links to `/news-flashes` — this needs reconciling or the route should match the existing link).

**Primary recommendation:** Mirror the ForumPage route pattern exactly. Server component page.tsx renders HeaderBar + BlueNavBar + OrangeNavBar + NewsPageLayout. NewsPageLayout is 'use client' and owns the category filter state and auto-refresh interval.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | 15.1.6 | Route at src/app/news/page.tsx | All pages use App Router; already in project |
| React useState | 19.0.0 | Active category tab state | Established pattern for client-side filter state |
| CSS Modules | (built-in) | Component-scoped styles | All existing components use .module.css |
| TypeScript | 5.x | NewsItem interface and typed props | Full codebase convention |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| useRouter (next/navigation) | 15.1.6 | router.refresh() for auto-refresh | Exact same pattern as HomepageLayout |
| useEffect | 19.0.0 | setInterval lifecycle management | Same pattern as HomepageLayout |

### No New Dependencies
This phase requires zero new npm packages. Everything needed is already in the project.

**Installation:**
```bash
# No new packages required
```

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   └── news/
│       └── page.tsx              # Server component, route entry point
├── components/
│   └── news/
│       ├── index.ts              # Barrel export
│       ├── NewsPageLayout.tsx    # 'use client' — owns filter state + auto-refresh
│       ├── NewsPageLayout.module.css
│       ├── NewsCategoryTabs.tsx  # Tab row; receives activeTab + onTabChange props
│       ├── NewsCategoryTabs.module.css
│       ├── NewsTable.tsx         # <table> with <tbody>, renders NewsItemRow list
│       ├── NewsTable.module.css
│       ├── NewsItemRow.tsx       # Single <tr> — source icon, headline, time, source
│       └── NewsItemRow.module.css
└── data/
    └── news-seed.ts              # NewsItem interface + NEWS_SEED array (30+ items)
```

### Pattern 1: Server Component Page + Client Layout
**What:** page.tsx is a server component (no 'use client'), NewsPageLayout is the 'use client' boundary.
**When to use:** Consistently used in Phases 2, 3, 4 — forum/[forumId]/page.tsx, thread/[threadId]/page.tsx.
**Example:**
```typescript
// src/app/news/page.tsx  — mirrors forum/[forumId]/page.tsx exactly
import { HeaderBar, BlueNavBar, OrangeNavBar } from "@/components/layout";
import { NewsPageLayout } from "@/components/news";
import { NEWS_SEED } from "@/data/news-seed";

export default function NewsPage() {
  return (
    <div style={{ backgroundColor: "var(--rotter-body-news)" }}>
      <NewsPageLayout items={NEWS_SEED} />
    </div>
  );
}
```

### Pattern 2: Auto-Refresh via setInterval + router.refresh()
**What:** useEffect registers a setInterval that calls router.refresh() at a configurable interval.
**When to use:** All pages with live data. NEWS-04 specifies 5 minutes.
**Example:**
```typescript
// Source: src/components/homepage/HomepageLayout.tsx (confirmed working)
const REFRESH_MS = Number(process.env.NEXT_PUBLIC_NEWS_REFRESH_INTERVAL_MS ?? 300000);

useEffect(() => {
  const id = setInterval(() => {
    router.refresh();
  }, REFRESH_MS);
  return () => clearInterval(id);
}, [router]);
```

### Pattern 3: Category Tab Filter via useState
**What:** NewsPageLayout holds `activeCategory` state. NewsTable filters `items` by category before rendering.
**When to use:** Client-side filtering without URL params (seed data only, no API).
**Example:**
```typescript
type NewsCategory = "news" | "sports" | "economy" | "tech" | "all";

const [activeCategory, setActiveCategory] = useState<NewsCategory>("all");

const visibleItems = activeCategory === "all"
  ? items
  : items.filter((item) => item.category === activeCategory);
```

### Pattern 4: News Header (different from forum/homepage header)
**What:** Full-width table, no 1012px container. Left cell = logo (290px). Right cell = teal sub-bar + category tabs.
**Key difference:** The news page does NOT use the existing HeaderBar component. It has its own layout.
**Example:**
```typescript
// Source: data/design/news_page.html lines 141-198
// Outer table: width="100%", no cellspacing/cellpadding, teal background on cells
<table border={0} width="100%" cellSpacing={0} cellPadding={0}>
  <tbody>
    <tr>
      <td className={styles.logoCell}>  {/* width: 290px, bg: #3984ad */}
        <img src="/images/news-logo.svg" alt="MultiRotter News" />
      </td>
      <td className={styles.infoCell}>  {/* bg: #3984ad */}
        {/* date/time row */}
        <NewsCategoryTabs activeTab={activeCategory} onTabChange={setActiveCategory} />
      </td>
    </tr>
  </tbody>
</table>
```

### Pattern 5: News Item Row (4 columns)
**What:** Each `<tr>` is 24px tall. Four `<td>` cells: source icon placeholder, headline, time, source name.
**Source:** CONTEXT.md specifies 4 columns; real HTML uses 3 (time, source, headline). We add the icon column.
**Example:**
```typescript
// NewsItemRow.tsx — inside NewsTable's <tbody>
<tr style={{ height: "24px", backgroundColor: isEven ? "var(--rotter-row-even)" : "var(--rotter-row-odd)" }}>
  <td className={styles.iconCell}>
    <span className={styles.sourceIcon} style={{ backgroundColor: item.sourceIconColor }} />
  </td>
  <td className={styles.headlineCell}>
    <a href={item.url} style={{ color: "var(--rotter-text-primary)", fontSize: "16px" }}>
      {item.headline}
    </a>
  </td>
  <td className={styles.timeCell} dir="ltr">
    <font size={-1}>{item.time}</font>
  </td>
  <td className={styles.sourceCell}>
    <b><font size={-1}>{item.source}</font></b>
  </td>
</tr>
```

### Pattern 6: CSS Module with var(--rotter-*) tokens
**What:** All style values use tokens from globals.css. No hardcoded hex values in component CSS.
**Example:**
```css
/* NewsPageLayout.module.css */
.newsHeader {
  background-color: var(--rotter-news-teal);
  color: var(--rotter-text-header);
}

.categoryTab {
  background-color: var(--rotter-news-teal);
  color: #ffffff;
  text-align: center;
  margin: 0 1px;
  cursor: pointer;
}

.categoryTabActive {
  /* Slightly differentiated — Claude's discretion */
  background-color: var(--rotter-subheader-blue);
}
```

### Pattern 7: Seed Data Interface
**What:** Typed interface + exported const array, following homepage-seed.ts and forum-seed.ts structure.
**Example:**
```typescript
// src/data/news-seed.ts
export interface NewsItem {
  id: number;
  headline: string;
  time: string;       // "HH:MM DD/MM" format matching real page
  source: string;     // e.g. "Ynet", "Maariv", "Israel Today"
  sourceIcon: string; // placeholder color string e.g. "#e63946"
  category: "news" | "sports" | "economy" | "tech";
  url: string;
}

export const NEWS_SEED: NewsItem[] = [ /* 30+ items */ ];
```

### Anti-Patterns to Avoid
- **Reusing HeaderBar for the news header:** The news page header is a full-width teal table with logo + tabs. HeaderBar is the forum/homepage gradient header at 1012px. They are different components.
- **Using URL query params for tab state:** CONTEXT.md specifies client-side filtering via seed data. No routing needed.
- **Global td height CSS:** The real HTML uses `td { height: 24px }` globally. In CSS Modules, scope this to the news table only, or use `tr` inline style to avoid bleeding into nav bars.
- **Missing tbody:** DSGN-04 requires explicit `<tbody>` in all table components to prevent React hydration mismatch.
- **Hardcoded hex values:** Always use `var(--rotter-*)` tokens. #3984ad is already `--rotter-news-teal`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Interval management | Custom timer class | useEffect + setInterval + clearInterval | Already established; tested in AutoRefresh.test.tsx |
| Route refresh | window.location.reload() | router.refresh() | Preserves React state; Next.js App Router pattern |
| CSS class merging | String concatenation | Template literal with styles.base + styles.active | CSS Modules handle scoping; no need for clsx at this scale |

**Key insight:** This phase is 95% composition of existing patterns. The only net-new code is the news-specific header structure, category tab state, and seed data.

---

## Common Pitfalls

### Pitfall 1: Route Path Mismatch with NavBar Link
**What goes wrong:** BlueNavBar.tsx already links "News Flashes" to `/news-flashes`. If the page is created at `/news`, clicking the nav link 404s.
**Why it happens:** The NavBar was created before the news page route existed.
**How to avoid:** Either (a) create the page at `src/app/news-flashes/page.tsx` to match the existing link, or (b) update BlueNavBar's href to `/news`. The CONTEXT.md says route is `/news` — update the NavBar link.
**Warning signs:** Clicking "News Flashes" in the blue nav bar returns 404.

### Pitfall 2: Global td Height Bleed
**What goes wrong:** The original news_page.html uses `td { background: #FFFFFF; height: 24px; }` as a page-global style. Applying this globally in Next.js will affect all page elements including nav bars.
**Why it happens:** The original site uses inline `<style>` tags scoped to one page. CSS Modules in Next.js don't have this scoping unless applied correctly.
**How to avoid:** Scope the 24px height rule to the news items table only — apply it as `height: "24px"` on `<tr>` elements or in a `.newsRow` CSS Module class.

### Pitfall 3: Missing tbody Causes Hydration Mismatch
**What goes wrong:** React renders `<table><tr>` which browsers silently insert `<tbody>` for, causing server/client HTML mismatch.
**Why it happens:** Standard browser behavior; React warns but it's easy to overlook.
**How to avoid:** DSGN-04 is already in the requirements. Every `<table>` MUST have explicit `<tbody>`. This was a pre-existing lesson from Phase 1.

### Pitfall 4: activeCategory "all" is Not a NewsItem Category Value
**What goes wrong:** If NewsItem.category TypeScript type includes "all", seed data items would need a category of "all", which makes no sense semantically.
**Why it happens:** Conflating the filter state type with the data type.
**How to avoid:** Use a union type for the tab state (`"news" | "sports" | "economy" | "tech" | "all"`) that is separate from the NewsItem category (`"news" | "sports" | "economy" | "tech"`). Filter function checks `activeCategory === "all"` before filtering.

### Pitfall 5: env var name collision with homepage refresh
**What goes wrong:** Using `NEXT_PUBLIC_REFRESH_INTERVAL_MS` for both homepage and news page intervals. News page should refresh every 5 minutes; homepage every ~13 minutes.
**Why it happens:** Reusing the same env var key without thinking.
**How to avoid:** Use `NEXT_PUBLIC_NEWS_REFRESH_INTERVAL_MS` (default 300000) distinct from `NEXT_PUBLIC_REFRESH_INTERVAL_MS` (default 780000).

---

## Code Examples

Verified patterns from project source:

### Auto-Refresh Hook Pattern
```typescript
// Source: src/components/homepage/HomepageLayout.tsx (confirmed)
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const REFRESH_MS = Number(process.env.NEXT_PUBLIC_NEWS_REFRESH_INTERVAL_MS ?? 300000);

export function NewsPageLayout({ items }: { items: NewsItem[] }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      router.refresh();
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, [router]);

  // ...
}
```

### News Table Row (real HTML structure, adapted)
```typescript
// Source: data/design/news_page.html — actual row pattern (confirmed)
// Original: <td width=10% dir=ltr nowrap align=center><font size=-1>19:56 22/03</font></td>
//           <td><font size=-1><b>מעריב</b></font></td>
//           <td><a href="..."><span style="color:000099; font-size:16px;">HEADLINE</span></a></td>
// Adapted (4-column with icon):
<tr style={{ height: "24px", backgroundColor: isEven ? "#eeeeee" : "#FDFDFD" }}>
  <td style={{ width: "24px", textAlign: "center", backgroundColor: "#eeeeee" }}>
    <span style={{
      display: "inline-block",
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      backgroundColor: item.sourceIcon,
    }} />
  </td>
  <td>
    <a href={item.url} style={{ color: "#000099", fontSize: "16px" }}>
      {item.headline}
    </a>
  </td>
  <td style={{ width: "10%" }} dir="ltr">
    <font size={-1}>{item.time}</font>
  </td>
  <td>
    <font size={-1}><b>{item.source}</b></font>
  </td>
</tr>
```

### Category Tab CSS Pattern
```css
/* Source: data/design/news_page.html <style> block (confirmed) */
/* .newstitles { background: #3984ad; color: #fff; text-align: center; margin: 0px 1px; } */
.categoryTab {
  background-color: var(--rotter-news-teal);
  color: #ffffff;
  text-align: center;
  margin: 0 1px;
  padding: 2px 8px;
  cursor: pointer;
  font-weight: bold;
}

.categoryTabActive {
  /* Distinguish active tab — Claude's discretion */
  background-color: var(--rotter-subheader-blue); /* slightly darker */
  text-decoration: underline;
}
```

### Existing CSS Tokens for News Page
```css
/* Source: src/app/globals.css (confirmed present) */
--rotter-body-news: #eaf4ff;     /* body background */
--rotter-news-teal: #3984ad;     /* header + tabs background */
--rotter-text-primary: #000099;  /* headline link color */
--rotter-row-odd: #FDFDFD;       /* alternating row color */
--rotter-row-even: #eeeeee;      /* alternating row color */
--rotter-text-header: #FFFFFF;   /* white text on teal */
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `<meta http-equiv=refresh>` | useEffect + router.refresh() | Project start (Phase 2) | Preserves React state; no full page reload |
| Global inline `<style>` | CSS Modules with var() tokens | Phase 1 | Scoped styles, no bleeding |
| Image-based nav buttons | Text-based nav items | Phase 1 | No external image dependency |

**Deprecated/outdated in this project:**
- `<font>` tags: The real HTML uses them extensively. This project uses CSS Module classes and inline styles instead — but `<font>` tags are acceptable if matching the original exactly is the priority (they are valid HTML, just deprecated).

---

## Open Questions

1. **Route path: `/news` or `/news-flashes`?**
   - What we know: CONTEXT.md says route is `src/app/news/page.tsx` (implying `/news`). BlueNavBar.tsx links "News Flashes" to `/news-flashes`.
   - What's unclear: Which should be authoritative?
   - Recommendation: Create page at `src/app/news/page.tsx` and update BlueNavBar href from `/news-flashes` to `/news`. The plan should include a task for NavBar link update.

2. **News logo image**
   - What we know: Real page uses `https://rotter.net/news/logo1.gif` (290px). The project uses `/images/logo.svg` for the main header.
   - What's unclear: Should a separate news logo SVG be created, or reuse the main logo?
   - Recommendation: Reuse `/images/logo.svg` at appropriate size for now. A distinct news logo is not a NEWS-01 requirement.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest 29.7.0 + @testing-library/react 14.1.2 |
| Config file | jest.config.js |
| Quick run command | `npx jest --testPathPattern="News" --no-coverage` |
| Full suite command | `npx jest --no-coverage` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| NEWS-01 | Page renders with #eaf4ff body bg and teal header | unit | `npx jest --testPathPattern="NewsPage" --no-coverage` | ❌ Wave 0 |
| NEWS-02 | Category tabs render; clicking a tab filters news items | unit | `npx jest --testPathPattern="NewsCategoryTabs\|NewsPageLayout" --no-coverage` | ❌ Wave 0 |
| NEWS-03 | News table rows are 24px, 4 columns present, alternating row colors | unit | `npx jest --testPathPattern="NewsTable\|NewsItemRow" --no-coverage` | ❌ Wave 0 |
| NEWS-04 | Auto-refresh calls router.refresh() at 300000ms interval | unit | `npx jest --testPathPattern="NewsAutoRefresh\|NewsPageLayout" --no-coverage` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx jest --testPathPattern="News" --no-coverage`
- **Per wave merge:** `npx jest --no-coverage`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/NewsPage.test.tsx` — covers NEWS-01 (page renders, bg color token)
- [ ] `src/__tests__/NewsCategoryTabs.test.tsx` — covers NEWS-02 (tab click filters items)
- [ ] `src/__tests__/NewsTable.test.tsx` — covers NEWS-03 (row count, column count, alternating colors)
- [ ] `src/__tests__/NewsAutoRefresh.test.tsx` — covers NEWS-04 (interval fires router.refresh at 300000ms, clears on unmount)
- [ ] `src/data/news-seed.test.ts` — validates 30+ seed items, all categories represented, required fields non-empty

---

## Sources

### Primary (HIGH confidence)
- `data/design/news_page.html` — Live scraped Rotter news page HTML, exact structure confirmed
- `data/design/DESIGN_SPECIFICATION.md §5` — News Page section, CSS classes confirmed
- `src/app/globals.css` — CSS tokens verified present: --rotter-body-news, --rotter-news-teal, --rotter-row-odd/even
- `src/components/homepage/HomepageLayout.tsx` — Auto-refresh pattern, exact code confirmed
- `src/data/homepage-seed.ts`, `src/data/forum-seed.ts` — Seed data interface patterns confirmed

### Secondary (MEDIUM confidence)
- `src/app/forum/[forumId]/page.tsx` — Server component page pattern, verified applicable
- `src/__tests__/AutoRefresh.test.tsx` — Test pattern for auto-refresh verified, directly reusable
- `src/components/layout/BlueNavBar.tsx` — NavBar link to `/news-flashes` confirmed (needs update)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — zero new dependencies; all patterns confirmed from existing source files
- Architecture: HIGH — direct analogy to Phase 3/4 patterns confirmed in codebase
- HTML structure: HIGH — confirmed from live news_page.html scrape
- CSS tokens: HIGH — globals.css inspected, all required tokens present
- Pitfalls: HIGH — most derived from confirmed project patterns and HTML inspection

**Research date:** 2026-03-23
**Valid until:** 2026-05-23 (stable patterns; only invalidated if Phase 1-4 components are refactored)
