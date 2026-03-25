---
phase: 05-news-flash-page
plan: "02"
subsystem: ui
tags: [react, nextjs, css-modules, news, table-layout]

requires:
  - phase: 05-news-flash-page plan 01
    provides: NewsItem interface, NEWS_SEED data, Wave 0 test stubs, news CSS tokens

provides:
  - NewsItemRow component (24px 4-column row with source icon circle)
  - NewsCategoryTabs component (5 filter tabs with active state)
  - NewsTable component (full-width news items table)
  - NewsPageLayout client component (teal header, auto-refresh, category filtering)
  - /news route (src/app/news/page.tsx server component entry)
  - All 25 Wave 0 news tests passing

affects: [06-headlines-page, 07-api-layer, any phase using news components]

tech-stack:
  added: []
  patterns:
    - "News page uses own distinct teal header — no HeaderBar/BlueNavBar wrapper"
    - "CSS module active state: categoryTab + active dual class so identity-obj-proxy includes('active') works"
    - "Inline hex values for alternating row backgrounds (CSS vars don't resolve in jsdom toHaveStyle)"
    - "isEven=true for index 0,2,4... → #FDFDFD (row-odd); isEven=false → #eeeeee (row-even)"
    - "Source icon borderRadius: 50% in inline style (not CSS module) so tests can check getAttribute('style')"

key-files:
  created:
    - src/components/news/NewsItemRow.tsx
    - src/components/news/NewsItemRow.module.css
    - src/components/news/NewsCategoryTabs.tsx
    - src/components/news/NewsCategoryTabs.module.css
    - src/components/news/NewsTable.tsx
    - src/components/news/NewsTable.module.css
    - src/components/news/NewsPageLayout.tsx
    - src/components/news/NewsPageLayout.module.css
    - src/components/news/index.ts
    - src/app/news/page.tsx
  modified: []

key-decisions:
  - "Inline hex values used for row backgrounds instead of CSS vars — jsdom toHaveStyle cannot resolve CSS custom properties"
  - "NewsCategoryTabs active state uses two CSS classes (categoryTab + active) not one (categoryTabActive) — identity-obj-proxy returns camelCase class names so 'categoryTabActive'.includes('active') is false (capital A)"
  - "Source icon circle borderRadius:50% placed in inline style not CSS module — tests check getAttribute('style') for the property"
  - "NewsPageLayout uses 300000ms (5 min) interval from NEXT_PUBLIC_NEWS_REFRESH_INTERVAL_MS env var, same pattern as HomepageLayout"

patterns-established:
  - "jsdom CSS-module pattern: use inline style for properties that tests assert on via getAttribute('style') or toHaveStyle"
  - "Active tab dual-class pattern: base class + active class so className.includes('active') always works with identity-obj-proxy"

requirements-completed: [NEWS-01, NEWS-02, NEWS-03, NEWS-04]

duration: 18min
completed: "2026-03-22"
---

# Phase 5 Plan 02: News Flash Page Components Summary

**Complete /news page with teal header, 5-category filter tabs, 24px 4-column news table, and 5-minute auto-refresh via router.refresh()**

## BLOCKING ISSUES

None

## Performance

- **Duration:** ~18 min
- **Started:** 2026-03-22T22:46:24Z
- **Completed:** 2026-03-22T23:04:00Z
- **Tasks:** 3 (Tasks 1 and 2 executed together due to barrel dependency)
- **Files modified:** 10 created

## Accomplishments

- All 25 Wave 0 news tests from Plan 01 now pass (198 total test suite)
- /news route builds as a static page via Next.js production build
- NewsItemRow renders 24px rows with colored circle icon, headline link, time, source name
- NewsCategoryTabs renders 5 tabs (News/Sports/Economy/Tech/All) with active highlight and click filtering
- NewsPageLayout: full teal header with logo, date, nav links, category tabs, and section title
- Auto-refresh fires every 300000ms via setInterval + router.refresh() with cleanup on unmount
- Category filtering: "All" shows all 32 items; each category filters to its 8 items

## Task Commits

1. **Task 1: NewsItemRow and NewsCategoryTabs leaf components** - `af8ad85` (feat)
2. **Task 2: NewsTable, NewsPageLayout, barrel export, and route** - `5f0f5b7` (feat)
3. **Task 3: Full test suite validation and build check** - (validation only, no files changed)

## Files Created/Modified

- `src/components/news/NewsItemRow.tsx` - 24px table row with 4-column layout
- `src/components/news/NewsItemRow.module.css` - CSS classes for row cells
- `src/components/news/NewsCategoryTabs.tsx` - 5-tab filter bar with active state
- `src/components/news/NewsCategoryTabs.module.css` - Tab and active tab styles
- `src/components/news/NewsTable.tsx` - Table wrapper mapping items to NewsItemRows
- `src/components/news/NewsTable.module.css` - Table layout styles
- `src/components/news/NewsPageLayout.tsx` - Client component: teal header, tabs, auto-refresh
- `src/components/news/NewsPageLayout.module.css` - Header, logo, info cell, section title styles
- `src/components/news/index.ts` - Barrel export for all 4 components
- `src/app/news/page.tsx` - Server component entry point; passes NEWS_SEED to NewsPageLayout

## Decisions Made

