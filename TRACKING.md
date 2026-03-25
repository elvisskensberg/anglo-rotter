# Rotter.net Content Tracking

## Quick Status

| Metric | Value |
|--------|-------|
| **Last scrape** | 2026-03-22 18:45 IST |
| **Highest thread ID** | 940,171 |
| **Threads indexed** | 75 |
| **Threads with full comments** | 5 (120 comments total) |
| **Forums covered** | scoops1, politics, enews |

## Data Structure

```
MultiRotter/
  Rotter.md                          # Platform research report
  TRACKING.md                        # This file - tracking overview
  SCRAPE_LOG.json                    # Scrape history & config (machine-readable)
  scripts/
    extract_threads.py               # Reusable thread scraper (Python)
  data/
    snapshots/                       # Forum listings per date
      scoops1_2026-03-22.json        # 40 threads with titles (HE+EN), authors, categories
      politics_2026-03-22.json       # 15 threads with titles (HE+EN), authors, categories
      enews_2026-03-22.json          # 19 English headlines from JPost/ToI/Arutz7/Algemeiner
    threads/                         # Full thread content with comments
      threads_with_comments_2026-03-22.json  # 5 threads, 120 posts with full metadata
```

## Comment Data Available

Yes -- we have full user comments/posts. Each comment includes:

| Field | Example |
|-------|---------|
| **post_number** | 0 (OP), 1, 2, ... |
| **author** | "mortzix", "Sidewinder", "barry white" |
| **member_since** | "27.9.07" |
| **author_post_count** | "9649" |
| **raters / rating_points** | "114 / 194" |
| **hebrew_date** | "יום ראשון ד' בניסן תשפ''ו" |
| **time + date** | "18:32 22.03.26" |
| **reply_to** | post number being replied to (flat threading) |
| **content** | Full Hebrew text of the post |
| **external_links** | URLs to Twitter/X, news sites, etc. |
| **images** | User-uploaded images at rotter.net/User_files/forum/ |

## Threads with Comments (2026-03-22)

| Thread ID | Title | Posts | Views |
|-----------|-------|-------|-------|
| 940165 | Supreme Court refuses to broadcast aid org hearing | 36 | - |
| 940171 | Red Alert: Shlomi, Mateh Asher | 1 | - |
| 940137 | Ultra-Orthodox blocking light rail in Jerusalem | 27 | - |
| 940099 | Casualty update from Arad | 42 | 21,436 |
| 940128 | Updating thread on strikes in Iran | 13 | 10,905 |

## Scrape Notes

### Access Method
- **WebFetch**: BLOCKED (403 Forbidden) -- Cloudflare + robots.txt blocks ClaudeBot
- **curl + browser UA**: WORKS on all pages
- **Script**: `scripts/extract_threads.py` handles fetching + parsing

### URL Patterns
- Forum listing: `/cgi-bin/forum/dcboard.cgi?az=list&forum={name}`
- Thread (static): `/forum/{forum}/{thread_id}.shtml`
- Thread (CGI, redirects to static): `/cgi-bin/forum/dcboard.cgi?az=read_count&om={id}&forum={name}`
- Mobile: `/mobile/viewmobile.php?forum={forum}&thread={id}`
- Pagination: append `&mm={page}&archive=` (up to 100 pages)
- English news: `/enews/news.php`
- News flashes: `/news/news.php?nws=1`

### Encoding
- Windows-1255 (Hebrew) -- convert with `iconv -f windows-1255 -t utf-8`

## How to Update

1. Run `python scripts/extract_threads.py` to re-scrape threads
2. Add new snapshot files dated `{forum}_{YYYY-MM-DD}.json`
3. Update `SCRAPE_LOG.json` with new entry
4. Update this tracking table

## Content Categories Used

| Category | Description |
|----------|-------------|
| `security_alert` | Red alerts, siren warnings, UAV infiltrations |
| `military` | IDF operations, combat reports, casualties |
| `politics` | Israeli domestic politics |
| `international` | Foreign affairs, diplomacy |
| `security` | General security news |
| `domestic` | Israeli social/domestic news |
| `legal` | Court cases, legal matters |
| `media` | Media criticism, journalism |
| `tech` | Technology news |
| `culture` | Cultural items |
| `meta` | Forum rules/announcements |

## Available Forums (Not Yet Scraped)

| Forum ID | Name | Status |
|----------|------|--------|
| `hazaaka` | The Outcry | Not scraped |
| `media` | Media Criticism | Not scraped |
| `modiin` | Intelligence | Not scraped |
| `foreignpress` | Foreign Press | Not scraped |
| `law` | Law | Not scraped |
| `documents` | Documents | Not scraped |
| `coffee` | The Cafe | Not scraped |
| `betmidrash` | Torah | Not scraped |
