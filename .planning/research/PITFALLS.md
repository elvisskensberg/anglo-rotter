# Domain Pitfalls: MultiRotter

**Domain:** Retro UI replication + forum PWA with scraped content
**Researched:** 2026-03-22
**Overall confidence:** HIGH (pitfalls verified from multiple sources and direct project analysis)

---

## Critical Pitfalls

These mistakes cause rewrites, data loss, or fundamental blockers.

---

### Pitfall 1: HTML Table Elements Triggering React Hydration Failures

**What goes wrong:** Using `<table>`, `<tr>`, `<td>` in React components without explicit `<tbody>` tags causes hydration mismatches. Browsers auto-insert `<tbody>` during HTML parsing, so the server-rendered DOM differs from what React expects, triggering "Hydration failed" errors and full client-side re-renders.

**Why it happens:** The HTML spec requires `<tbody>` as an implicit element between `<table>` and `<tr>`. React outputs the markup without it; the browser inserts one; React's reconciler finds a mismatch and discards the entire server-rendered subtree.

**Consequences:** Every thread table re-renders on the client, eliminating SSR benefits, causing visible flash on page load, and potentially breaking row alternating colors if state initializes differently on client.

**Prevention:**
- Always include explicit `<tbody>` in every `<table>` component
- Also include explicit `<thead>` and `<tfoot>` where semantically appropriate
- Add a hydration test for each table component in Phase 1 before building further pages on top of them

**Detection:** React console error "Hydration failed because the initial UI does not match what was rendered on the server." Specifically mentions `<tbody>` being unexpected.

**Phase:** Phase 1 (Design System) — establish the table component pattern correctly before any forum pages are built.

---

### Pitfall 2: next-pwa Is Unmaintained — Wrong Package Choice Blocks App Router

**What goes wrong:** The `next-pwa` npm package (shadowwalker/next-pwa) is no longer maintained and does not work correctly with Next.js 15 App Router. Service workers fail to register, or register but do not control the page scope, particularly for dynamic routes.

**Why it happens:** next-pwa was built for the Pages Router era. The App Router changed how build manifests are generated and how routes are served, breaking assumptions next-pwa makes about file layout and service worker scope.

**Consequences:** PWA install prompt never appears. Offline mode is entirely non-functional. Push notifications cannot be wired up. The entire Phase 8 deliverable fails silently — the app loads fine in development but the service worker is missing in production.

**Prevention:**
- Use **Serwist** (`@serwist/next`) instead of `next-pwa`. Serwist is the maintained successor built explicitly for App Router.
- Alternatively, use Next.js's built-in PWA guide approach (custom `sw.js` registered via `layout.tsx` `useEffect`) for a zero-dependency approach.
- Do NOT use `next-pwa` at all.

**Detection:** Open DevTools > Application > Service Workers. If no service worker is listed, or it shows an error scope, the package is broken. Check this immediately after Phase 1 PWA wiring (Task 1.10).

**Phase:** Phase 1 (Task 1.10) — must choose and validate the correct PWA library before any other PWA work.

---

### Pitfall 3: Cloudflare Bot Detection Blocks the Scraper at Production Scale

**What goes wrong:** Rotter.net is protected by Cloudflare. Simple HTTP fetch with Node.js (even with realistic headers) is blocked immediately. Headless browser approaches using Puppeteer with `puppeteer-extra-plugin-stealth` are also broken — that stealth plugin was deprecated in February 2025 and no longer bypasses current Cloudflare detection.

**Why it happens:** Cloudflare now evaluates TLS fingerprints, JavaScript challenge completion, WebGL rendering presence, timezone consistency, and per-customer machine-learning models. Standard Node.js HTTP stacks have a distinctive TLS fingerprint that is immediately flagged.

**Consequences:** The entire content seeding strategy fails. Without real scraped data, all pages show empty tables. The scraper that already exists (`scripts/extract_threads.py`) may work in development (single session, low rate) but will be blocked under any production-like usage pattern.