1. **Inline hex values for row backgrounds** — `toHaveStyle({ backgroundColor: "#FDFDFD" })` requires the actual hex value in the style attribute. CSS custom properties (e.g. `var(--rotter-row-odd)`) don't resolve in jsdom. Used `#FDFDFD` and `#eeeeee` directly.

2. **Dual-class active tab pattern** — The Wave 0 test checks `el.className.includes("active")` (lowercase). With identity-obj-proxy, `styles.categoryTabActive` returns `"categoryTabActive"` and `"categoryTabActive".includes("active")` is `false` because the "A" is uppercase. Fixed by using `${styles.categoryTab} ${styles.active}` — `"active".includes("active")` is `true`.

3. **Source icon borderRadius in inline style** — The Wave 0 test checks `getAttribute("style")` for `"border-radius"`. CSS module properties aren't in the style attribute in jsdom. Moved `borderRadius: "50%"` to the inline style object.

4. **isEven naming** — `isEven={index % 2 === 0}` means index 0 is `isEven=true`. The test expects index 0 (first row, visually "odd" in 1-indexed) to be `#FDFDFD` (row-odd color). So `isEven=true` maps to `#FDFDFD`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Wave 0 tests failing due to CSS module class naming mismatch**
- **Found during:** Task 1 (NewsCategoryTabs test verification)
- **Issue:** `identity-obj-proxy` returns `"categoryTabActive"` as the class name string. The Wave 0 test checks `el.className.includes("active")` (lowercase "a"), but `"categoryTabActive"` contains `"Active"` (capital A), so `.includes("active")` returns `false`.
- **Fix:** Changed from single class `styles.categoryTabActive` to dual classes `${styles.categoryTab} ${styles.active}`. The `"active"` class name returned by identity-obj-proxy passes the `includes("active")` check.
- **Files modified:** src/components/news/NewsCategoryTabs.tsx, src/components/news/NewsCategoryTabs.module.css
- **Verification:** All 4 NewsCategoryTabs tests pass
- **Committed in:** af8ad85 (Task 1 commit)

**2. [Rule 1 - Bug] Row background color check failing (CSS var not resolved in jsdom)**
- **Found during:** Task 1/2 (NewsTable test verification)
- **Issue:** Row background was set as `var(--rotter-row-odd)` / `var(--rotter-row-even)`. jsdom cannot resolve CSS custom properties, so `toHaveStyle({ backgroundColor: "#FDFDFD" })` fails.
- **Fix:** Used explicit hex values `"#FDFDFD"` and `"#eeeeee"` directly in inline styles.
- **Files modified:** src/components/news/NewsItemRow.tsx
- **Verification:** "rows have alternating background colors" test passes
- **Committed in:** af8ad85 (Task 1 commit)

**3. [Rule 1 - Bug] isEven=true mapped to wrong color**
- **Found during:** Task 1/2 (NewsTable alternating color test)
- **Issue:** Initial code had `isEven ? "#eeeeee" : "#FDFDFD"`. The test expects index 0 (isEven=true) to be `#FDFDFD` (the row-odd/lighter color). The mapping was backwards.
- **Fix:** Swapped to `isEven ? "#FDFDFD" : "#eeeeee"`.
- **Files modified:** src/components/news/NewsItemRow.tsx
- **Verification:** All 4 alternating background assertions pass
- **Committed in:** af8ad85 (Task 1 commit)

**4. [Rule 1 - Bug] Source icon circle borderRadius not visible to test**
- **Found during:** Task 1/2 (NewsTable source icon test)
- **Issue:** `borderRadius: "50%"` was in the CSS module. The test checks `getAttribute("style")` for the property, which only sees inline styles. CSS module properties are applied as class names in jsdom, not as style attribute values.
- **Fix:** Moved full circle styles (display, width, height, borderRadius, backgroundColor) to inline `style` prop on the span.
- **Files modified:** src/components/news/NewsItemRow.tsx
- **Verification:** "renders source icon placeholder as colored circle" test passes
- **Committed in:** af8ad85 (Task 1 commit)

---

**Total deviations:** 4 auto-fixed (all Rule 1 - jsdom/identity-obj-proxy behavioral differences)
**Impact on plan:** All fixes are about making tests correctly verify the rendered DOM in jsdom. No functional scope creep. The production behavior is identical — jsdom simply requires different assertion strategies than browser-based testing.

## Issues Encountered

The barrel `index.ts` needed to exist before Task 1 tests could run (since tests import from `@/components/news`). This required creating all files in a single pass rather than strictly Task 1 then Task 2. All planned components were still committed in the correct task groupings.

## Test Health Snapshot

- **Total tests:** 198
- **Passed (no retries):** 198
- **Failed:** 0
- **Flaky fixed this plan:** 0
- **Coverage:** Not measured (--no-coverage flag used per plan)

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- /news route complete and building. Phase 5 requirements NEWS-01 through NEWS-04 satisfied.
- Category filtering works client-side with the seed data.
- Auto-refresh wired to NEXT_PUBLIC_NEWS_REFRESH_INTERVAL_MS env var (defaults to 300000ms).
- Phase 5 is complete. Ready for Phase 6 (Headlines Page) or Phase 7 (API Layer).

---
*Phase: 05-news-flash-page*
*Completed: 2026-03-22*
