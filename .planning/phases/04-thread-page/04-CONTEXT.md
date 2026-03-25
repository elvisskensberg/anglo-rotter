# Phase 4: Thread Page - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the thread detail page showing the original post with author info and star rating, a hierarchically indented reply tree, action buttons, quick reply form (hidden by default), and breadcrumb navigation — all using hardcoded seed data within the Phase 1 layout shell.

</domain>

<decisions>
## Implementation Decisions

### Original Post Block
- Author info row on #eeeeee background: username, star rating (using star-1 through star-5 SVGs), member since date, post count, raters/points
- Post content area on #FDFDFD background with 16px bold h1 title
- Content in a 70%-width nested table (matching Rotter's structure)
- All using `var(--rotter-*)` tokens, no hardcoded hex

### Reply Tree
- 4-column table: thread title, author, date, reply number
- Nested indentation: 4 spaces (or equivalent padding) per nesting level
- message.svg icon for top-level replies, reply-message.svg for nested replies
- Alternating row colors: #eeeeee / #FDFDFD

### Action Buttons
- Row below post content: edit, up, reply, view all, back to forum
- Styled as text links matching Rotter's button bar

### Quick Reply Form
- Hidden by default, toggled visible by "Reply" button click
- Simple textarea + submit button
- No actual submission (Phase 9 adds auth + real posting)

### Breadcrumb Navigation
- #3293CD blue background bar
- Format: "Forums > {Section Name} > Thread #{id}"
- Each segment is a navigable link (Forums → homepage, Section → forum listing)

### Seed Data
- Extend ForumThread with full post content and reply tree
- ThreadPost interface: id, author, content, date, memberSince, postCount, starRating, ratersCount, points
- ReplyTreeItem interface: id, title, author, date, replyNumber, depth, icon (message/reply-message)
- Minimum 1 seed thread with 15+ replies at 3+ depth levels

### Claude's Discretion
- Component decomposition (OriginalPostBlock, ReplyTree, ReplyRow, QuickReplyForm, ThreadBreadcrumb, ActionButtons)
- CSS Module naming
- Reply tree depth limit (recommend 5 levels max for readability)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/layout/` — HeaderBar, BlueNavBar, OrangeNavBar
- `src/components/ui/Table.tsx` — base table with mandatory tbody
- `src/components/forum/` — ThreadRow, ForumToolbar, PaginationBar, ForumThreadTable patterns
- `public/icons/` — message.svg, reply-message.svg, star-1 through star-5.svg
- `src/data/forum-seed.ts` — ForumThread interface, FORUM_SEED array
- `data/design/thread_page.html` — raw Rotter thread HTML source
- `data/threads/` — scraped thread data with full comments

### Established Patterns
- CSS Modules with `var(--rotter-*)` tokens
- Table-based layouts with explicit `<tbody>`
- `'use client'` for interactive components
- Seed data in `src/data/` as typed TypeScript
- TDD: write failing tests then implement

### Integration Points
- New route: `src/app/thread/[threadId]/page.tsx`
- Links from ForumThreadTable ThreadRow should point to thread routes
- Breadcrumb links back to forum listing route

</code_context>

<specifics>
## Specific Ideas

- Reference `data/design/thread_page.html` for exact post block and reply tree structure
- Reference `data/threads/` for real reply tree data to translate into seed
- Star rating uses 5 separate SVGs (star-1.svg = 1 filled, star-5.svg = 5 filled)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