**Prevention:**
- Treat scraping as a one-time data extraction tool, not a live pipeline. Run the Python scraper manually and infrequently, storing results in `data/snapshots/`. Do not attempt to automate scraping on a schedule.
- For the Python scraper: use `curl-cffi` (which impersonates a real browser's TLS fingerprint) rather than `requests`.
- Rate-limit aggressively: minimum 5–10 second delays between requests, randomized.
- Use a residential proxy for any bulk extraction to avoid IP bans.
- The long-term architecture should be user-generated content (Phase 9), not continuous scraping.

**Detection:** HTTP 403 with Cloudflare challenge page body, or HTTP 429. Check `scripts/extract_threads.py` output — if it returns HTML containing `cf-challenge-running`, Cloudflare is blocking.

**Phase:** Phase 7 (Data Layer) — validate scraper reliability before depending on it for content seeding.

---

### Pitfall 4: Windows-1255 Encoding Corruption Entering the Database

**What goes wrong:** Rotter.net serves pages encoded in Windows-1255 (Hebrew). Node.js `fetch()` and `fs.readFile()` default to assuming UTF-8. If encoding is not declared when reading the HTTP response, Hebrew characters become mojibake (`ãàøä` instead of `דארה`) and this garbage data is written to the database.

**Why it happens:** Node.js's `TextDecoder` supports Windows-1255 (it is part of the Encoding Standard), but you must explicitly declare it. The `response.text()` method in `fetch` uses the charset from the Content-Type header — if the server sends `charset=windows-1255` and you call `.text()` directly, Node.js should handle it correctly. But if you read raw buffers and convert manually without specifying the encoding, corruption occurs.

**Consequences:** Translated thread titles and content arrive corrupted. Even after translation to English, metadata fields (original usernames, timestamps embedded in strings) may contain garbage bytes that break JSON serialization or database storage.

**Prevention:**
- In Node.js: `new TextDecoder('windows-1255').decode(buffer)` for any raw buffer from Rotter responses.
- Use `iconv-lite` as a fallback: `iconv.decode(buffer, 'win1255')`.
- Add a validation step in the scraper that checks decoded output contains only valid UTF-8 before writing to any file or DB.
- Store all data in the database with UTF-8 collation from day one — never store Windows-1255 bytes in the DB.

**Detection:** Run `Buffer.from(text).toString('utf8')` on a decoded string that should contain Hebrew text. If it contains `?` or replacement characters, encoding is wrong. For English-only output: check that no `\uFFFD` (replacement character) appears in translated text.

**Phase:** Phase 7 (Data Layer) — encoding must be validated in the scraper before any data seeding.

---

### Pitfall 5: Local SQLite File Silently Wiped on Every Vercel Deploy

**What goes wrong:** If the project uses a local SQLite `.db` file (e.g., via better-sqlite3 pointed at a filesystem path), all data is destroyed on every Vercel deployment because Vercel's ephemeral container filesystem is wiped on each deploy.

**Why it happens:** Vercel Functions run in ephemeral containers. The `/tmp` directory has limited size (512MB) and does not persist between deployments. A `.db` file written to the project directory or `/tmp` during development works locally but vanishes in production between deploys.

**Consequences:** The forum loses all user posts, threads, and accounts on every deploy. This is a complete data loss scenario — completely silent, no error thrown, just an empty database after `vercel --prod`.

**Prevention:**
- Use **Turso** (libSQL remote) for all persistent data. Turso uses HTTP/WebSocket connections that work in serverless environments and data lives in the remote Turso database, not the container filesystem.
- Configure this from Phase 7 onwards — do not defer to "we'll switch to Turso before launch."
- Use Turso's Vercel integration for automatic environment variable injection.
- Keep JSON snapshot files (`data/snapshots/`) for read-only seed data, but never treat them as the source of truth for user-generated content.

**Detection:** Deploy to Vercel, create a test post, redeploy, and check if the post still exists. If it is gone, local SQLite is being used.

**Phase:** Phase 7 (Data Layer) — database architecture decision must be made before any user data is stored.

---

## Moderate Pitfalls

Mistakes that create significant rework but not full rewrites.

---

### Pitfall 6: LTR Mirror Is Not a Simple `transform: scaleX(-1)`

**What goes wrong:** Developers attempt to mirror an RTL layout to LTR by applying a CSS transform or a blanket `direction: ltr` override. This produces a layout where text, numbers, and icons are also mirrored or misaligned.

**Why it happens:** RTL-to-LTR mirroring is a semantic operation, not a visual one. Each physical property (`margin-left`, `padding-right`, `float: right`, `text-align: right`) must be individually mapped to its LTR equivalent. The 3-column homepage in Rotter has its sidebar on the right; the LTR version must have it on the left — this is not automatic.

**Consequences:** Navigation dropdowns open in the wrong direction. The scrolling ticker (left sidebar) overlaps the center column. Column header text aligns to the wrong edge. Thread icons appear on the wrong side of thread titles.

**Prevention:**
- Work from the design spec column-by-column, not the live site. The spec already documents the LTR-mirrored layout.
- Never use `direction: rtl` anywhere — this is an English LTR app.
- Do not use CSS logical properties (`margin-inline-start`) unless you are certain about the `dir` attribute inheritance chain.
- Treat left/right as explicit physical values everywhere, matching the spec literally.

**Detection:** Side-by-side screenshot comparison. Check the sidebar position (spec says left sidebar = 300px, center = 450px, right remainder). Check that nav dropdowns open downward-left from their trigger, not downward-right.

**Phase:** Phase 2 (Homepage) — catch this before building 6 more pages with the wrong mirroring.

---

### Pitfall 7: Service Worker Caches Stale Forum Data Indefinitely

**What goes wrong:** A cache-first strategy is applied to API responses (`/api/forums/`, `/api/threads/`, `/api/news`). The service worker serves the cached API response indefinitely, even as new threads are posted. Users see the same content on every visit until they manually clear the cache or the service worker is updated.

**Why it happens:** Cache-first is the correct strategy for static assets (JS bundles, CSS, SVGs) but wrong for dynamic data. When developers copy a single caching strategy for all routes, API responses get the same treatment as static files.

**Consequences:** Auto-refresh (`setInterval`) calls the API, but the service worker intercepts and returns the cached 200 response without hitting the network. Breaking news is not breaking. The forum appears frozen.

**Prevention:**
- In Serwist/Workbox configuration, set `NetworkFirst` or `StaleWhileRevalidate` for all `/api/` routes with a maximum cache age of 60 seconds.
- Set `CacheFirst` only for static assets: `/icons/`, `/_next/static/`, `.svg`, `.png`, `.css`, `.js`.
- The offline fallback for API routes should return the last cached response with a visible "offline — showing cached content" indicator, not silently serve stale data.

**Detection:** In DevTools > Network, set throttling to "Offline." Reload the page. If the forum shows content, check whether it is from the cache. Then go online and post a new thread from another session. Check if the first session's auto-refresh shows the new thread within 2 minutes.

**Phase:** Phase 8 (PWA & Mobile) — define the caching strategy matrix before implementing Workbox config.

---

### Pitfall 8: ISR and Static Export Are Mutually Exclusive

**What goes wrong:** The PWA_PLAN.md mentions "static generation where possible" in Phase 10. If the project is deployed as a static export (`next export` or `output: 'export'` in `next.config.js`), ISR (Incremental Static Regeneration) is completely disabled — pages are generated once at build time and never revalidated.

**Why it happens:** ISR requires a Next.js server runtime to handle revalidation requests. Static exports produce pure HTML/CSS/JS with no server, so there is nothing to process revalidation triggers.

**Consequences:** The forum listing page shows thread counts and last-reply times from the last build. Auto-refresh on the frontend fetches the API correctly, but SSR-generated page content is perpetually stale. Push notifications can arrive, but clicking them opens a page with old data.

**Prevention:**
- Do NOT use static export (`output: 'export'`). Use Vercel's default serverless deployment mode.
- Use `export const revalidate = 60` (or appropriate interval) at the page level for forum listing and news pages.
- For thread pages: use `revalidate = 300` (5 minutes) or on-demand revalidation via `revalidateTag` when new replies are posted.
- Reserve cache-first static generation only for user profile pages and historical thread archives.

**Detection:** Check `next.config.js` for `output: 'export'`. Run `next build` and observe whether `.html` files are generated in `/out/` — if so, static export is active and ISR is dead.

**Phase:** Phase 10 (Polish & Launch) — but the deployment architecture decision should be made in Phase 1.

---

### Pitfall 9: SVG Icons Render Crisper Than Original GIFs, Breaking Visual Fidelity

**What goes wrong:** SVG recreations of Rotter's 16x16 GIF thread icons (general, hot, fire, camera) are vector-smooth at all zoom levels. The original GIFs are pixelated raster art. At the actual 16x16 display size, the SVG rendering engine applies sub-pixel anti-aliasing that the original GIFs do not have, making the icons look subtly "cleaner" — which breaks the retro aesthetic.

**Why it happens:** SVG is a vector format. At 16x16 CSS pixels on a 2x HiDPI display, the browser renders at 32x32 physical pixels with anti-aliasing. The original GIFs were designed for 1x pixel-exact displays with no anti-aliasing.

**Consequences:** Side-by-side comparison fails the visual fidelity test. The icons look "modern" compared to the rest of the retro layout, creating a visual inconsistency that is noticeable in direct comparison.

**Prevention:**
- Use `image-rendering: pixelated` CSS on all thread icon `<img>` elements. This forces nearest-neighbor scaling, preserving the blocky pixel appearance.
- Alternatively, embed the actual GIF icons as data URIs for the 16x16 thread icons specifically (they are static, non-animated, and small).
- Test icons at both 1x and 2x device pixel ratios during Phase 1.

**Detection:** Open the MultiRotter thread table next to the Rotter.net thread table on a HiDPI screen. The MultiRotter icons will appear smoother. Apply `image-rendering: pixelated` and compare again.

**Phase:** Phase 1 (Task 1.4) — icon rendering approach must be decided before SVG recreation work begins.

---

### Pitfall 10: Scraping Rotter.net Creates Legal and IP Exposure

**What goes wrong:** Automating content extraction from Rotter.net and republishing it (even translated to English) may violate Israeli copyright law, Rotter's terms of service, and potentially the CFAA (Computer Fraud and Abuse Act) if Cloudflare blocks are interpreted as access restrictions.

**Why it happens:** User-generated forum content is copyrighted by the original authors. Rotter.net's terms of service almost certainly prohibit automated scraping. Publishing scraped content on a public site goes beyond personal research use.

**Consequences:** DMCA takedowns, ToS violation claims, potential legal action from Rotter Ltd. More practically: Cloudflare IP bans make the scraper permanently non-functional.

**Prevention:**
- Use scraped data only as seed data for a private development environment, not for a public deployment.
- For the public version: use entirely user-generated English content created by MultiRotter users — the platform replicates the UI and structure, not Rotter's data.
- Check `rotter.net/robots.txt` and document what is and is not allowed before any automated scraping.
- Do not publish the `data/snapshots/` directory or `data/threads/` contents in a public git repository.

**Detection:** Check Rotter.net's `robots.txt` at `https://rotter.net/robots.txt`. Check their Terms of Service page for scraping/reproduction prohibitions.

**Phase:** Phase 7 (Data Layer) — establish content policy before wiring any live scraping pipeline.

---

## Minor Pitfalls

Nuisances that cause debugging time but not major rework.

---

### Pitfall 11: Font Rendering Differs Between macOS, Windows, and Linux

**What goes wrong:** Arial at 15px on Windows uses GDI ClearType sub-pixel rendering. On macOS, the same font at the same size uses Quartz antialiasing. On Linux, freetype rendering is used. The result: thread titles look slightly different between developer machines and the target user population.

**Why it happens:** OS-level font rendering engines are fundamentally different and not configurable from CSS. `-webkit-font-smoothing: antialiased` on macOS makes text thinner; Windows ClearType makes it slightly bolder.

**Consequences:** The visual fidelity test passes on the developer's machine but fails on a Windows machine. Since Rotter.net's core audience is Israeli, who are more likely on Windows-based devices, this matters.

**Prevention:**
- Test the design on a Windows machine (or Chromium on Windows) as the reference platform. Rotter.net is primarily accessed from Windows.
- Do not use `-webkit-font-smoothing: antialiased` globally — it makes Arial look too thin on macOS and does not apply on Windows at all.
- Accept that sub-pixel rendering is out of the developer's control and focus on matching sizes, weights, and colors rather than exact rendering.

**Detection:** Screenshot the thread table in Chrome on Windows and Chrome on macOS. Compare at 100% zoom. Character weight will differ slightly.

**Phase:** Phase 3 (Forum Listing) — test cross-platform before declaring visual fidelity achieved.

---

### Pitfall 12: Mouse-Following Tooltip Breaks on Touch Devices

**What goes wrong:** The thread tooltip is triggered by `onmouseover` and follows the cursor. On touch devices (mobile browsers, touch-screen laptops), there is no persistent cursor position — `mousemove` events fire once on tap and then stop. The tooltip appears briefly on tap and then stays in the position of the tap, overlapping content.

**Why it happens:** Touch events do not map 1:1 to mouse events. The `mousemove` listener that repositions the tooltip fires only once per tap, not continuously.

**Consequences:** On mobile, the tooltip appears as a static overlay stuck to where the user tapped, blocking the thread table. This conflicts with PWA mobile usability goals.

**Prevention:**
- Detect touch capability with `navigator.maxTouchPoints > 0` and disable the mouse-following tooltip entirely on touch devices.
- On touch, either show no tooltip, or show a brief tap-activated popover that auto-dismisses after 2 seconds.
- The `useTooltip.ts` hook should include this check from the start.

**Detection:** Open the forum listing page on a mobile device or Chrome DevTools with touch emulation. Tap on a thread icon. Observe whether the tooltip moves with finger or stays frozen.

**Phase:** Phase 3 (Forum Listing, Task 3.9) — the tooltip implementation phase.

---

### Pitfall 13: CSS Module Class Name Collision With Browser Default Table Styles

**What goes wrong:** Tables have aggressive browser user-agent stylesheet defaults: `border-collapse: separate`, `border-spacing: 2px`, `display: table`. When CSS Modules generate scoped class names, they do not override user-agent styles for the `<table>` element itself — only for the class. Inline `bgcolor` and `cellpadding` HTML attributes from the original Rotter source are not valid in HTML5 and are not applied by modern browsers.

**Why it happens:** Rotter.net uses deprecated HTML table attributes (`bgcolor`, `cellpadding`, `cellspacing`, `border`). These cannot be copied verbatim into React JSX. React will either warn or ignore them. The CSS equivalent must be written explicitly.

**Consequences:** Table rows have unexpected 2px spacing. Cell backgrounds don't match the spec. Row alternating colors appear with gaps between rows.

**Prevention:**
- Create a `table.reset.css` (imported globally) that zeroes out all browser table defaults: `border-collapse: collapse`, `border-spacing: 0`, `padding: 0`.
- Map each deprecated HTML attribute to its CSS equivalent in the component's CSS Module: `bgcolor="#FDFDFD"` → `background-color: #FDFDFD`.
- Never use `bgcolor`, `cellpadding`, `cellspacing`, or `border` HTML attributes in JSX — always use CSS.

**Detection:** Inspect a thread table row in DevTools. Check "Computed" styles for `border-spacing`. If it shows `2px`, the user-agent default is not overridden.

**Phase:** Phase 1 (Task 1.3, globals.css) — table resets must be in place before any page builds.

---

### Pitfall 14: Push Notification Permission Is Not Grantable Without HTTPS and a Service Worker

**What goes wrong:** Push notification implementation (Phase 9.8) is tested in HTTP development mode where the Notification API is only available on `localhost`. Deploying to a staging URL without HTTPS blocks notification permission requests entirely.

**Why it happens:** The Push API and Notification API require a secure context (HTTPS) in all browsers except for `localhost`. Vercel preview deployments are HTTPS, but custom domain staging environments or tunnels may not be.

**Consequences:** The push notification feature appears to work in development, fails in staging, and the issue is misdiagnosed as a service worker registration problem rather than an HTTPS requirement.

**Prevention:**
- Always test PWA features (service worker, push, install prompt) on HTTPS URLs — use Vercel preview deployments, not local tunnels.
- Include a VAPID key pair generation step in Phase 8 setup documentation.
- The push notification subscription must be stored in the Turso database, not localStorage — localStorage is per-browser and ephemeral.

**Detection:** Open DevTools > Console in a non-localhost HTTP URL. `Notification.requestPermission()` will throw `NotAllowedError` or return `denied` without showing a browser dialog.

**Phase:** Phase 8 (PWA & Mobile, Task 8.4) — push notification implementation phase.

---

## Phase-Specific Warnings

| Phase | Topic | Likely Pitfall | Mitigation |
|-------|-------|---------------|------------|
| Phase 1 | Table components | Missing `<tbody>` causes hydration mismatch | Add explicit `<tbody>` to every table component; add hydration smoke test |
| Phase 1 | PWA library | `next-pwa` not compatible with App Router | Use Serwist (`@serwist/next`) from day one |
| Phase 1 | Icon rendering | SVG icons render too smoothly | Apply `image-rendering: pixelated` to all 16x16 icons |
| Phase 1 | Table defaults | Browser UA table styles break layout | Add global table CSS reset in `globals.css` |
| Phase 2 | LTR mirroring | Sidebar and column positions wrong | Work from design spec, not live site; never use CSS transforms to mirror |
| Phase 3 | Thread table | Row alternating colors break with hydration | Ensure row index computed server-side, not from client state |
| Phase 3 | Tooltip | Mouse-following breaks on touch | Add `navigator.maxTouchPoints` check in `useTooltip.ts` |
| Phase 7 | Scraping | Cloudflare blocks automated requests | Use `curl-cffi` in Python scraper; treat as manual extraction, not live pipeline |
| Phase 7 | Encoding | Windows-1255 bytes corrupt database | Decode with `TextDecoder('windows-1255')` before any processing |
| Phase 7 | SQLite | Local file wiped on Vercel deploy | Use Turso from Phase 7 start; never deploy with local `.db` file |
| Phase 7 | Legal | Scraped content creates IP exposure | Seed only for private dev; public version uses user-generated content |
| Phase 8 | Service worker | Cache-first applied to API routes | Define caching strategy matrix: `NetworkFirst` for `/api/`, `CacheFirst` for static assets |
| Phase 8 | Push notifications | Require HTTPS; permission denied in HTTP | Test only on Vercel preview deployments (HTTPS) |
| Phase 10 | Deployment | Static export disables ISR | Use serverless Vercel deployment, not `output: 'export'` |
| Phase 10 | Font rendering | Arial looks different on Windows vs macOS | Use Windows/Chromium as reference platform for visual fidelity testing |

---

## Sources

- [Next.js hydration error: table tbody mismatch (GitHub Discussion #36754)](https://github.com/vercel/next.js/discussions/36754)
- [Next.js hydration errors in 2026: causes and fixes (Medium)](https://medium.com/@blogs-world/next-js-hydration-errors-in-2026-the-real-causes-fixes-and-prevention-checklist-4a8304d53702)
- [Serwist Next.js getting started (official docs)](https://serwist.pages.dev/docs/next/getting-started)
- [Building a PWA in Next.js with Serwist (JavaScript in Plain English)](https://javascript.plainenglish.io/building-a-progressive-web-app-pwa-in-next-js-with-serwist-next-pwa-successor-94e05cb418d7)
- [How to build a Next.js PWA in 2025 (Medium)](https://medium.com/@jakobwgnr/how-to-build-a-next-js-pwa-in-2025-f334cd9755df)
- [Next.js official PWA guide](https://nextjs.org/docs/app/guides/progressive-web-apps)
- [How to bypass Cloudflare when scraping (ZenRows)](https://www.zenrows.com/blog/bypass-cloudflare-nodejs)
- [How to bypass Cloudflare in 2026 (Scrapfly)](https://scrapfly.io/blog/posts/how-to-bypass-cloudflare-anti-scraping)
- [puppeteer-stealth deprecated 2025 — Cloudflare bypass update (Browserless)](https://www.browserless.io/blog/how-to-bypass-cloudflare-scraping)
- [Windows-1255 encoding in Node.js (iconv-lite approach, Medium)](https://medium.com/fantageek/dealing-with-windows-1252-encoding-in-node-js-9ad1d3911516)
- [Bringing SQLite to Vercel Functions with Turso](https://turso.tech/blog/serverless)
- [Turso embedded replicas for local-first reads](https://turso.tech/blog/local-first-cloud-connected-sqlite-with-turso-embedded-replicas)
- [Vercel connection pooling knowledge base](https://vercel.com/kb/guide/connection-pooling-with-functions)
- [Offline-first PWA caching strategies (MagicBell)](https://www.magicbell.com/blog/offline-first-pwas-service-worker-caching-strategies)
- [PWA offline dynamic data (Monterail)](https://www.monterail.com/blog/pwa-offline-dynamic-data)
- [ISR limitations with static export (Next.js docs)](https://nextjs.org/docs/app/guides/incremental-static-regeneration)
- [RTL website mistakes and best practices (Reffine)](https://www.reffine.com/en/blog/rtl-website-design-and-development-mistakes-best-practices)
- [Sub-pixel problems in CSS (John Resig)](https://johnresig.com/blog/sub-pixel-problems-in-css/)
- [SVG vs GIF: developer guide (Cloudinary)](https://cloudinary.com/guides/image-formats/gif-vs-svg)
- [Web scraping legality 2025 (Browserless)](https://www.browserless.io/blog/is-web-scraping-legal)
- [Is web scraping legal 2025 (McCarthy Law)](https://mccarthylg.com/is-web-scraping-legal-a-2025-breakdown-of-what-you-need-to-know/)
