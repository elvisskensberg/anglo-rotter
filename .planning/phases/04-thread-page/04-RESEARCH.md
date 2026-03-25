# Phase 4: Thread Page - Research

**Researched:** 2026-03-22
**Domain:** Next.js App Router dynamic route, React table-based layout, interactive reply tree, seed data extension
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Original Post Block**
- Author info row on #eeeeee background: username, star rating (using star-1 through star-5 SVGs), member since date, post count, raters/points
- Post content area on #FDFDFD background with 16px bold h1 title
- Content in a 70%-width nested table (matching Rotter's structure)
- All using `var(--rotter-*)` tokens, no hardcoded hex

**Reply Tree**
- 4-column table: thread title, author, date, reply number
- Nested indentation: 4 spaces (or equivalent padding) per nesting level
- message.svg icon for top-level replies, reply-message.svg for nested replies
- Alternating row colors: #eeeeee / #FDFDFD

**Action Buttons**
- Row below post content: edit, up, reply, view all, back to forum
- Styled as text links matching Rotter's button bar

**Quick Reply Form**
- Hidden by default, toggled visible by "Reply" button click
- Simple textarea + submit button
- No actual submission (Phase 9 adds auth + real posting)

**Breadcrumb Navigation**
- #3293CD blue background bar
- Format: "Forums > {Section Name} > Thread #{id}"
- Each segment is a navigable link (Forums → homepage, Section → forum listing)

**Seed Data**
- Extend ForumThread with full post content and reply tree
- ThreadPost interface: id, author, content, date, memberSince, postCount, starRating, ratersCount, points
- ReplyTreeItem interface: id, title, author, date, replyNumber, depth, icon (message/reply-message)
- Minimum 1 seed thread with 15+ replies at 3+ depth levels

### Claude's Discretion
- Component decomposition (OriginalPostBlock, ReplyTree, ReplyRow, QuickReplyForm, ThreadBreadcrumb, ActionButtons)
- CSS Module naming
- Reply tree depth limit (recommend 5 levels max for readability)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| THRD-01 | Original post block with author info row (#eeeeee): username, star rating, member since, post count, raters/points | Verified HTML pattern at line 524-538 of thread_page.html — exact structure documented |
| THRD-02 | Post content area (#FDFDFD) with h1 title (16px bold) and content in 70%-width nested table | Verified HTML at line 541-554 — `<h1 CLASS='text16b'>`, `<table width="70%" style="display:inline-table">` |
| THRD-03 | Action buttons row: edit, up, reply, view all, back to forum | Verified HTML at line 558-569 — five icon links in `<TR BGCOLOR="#eeeeee">` |
| THRD-04 | Reply thread tree table with 4 columns (thread, author, date, number) | Verified HTML at line 585-596 — th headers: האשכול, מחבר, תאריך כתיבה, מספר |
| THRD-05 | Nested reply indentation (4 spaces per level) with message/reply_message icons | Verified indentation formula: depth=1 → 2 nbsp + message.gif; depth>=2 → (depth-1)*4 nbsp + reply_message.gif |
| THRD-06 | Alternating row colors in reply tree (#eeeeee / #FDFDFD) | Verified in HTML — rows alternate `bgcolor="#eeeeee"` and `bgcolor="#FDFDFD"` |
| THRD-07 | Quick reply form (hidden by default, toggled by button) | Original triggers `javascript:updatePropertyDisplay('0')` — translate to React `useState` toggle |
| THRD-08 | Breadcrumb navigation (#3293CD bar): Forums > Section > Thread # | Verified HTML at line 483-500 — `<TR bgcolor="#3293CD">` with three segments separated by dir.gif arrow |
</phase_requirements>

---

## Summary

Phase 4 delivers the thread detail page at `/thread/[threadId]`. The primary design source is `data/design/thread_page.html` (thread #940099, scraped 2026-03-22) which provides exact HTML structure for every component: the author block, post content area, action buttons, breadcrumb bar, and reply tree.

All patterns follow the established project conventions: table-based layout, CSS Modules with `var(--rotter-*)` tokens, explicit `<tbody>` on all `<Table>` uses, and `'use client'` only at the interactive boundary. The existing `ForumThread` type in `src/data/forum-seed.ts` must be extended with a new `ThreadPost` and `ReplyTreeItem` type; scraped data in `data/threads/threads_with_comments_2026-03-22.json` provides real reply trees (up to 6 levels deep) to translate into English seed records.

The quick reply toggle is the only interactive requirement. It follows the same `useState` pattern already used in `ForumThreadTable` — the client boundary can live in a single `ThreadPageClient` wrapper while the route `page.tsx` stays a server component.

**Primary recommendation:** Build a new route `src/app/thread/[threadId]/page.tsx` (server component) that looks up a thread by ID from a new `THREAD_SEED` export, then passes a typed `ThreadData` object to a `ThreadPageClient` component (`'use client'`) which owns the quick-reply toggle state and renders all sub-components.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React 19 | 19.0.0 | Component rendering | Project baseline |
| Next.js | 15.1.6 | App Router dynamic routes (`[threadId]`) | Project baseline |
| TypeScript | 5.x | Type safety for seed interfaces | Project baseline |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS Modules | built-in | Scoped styles per component | Every new component |
| identity-obj-proxy | dev | CSS Module mocking in Jest | Already wired in jest.config.js |
| @testing-library/react | 14.1.2 | Component tests | All new interactive components |

### No New Packages Needed
This phase introduces zero new npm dependencies. All required icons (`message.svg`, `reply-message.svg`, `star-1.svg` through `star-5.svg`) already exist in `public/icons/`. The `Table` component, layout shell, and CSS tokens are already in place.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   └── thread/
│       └── [threadId]/
│           └── page.tsx          # Server component — looks up THREAD_SEED by ID
├── components/
│   └── thread/
│       ├── ThreadPageClient.tsx  # 'use client' — owns quick-reply toggle state
│       ├── ThreadBreadcrumb.tsx  # #3293CD bar: Forums > Section > Thread #N
│       ├── OriginalPostBlock.tsx # Author info + post content + action buttons
│       ├── ReplyTree.tsx         # 4-column table with indented rows
│       ├── ReplyRow.tsx          # Single reply row (icon + indentation + link)
│       ├── QuickReplyForm.tsx    # Hidden textarea, toggled by ThreadPageClient
│       ├── ActionButtons.tsx     # Edit/Up/Reply/ViewAll/BackToForum links
│       └── index.ts              # Barrel export
├── data/
│   └── thread-seed.ts            # ThreadData, ThreadPost, ReplyTreeItem interfaces + THREAD_SEED
└── __tests__/
    ├── ThreadBreadcrumb.test.tsx
    ├── OriginalPostBlock.test.tsx
    ├── ReplyTree.test.tsx
    └── QuickReplyForm.test.tsx
```

### Pattern 1: Server Component Route + Client Wrapper

Identical to the Phase 3 pattern (`ForumPage` → `ForumThreadTable`). The page.tsx is a server component; the client boundary wraps only what needs interactivity.

```typescript
// src/app/thread/[threadId]/page.tsx
interface Props {
  params: Promise<{ threadId: string }>;
}

export default async function ThreadPage({ params }: Props) {
  const { threadId } = await params;
  const thread = THREAD_SEED.find((t) => String(t.id) === threadId);
  // Handle not found with 404 or fallback to first thread
  return (
    <div style={{ backgroundColor: "var(--rotter-body-forum)" }}>
      <center>
        <HeaderBar />
        <BlueNavBar />
        <OrangeNavBar />
        <ThreadPageClient thread={thread ?? THREAD_SEED[0]!} />
      </center>
    </div>
  );
}
```

### Pattern 2: Reply Tree Indentation (VERIFIED from thread_page.html)

The raw HTML uses `&nbsp;` characters for indentation. The verified formula from counting the actual HTML:

| depth | nbsp count | icon |
|-------|-----------|------|
| 1 | 2 | message.svg |
| 2 | 4 | reply-message.svg |
| 3 | 8 | reply-message.svg |
| 4 | 12 | reply-message.svg |
| 5 | 16 | reply-message.svg |
| 6 | 20 | reply-message.svg |

Formula: `depth === 1 ? 2 : (depth - 1) * 4` nbsp chars before the icon.

In React/CSS, this translates to `paddingLeft: depth === 1 ? "0.5em" : \`${(depth - 1) * 1}em\`` or a `data-depth` attribute with CSS. The recommended approach: keep the nbsp approach directly (matching Rotter faithfully) by rendering `'\u00a0'.repeat(nbspCount)` before the icon image inside the `<td>`.

```typescript
// ReplyRow.tsx
const nbspCount = item.depth === 1 ? 2 : (item.depth - 1) * 4;
const iconSrc = item.depth === 1 ? "/icons/message.svg" : "/icons/reply-message.svg";

return (
  <tr style={{ backgroundColor: isEven ? "var(--rotter-row-even)" : "var(--rotter-row-odd)" }}>
    <td align="right" width="100%" nowrap>
      {"\u00a0".repeat(nbspCount)}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={iconSrc} alt="" width={16} height={16} />
      {" "}
      <a href={`#${item.replyNumber}`} style={{ color: "var(--rotter-text-primary)", fontSize: "var(--rotter-size-thread-title)" }}>
        {item.title}
      </a>
    </td>
    <td align="center" nowrap>
      <span style={{ fontSize: "var(--rotter-size-sm)", color: "var(--rotter-text-primary)" }}>
        {item.author}
      </span>
    </td>
    <td align="center" nowrap>
      <span style={{ fontSize: "var(--rotter-size-sm)", color: "var(--rotter-text-primary)" }}>
        {item.date}{" "}
      </span>
      <span style={{ fontSize: "var(--rotter-size-sm)", color: "var(--rotter-text-time)" }}>
        {item.time}
      </span>
    </td>
    <td align="center" nowrap>
      <span style={{ fontSize: "var(--rotter-size-sm)", color: "var(--rotter-text-primary)" }}>
        {item.replyNumber}
      </span>
    </td>
  </tr>
);
```

### Pattern 3: Original Post Block (VERIFIED from thread_page.html lines 521-569)

The post block is a 3-layer nested table structure:

```
<table bgcolor="#000000" cellspacing="0" cellpadding="0">   ← 1px black border
  <td>
    <table bgcolor="#000000" cellpadding="1" cellspacing="0"> ← inner border
      <td>
        <table cellpadding="3" cellspacing="0">             ← content table
          <TR bgcolor="#eeeeee">  ← author info (rowspan="2")
          <TR bgcolor="#eeeeee">  ← action icons (send, profile, buddy)
          <TR bgcolor="#FDFDFD">  ← h1 title + 70%-width content table
          <TR bgcolor="#eeeeee">  ← action buttons bar
```

The star rating uses existing `star-1.svg` through `star-5.svg` based on the `starRating` (1-5) field.

### Pattern 4: Quick Reply Toggle

```typescript
// ThreadPageClient.tsx
const [quickReplyOpen, setQuickReplyOpen] = useState(false);

// Pass to ActionButtons:
<ActionButtons onReplyClick={() => setQuickReplyOpen((v) => !v)} />

// Render form conditionally:
{quickReplyOpen && <QuickReplyForm />}
```

### Pattern 5: Breadcrumb Bar (VERIFIED from thread_page.html lines 483-500)

```
<TR bgcolor="#3293CD">
  <th align="right">
    <a href="/">Forums</a>
    <img src="/icons/dir-arrow.svg" />
    <a href="/forum/scoops1">Scoops</a>
    <img src="/icons/dir-arrow.svg" />
    Thread #940099
  </th>
</TR>
```

The `dir-arrow.svg` already exists at `public/icons/dir-arrow.svg`. Colors: white text (`var(--rotter-text-header)`) on `var(--rotter-subheader-blue)` background.

### Pattern 6: Seed Data Structure

Extend the existing pattern in `src/data/forum-seed.ts`:

```typescript
// src/data/thread-seed.ts

export interface ThreadPost {
  id: number;
  author: string;
  content: string;
  date: string;        // "DD.MM.YY"
  time: string;        // "HH:MM"
  memberSince: string; // "D.M.YY"
  postCount: number;
  starRating: number;  // 1-5
  ratersCount: number;
  points: number;
}

export interface ReplyTreeItem {
  id: number;
  replyNumber: number;
  title: string;
  author: string;
  date: string;        // "DD.MM.YY"
  time: string;        // "HH:MM"
  depth: number;       // 1 = top-level, 2+ = nested
}

export interface ThreadData {
  id: number;
  forumId: string;     // e.g. "scoops1"
  sectionName: string; // e.g. "Scoops"
  post: ThreadPost;
  replies: ReplyTreeItem[];
}

export const THREAD_SEED: ThreadData[] = [...];
```

The scraped file `data/threads/threads_with_comments_2026-03-22.json` contains 6 threads. Thread `scoops1_940165` has 36 posts and 6 levels of depth — it is the ideal source for the seed. The `reply_to` field in each post gives the parent post number, which must be recursively traversed to compute `depth`.

### Anti-Patterns to Avoid

- **Bare `<table>` without Table component:** The project enforces the `Table` component. Use it for all table wrappers (the nested 70%-width content table included).
- **Hardcoded hex colors:** Use `var(--rotter-row-even)` not `"#eeeeee"`, `var(--rotter-row-odd)` not `"#FDFDFD"`, `var(--rotter-subheader-blue)` not `"#3293CD"`.
- **`bgColor` prop (uppercase C):** TypeScript strict mode rejects `bgColor` on HTMLTableElement. Use `style={{ backgroundColor: ... }}` (established in Phase 2 decision log).
- **`<font>` elements in JSX:** TypeScript strict mode rejects legacy HTML. Replace with styled `<span>` (Phase 3 decision log).
- **Importing forum barrel in thread components:** Sibling imports must be direct to avoid circular dependency (Phase 2/3 decision log).
- **`'use client'` on page.tsx:** Keep the route as a server component. The `'use client'` boundary belongs on `ThreadPageClient` only.
- **Next.js 15 params:** Must `await params` — `params` is `Promise<{ threadId: string }>` not a plain object (Phase 3 decision log).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Reply tree depth calculation | Custom recursive renderer | Flat array with pre-computed `depth` field | Recursive rendering in React creates prop-drilling and complex key management; flat array is testable |
| Star rating display | Custom star logic | `starRating` field (1-5) → `/icons/star-{N}.svg` | Icons already exist; simple `src` string interpolation |
| CSS class merging | Custom merge logic | Direct `style={}` prop (consistent with ThreadRow pattern) | Phase 3 uses inline styles for dynamic colors — keep consistent |
| `<Table>` wrapper | Bare `<table>` | `Table` component from `@/components/ui/Table` | Enforces explicit `<tbody>`, provides lint target |
| Indentation spacing | `paddingLeft` CSS | Unicode nbsp (`\u00a0`) repeated N times | Faithfully matches Rotter's HTML structure |

**Key insight:** The reply tree is inherently flat in the original Rotter HTML — every reply is a `<tr>` with indentation encoded as nbsp characters, not as nested `<ul>/<li>`. The data model should store pre-computed `depth` not parent-child references, making rendering a simple `.map()` with no recursion.

---

## Common Pitfalls

### Pitfall 1: Computing depth at render time
**What goes wrong:** Storing `reply_to` in the seed and computing depth recursively in the component causes O(n²) lookups and complex component logic.
**Why it happens:** The scraped JSON uses `reply_to` references. It's tempting to pass that structure directly.
**How to avoid:** Pre-compute `depth` at seed-definition time. Write a `buildDepthMap(posts)` helper in the seed file that resolves the full depth for each post before the seed constant is exported.
**Warning signs:** A `ReplyTree` component that takes `reply_to` instead of `depth` as a prop.

### Pitfall 2: bgcolor attribute vs style prop
**What goes wrong:** `<tr bgcolor="#eeeeee">` works in HTML but TypeScript strict mode may warn; more importantly, it bypasses CSS token usage.
**Why it happens:** Direct copy from original HTML.
**How to avoid:** Use `style={{ backgroundColor: "var(--rotter-row-even)" }}` consistently. Established in Phase 2 decision: "Table bgcolor must be lowercase in JSX — TypeScript strict mode rejects bgColor on HTMLTableElement."
**Warning signs:** Any `bgColor=` or `BGCOLOR=` in JSX.

### Pitfall 3: Client component leaks to page.tsx
**What goes wrong:** Adding `'use client'` to the route page to support toggle state causes the entire page to become a client component, breaking Next.js server rendering.
**Why it happens:** Quick reply form needs `useState`.
**How to avoid:** Client boundary must be `ThreadPageClient` only. The route page.tsx passes `ThreadData` as a prop and stays a server component.
**Warning signs:** `'use client'` at top of `page.tsx`.

### Pitfall 4: Missing `<tbody>` in nested tables
**What goes wrong:** React 19 hydration mismatch when browsers auto-insert `<tbody>`.
**Why it happens:** The post content area uses multiple nested tables; it's easy to miss `<tbody>` in inner tables.
**How to avoid:** Every `<Table>` usage must have explicit `<tbody>`. The `Table` component does NOT auto-wrap — callers must include `<tbody>` explicitly (Phase 1 decision log).
**Warning signs:** Hydration error in browser console mentioning `<tbody>`.

### Pitfall 5: ForumThread URL still pointing to /forum/scoops1/[id]
**What goes wrong:** Clicking a thread row in Phase 3's `ForumThreadTable` navigates to `/forum/scoops1/940099`, but the new thread page lives at `/thread/940099`.
**Why it happens:** The `url` field in `FORUM_SEED` was set as `/forum/scoops1/${id}` in Phase 3.
**How to avoid:** When the thread route is `/thread/[threadId]`, update `FORUM_SEED` URL generation in `forum-seed.ts` to use `/thread/${id}`. Alternatively keep the forum route and add a redirect. Clarify before implementing.
**Warning signs:** 404 when clicking thread links from the forum listing page.

### Pitfall 6: Star rating SVG path
**What goes wrong:** Using `star-3.gif` (original Rotter) instead of the project's `star-3.svg`.
**Why it happens:** Copying paths from `thread_page.html` directly.
**How to avoid:** All icons are at `/icons/star-{N}.svg` (1-5). Confirmed by `ls public/icons/`.
**Warning signs:** Broken image in author block.

---

## Code Examples

Verified patterns from official project sources:

### Breadcrumb bar pattern (from thread_page.html lines 483-500)
```typescript
// Source: data/design/thread_page.html line 483
// ThreadBreadcrumb.tsx
export function ThreadBreadcrumb({ forumId, sectionName, threadId }: BreadcrumbProps) {
  return (
    <Table width="100%" border={0} cellSpacing={0} cellPadding={0} style={{ backgroundColor: "#000000" }}>
      <tbody>
        <tr>
          <td>
            <Table width="100%" border={0} cellSpacing={0} cellPadding={3}>
              <tbody>
                <tr style={{ backgroundColor: "var(--rotter-subheader-blue)" }}>
                  <th align="right" valign="bottom">
                    <a href="/" style={{ color: "var(--rotter-text-header)", fontFamily: "var(--rotter-font-primary)", fontSize: "var(--rotter-size-sm)" }}>
                      Forums
                    </a>
                    {" "}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/icons/dir-arrow.svg" alt=">" width={8} height={8} />
                    {" "}
                    <a href={`/forum/${forumId}`} style={{ color: "var(--rotter-text-header)", fontFamily: "var(--rotter-font-primary)", fontSize: "var(--rotter-size-sm)" }}>
                      {sectionName}
                    </a>
                    {" "}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/icons/dir-arrow.svg" alt=">" width={8} height={8} />
                    {" "}
                    <span style={{ color: "var(--rotter-text-header)", fontFamily: "var(--rotter-font-primary)", fontSize: "var(--rotter-size-sm)" }}>
                      Thread #{threadId}
                    </span>
                  </th>
                </tr>
              </tbody>
            </Table>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
```

### Author info row (from thread_page.html lines 524-538)
```typescript
// Source: data/design/thread_page.html line 524
// The author info row uses rowspan="2" to span the action-icons row below
<TR style={{ backgroundColor: "var(--rotter-row-even)" }}>
  <td align="right" valign="top" width="50%" rowSpan={2}>
    <span style={{ fontSize: "var(--rotter-size-sm)", color: "var(--rotter-text-primary)", fontFamily: "var(--rotter-font-primary)" }}>
      <b>{post.author}</b>
    </span>
    {" "}
    {/* Star rating: /icons/star-{N}.svg where N = post.starRating */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={`/icons/star-${post.starRating}.svg`} alt={`${post.starRating} stars`} border={0} />
    <br />
    <span style={{ fontSize: "var(--rotter-size-xs)" }}>Member since {post.memberSince}</span>
    <br />
    <span style={{ fontSize: "var(--rotter-size-xs)" }}>{post.postCount} posts</span>
    {", "}
    <span style={{ fontSize: "var(--rotter-size-xs)", color: "var(--rotter-green-rating)" }}>
      <b>{post.ratersCount} raters</b>
    </span>
    {", "}
    <span style={{ color: "var(--rotter-text-time)", fontSize: "var(--rotter-size-xs)" }}>
      <b>{post.points} points</b>
    </span>
  </td>
  <td align="left" valign="top" width="50%" nowrap>
    {/* date + time */}
    <span style={{ fontSize: "var(--rotter-size-xs)", color: "var(--rotter-text-primary)" }}>
      {post.date}
    </span>
    {" "}
    <span style={{ color: "var(--rotter-text-time)", fontSize: "var(--rotter-size-xs)" }}>
      {post.time}
    </span>
  </td>
</TR>
```

### Post content area (from thread_page.html lines 540-554)
```typescript
// Source: data/design/thread_page.html line 540
<tr style={{ backgroundColor: "var(--rotter-row-odd)" }}>
  <td colSpan={2} width="100%">
    <h1 className={styles.text16b} style={{ margin: "0px", paddingRight: "10px" }}>
      {thread.post.title}
    </h1>
    <br />
    <Table border={0} cellPadding={5} cellSpacing={0} width="70%" style={{ display: "inline-table" }}>
      <tbody>
        <tr>
          <td valign="top" width={50} nowrap>&nbsp;&nbsp;</td>
          <td valign="top" width="100%">
            <span style={{ fontSize: "var(--rotter-size-sm)", color: "var(--rotter-text-primary)", fontFamily: "var(--rotter-font-primary)" }}>
              {thread.post.content}
            </span>
          </td>
        </tr>
      </tbody>
    </Table>
  </td>
</tr>
```

### Test factory pattern (from existing ForumThreadTable.test.tsx)
```typescript
// Source: src/__tests__/ForumThreadTable.test.tsx — makeThread() factory
function makeReplyItem(overrides: Partial<ReplyTreeItem> & { id: number }): ReplyTreeItem {
  return {
    replyNumber: overrides.id,
    title: `Reply ${overrides.id}`,
    author: "TestUser",
    date: "22.03.26",
    time: "12:00",
    depth: 1,
    ...overrides,
  };
}
```

### Depth computation helper for seed building
```typescript
// For use in thread-seed.ts to pre-compute depth from reply_to chains
function buildDepthMap(posts: Array<{ post_number: number; reply_to?: number }>): Map<number, number> {
  const depths = new Map<number, number>();
  for (const post of posts) {
    if (post.reply_to === undefined || post.reply_to === null) {
      depths.set(post.post_number, 0); // original post = depth 0
    }
  }
  // BFS to compute all depths
  let changed = true;
  while (changed) {
    changed = false;
    for (const post of posts) {
      if (!depths.has(post.post_number) && post.reply_to !== undefined) {
        const parentDepth = depths.get(post.reply_to);
        if (parentDepth !== undefined) {
          depths.set(post.post_number, parentDepth + 1);
          changed = true;
        }
      }
    }
  }
  return depths;
}
// depth 0 = original post, depth 1 = top-level reply, depth 2+ = nested
// In ReplyTreeItem.depth: use (computedDepth) directly; icon = depth===1 ? "message" : "reply-message"
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Direct `bgColor` attr on `<table>` | `style={{ backgroundColor }}` with CSS tokens | Phase 2 | TypeScript strict compliance |
| `<font>` elements | Styled `<span>` elements | Phase 3 | TypeScript strict compliance |
| `params.forumId` (sync) | `await params` (Promise) | Phase 3 / Next.js 15 | Required for async server components |

---

## Open Questions

1. **Thread route path: `/thread/[threadId]` vs `/forum/[forumId]/[threadId]`**
   - What we know: CONTEXT.md specifies `src/app/thread/[threadId]/page.tsx` as the integration point. The existing `ForumThread.url` in forum-seed uses `/forum/scoops1/${id}`.
   - What's unclear: Whether to update `FORUM_SEED` URLs to point to `/thread/[id]` during this phase, or keep them as `/forum/scoops1/[id]` and add a route redirect.
   - Recommendation: Update `FORUM_SEED` `url` field template from `/forum/scoops1/${id}` to `/thread/${id}` in this phase, since Phase 3 is complete and the thread page is the intended destination. The planner should create an explicit task for this URL update.

2. **Action button icons: SVGs vs text links**
   - What we know: Original uses `edit.gif`, `up.gif`, `response.gif`, `all.gif`, `gobk.gif`. CONTEXT.md says "styled as text links matching Rotter's button bar."
   - What's unclear: Whether to use existing `public/icons/` SVGs or render text-only links.
   - Recommendation: Check if `toolbar-*.svg` icons cover these. If not, use text links (ASCII labels: "Edit", "Up", "Reply", "View All", "Back") styled with `font-size: var(--rotter-size-xs)` and `color: var(--rotter-text-primary)`. The CONTEXT.md says "text links" so do not add new SVGs.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest 29.7.0 + @testing-library/react 14.1.2 |
| Config file | `jest.config.js` (root) |
| Quick run command | `npx jest --testPathPattern="Thread" --no-coverage` |
| Full suite command | `npx jest --no-coverage` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| THRD-01 | Author block renders username, stars, memberSince, postCount, raters, points | unit | `npx jest --testPathPattern="OriginalPostBlock" --no-coverage` | ❌ Wave 0 |
| THRD-02 | Post content renders h1 title and 70%-width table | unit | `npx jest --testPathPattern="OriginalPostBlock" --no-coverage` | ❌ Wave 0 |
| THRD-03 | Action buttons row renders all 5 links | unit | `npx jest --testPathPattern="ActionButtons" --no-coverage` | ❌ Wave 0 |
| THRD-04 | Reply tree renders 4-column header row | unit | `npx jest --testPathPattern="ReplyTree" --no-coverage` | ❌ Wave 0 |
| THRD-05 | Top-level reply uses message.svg; nested uses reply-message.svg; depth 3 gets 8 nbsp | unit | `npx jest --testPathPattern="ReplyTree" --no-coverage` | ❌ Wave 0 |
| THRD-06 | Row 0 has rotter-row-even bg, row 1 has rotter-row-odd bg | unit | `npx jest --testPathPattern="ReplyTree" --no-coverage` | ❌ Wave 0 |
| THRD-07 | Quick reply form hidden by default; visible after Reply click | unit | `npx jest --testPathPattern="QuickReplyForm\|ThreadPageClient" --no-coverage` | ❌ Wave 0 |
| THRD-08 | Breadcrumb renders Forums link, section link, and Thread #N text | unit | `npx jest --testPathPattern="ThreadBreadcrumb" --no-coverage` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx jest --testPathPattern="Thread" --no-coverage`
- **Per wave merge:** `npx jest --no-coverage`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/ThreadBreadcrumb.test.tsx` — covers THRD-08
- [ ] `src/__tests__/OriginalPostBlock.test.tsx` — covers THRD-01, THRD-02
- [ ] `src/__tests__/ActionButtons.test.tsx` — covers THRD-03
- [ ] `src/__tests__/ReplyTree.test.tsx` — covers THRD-04, THRD-05, THRD-06
- [ ] `src/__tests__/QuickReplyForm.test.tsx` — covers THRD-07

No new framework or config needed — existing `jest.config.js` and `identity-obj-proxy` are already wired.

---

## Sources

### Primary (HIGH confidence)
- `data/design/thread_page.html` — verified exact HTML structure for author block, content area, breadcrumb, reply tree, action buttons
- `data/design/DESIGN_SPECIFICATION.md §4` — Thread Page section with structure summary and class reference
- `src/app/globals.css` — confirmed all token names used in examples (`--rotter-subheader-blue`, `--rotter-row-even`, etc.)
- `src/data/forum-seed.ts` — confirmed `ForumThread` interface fields and seed pattern to extend
- `src/components/forum/ThreadRow.tsx` — confirmed style patterns (inline styles, icon path convention, isEven alternation)
- `src/app/forum/[forumId]/page.tsx` — confirmed Next.js 15 async params pattern and server/client split
- `data/threads/threads_with_comments_2026-03-22.json` — confirmed `reply_to` field structure and 6-level max depth across 6 threads

### Secondary (MEDIUM confidence)
- `.planning/STATE.md` Decisions section — confirmed TypeScript strict mode restrictions (`bgColor`, `<font>`, circular imports)
- `jest.config.js` — confirmed test framework, module mapper, and test pattern conventions

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies, all existing project tooling
- Architecture: HIGH — verified against actual HTML source and established project patterns
- Pitfalls: HIGH — most pitfalls are documented in STATE.md Decisions from prior phases

**Research date:** 2026-03-22
**Valid until:** 2026-04-22 (stable — no external library versions change)
