# Technology Stack

**Project:** MultiRotter PWA
**Researched:** 2026-03-22
**Research mode:** Ecosystem — Stack dimension

---

## Version Flag: Next.js 15 vs 16

The project specifies Next.js 15. Research reveals Next.js 16 is now stable (released October 2025,
with 16.1 in December 2025 and 16.2 in early 2026). This stack targets **Next.js 15 as specified**,
but flags the upgrade path clearly.

**Key differences affecting this project:**
- Next.js 16 requires Node.js 20.9+ (Next.js 15 requires 18.18+)
- Next.js 16 renames `middleware.ts` to `proxy.ts` (deprecated, not removed)
- Next.js 16 makes Turbopack the default bundler (opt-out available via `--webpack`)
- Next.js 16 fully removes synchronous `params`/`searchParams`/`cookies()` access (Next.js 15
  allowed sync access with deprecation warnings — codemods handle migration)
- PWA and service worker approach is identical in both versions

**Recommendation:** Start on Next.js 15. The project can upgrade to 16 later with automated codemods.
Upgrading a greenfield project is low-risk; the codemods handle ~90% of breaking changes automatically.

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 15.x (latest patch) | Full-stack framework | Project constraint. App Router provides SSR, ISR, API routes, and Server Actions needed for forum data. Vercel-native. |
| React | 19.x | UI library | Bundled with Next.js 15. React 19 is stable. No choice needed. |
| TypeScript | 5.x | Type safety | Project constraint. Next.js 15 ships with TS config. Mandatory for maintainability on a multi-page app. |
| Node.js | 20.9+ (LTS) | Runtime | Next.js 16 will require it; start here to avoid future forced migration. Next.js 15 minimum is 18.18. |

**Confidence: HIGH** — verified against official Next.js docs and release notes.

### PWA Layer

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `@serwist/next` | 9.x (latest, currently 9.5.7) | Service worker + offline caching | Official Next.js docs explicitly recommend Serwist for offline support. Actively maintained Workbox fork. Successor to both `shadowwalker/next-pwa` (abandoned) and `@ducanh2912/next-pwa` (superseded). |
| `serwist` | 9.x | Serwist runtime (peer dep) | Required peer dependency of `@serwist/next`. |
| `web-push` | latest stable | VAPID push notifications | The package used in official Next.js PWA documentation for server-side push notification sending. No alternative needed — this is the ecosystem standard. |
| `manifest.ts` (built-in) | — | Web app manifest | Next.js 15 App Router has built-in manifest support via `app/manifest.ts`. No third-party package needed. |
| `public/sw.js` (custom) | — | Service worker file | Next.js official docs show a custom `public/sw.js` for push notification handling. Serwist handles caching; this custom SW handles push events. |

**What NOT to use:**
- `shadowwalker/next-pwa` — unmaintained, last release 2022
- `@ducanh2912/next-pwa` — superseded by Serwist (same author migrated to Serwist)
- `next-pwa-pack` — third-party, not widely adopted, unnecessary

**Confidence: HIGH** — Serwist recommendation is in official Next.js 15/16 PWA documentation (verified
at nextjs.org/docs/app/guides/progressive-web-apps, last updated 2026-02-11). `web-push` is shown
in the same official guide.

**Important caveat:** Serwist currently requires webpack configuration (noted in official docs). This
means `next.config.ts` must use `withSerwist()` wrapper, and Turbopack cannot be used for development
if Serwist is active. Use `next dev --webpack` when service worker behavior needs testing.

### Database

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Turso (libSQL cloud) | — | Primary database for Vercel deployment | `better-sqlite3` cannot persist writes on Vercel's ephemeral serverless filesystem. Turso provides SQLite-compatible cloud storage. Turso partial-sync (released Feb 2026) syncs the first 128KiB of schema and hot pages into the serverless function on cold start — reads are local, writes go to cloud. Native Vercel marketplace integration exists. |
| `@libsql/client` | latest | libSQL SDK for connecting to Turso | Standard client for Turso/libSQL. Works in Next.js API routes and Server Actions. |
| `drizzle-orm` | 0.45.x | ORM and query builder | TypeScript-native, zero-abstraction ORM with first-class libSQL/Turso support. Generates typed query results matching TypeScript interfaces. Lightweight — no bloat, no runtime reflection. Pairs with `drizzle-kit` for migrations. |
| `drizzle-kit` | latest | Schema migration CLI | Works with libSQL dialect. Generates SQL migrations from schema changes. |
| JSON files in `data/` | — | Seed data / read-only snapshots | For the static scraped content (75 threads, 5 full threads). Loaded at build time via `fs` in Server Components. No database roundtrip for initial seeded content. |

**Local development setup:** `libsql://file:local.db` (file-based local SQLite, zero config). Production:
`libsql://your-db.turso.io` with auth token. Same code, different `DATABASE_URL` env var.

**What NOT to use:**
- `better-sqlite3` directly on Vercel — write persistence is broken on serverless (ephemeral FS)
- PostgreSQL (Neon/Supabase/Vercel Postgres) — over-engineered for this project scale; SQLite is
  sufficient for a forum with realistic traffic expectations; avoids operational complexity
- Prisma — heavier than Drizzle, slower cold starts due to query engine binary, worse Turso support

**Confidence: HIGH** — verified against Vercel's official SQLite KB article, Turso docs, and multiple
independent reports. Drizzle + Turso combination is the 2026 standard for this architecture.

### Authentication

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Better Auth | latest stable | Session auth, email/password | Better Auth is the 2026 recommended choice for new Next.js projects. TypeScript-first, framework-agnostic, supports email/password + OAuth, MFA, sessions — all needed features out of the box. Lucia Auth was deprecated March 2025 and is no longer viable. Auth.js v5 (NextAuth) remains an option for OAuth-heavy apps but Better Auth has cleaner architecture for this use case. Natively supports SQLite/libSQL. |

**What NOT to use:**
- `lucia-auth` — officially deprecated March 2025, now an educational resource only
- Rolling custom auth — sessions, CSRF, password hashing are all security-critical; use a library
- Auth0/Clerk — cloud auth services add external dependency and cost for a small forum app

**Confidence: MEDIUM** — Better Auth version number not confirmed via Context7 (not in index).
Multiple independent 2026 sources and official project website confirm active maintenance and
Next.js 15 compatibility. Verify current version at install time with `npm show better-auth version`.

### Styling

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| CSS Modules | (built into Next.js) | Component-scoped styles | Project constraint. Exact fit for this use case: allows writing raw CSS that mirrors Rotter's inline styles and class-based styles, with TypeScript class name safety. No framework overhead. |
| CSS Custom Properties | (native browser) | Design token system | All Rotter hex colors and layout constants defined as CSS variables in `globals.css`. Every component references tokens, not raw hex values. Documented in `PWA_PLAN.md`. |

**What NOT to use:**
- Tailwind CSS — generates utility classes incompatible with table-based pixel-exact retro layout philosophy
- styled-components / Emotion — runtime CSS-in-JS adds overhead; also incompatible with retro no-framework constraint
- Bootstrap / any CSS framework — would fight against the exact Rotter layout requirements

**Confidence: HIGH** — project constraint, no alternatives to evaluate.

### Layout Strategy

| Technology | Purpose | Why |
|------------|---------|-----|
| HTML `<table>` elements | Forum thread listings, thread reply trees | Project constraint. Rotter uses actual table-based layout. Using CSS Grid/Flexbox would be technically equivalent but visually divergent — table elements produce the exact same column behavior and browser rendering as the original. |
| CSS `display: table` / `display: table-cell` | Homepage 3-column layout | For the homepage, CSS table-display (not actual `<table>` elements) achieves the 3-column fixed-width layout without requiring `<table>` in the document outline where it would be semantically wrong. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `sharp` | (auto, via Next.js 15) | Image optimization | Next.js 15 automatically uses sharp for `next start`. No manual install needed. For PWA icons, pre-generate PNGs at build time. |
| `web-push` | latest | Push notification sending (server-side) | Phase 8 (PWA). Used in Next.js Server Actions to send VAPID-authenticated push messages to subscribed users. |
| `@libsql/client` | latest | Database client | Phases 7+ when transitioning from JSON seed data to live database. |

### Development Tooling

| Tool | Version | Purpose | Why |
|------|---------|---------|-----|
| `drizzle-kit` | latest | DB migrations | Pairs with drizzle-orm. `drizzle-kit generate` + `drizzle-kit migrate` workflow. |
| `eslint` | 9.x | Linting | Next.js 15 ships with ESLint 9 support. Use `eslint.config.mjs` flat config format. |
| TypeScript | 5.x | Type checking | Configured by `create-next-app`. Use `tsconfig.json` strict mode. |

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| PWA library | `@serwist/next` | `@ducanh2912/next-pwa` | Serwist is the evolution of that same project by the same author. Always use the current iteration. |
| PWA library | `@serwist/next` | Manual SW + Workbox CDN | More boilerplate, no Next.js build integration, more error-prone |
| Database | Turso + libSQL | better-sqlite3 directly | Write persistence broken on Vercel serverless FS — fundamental incompatibility |
| Database | Turso + libSQL | Vercel Postgres / Neon | Over-engineered for forum scale; relational SQL is fine but SQLite is sufficient and simpler |
| ORM | drizzle-orm | Prisma | Slower cold starts (binary query engine), heavier bundle, worse libSQL support |
| ORM | drizzle-orm | Raw SQL (`@libsql/client`) | Type safety lost; drizzle-orm compiles to same SQL with full TypeScript |
| Auth | Better Auth | Auth.js v5 (NextAuth) | Better Auth has cleaner session model for email/password flows; NextAuth excels at OAuth |
| Auth | Better Auth | Lucia Auth | Deprecated March 2025; not a viable choice |
| Auth | Better Auth | Custom JWT | Security-critical surface, unnecessary reinvention |
| Styling | CSS Modules | Tailwind CSS | Incompatible with pixel-exact retro layout philosophy; project constraint |
| Framework | Next.js 15 | Next.js 16 | Project specifies 15; 16 is available and upgrade is low-risk when ready |

---

## Installation

```bash
# Create the project
npx create-next-app@15 multirotter --typescript --app --no-tailwind --src-dir --import-alias "@/*"

# PWA - Serwist
npm install @serwist/next
npm install -D serwist

# Push notifications
npm install web-push
npm install -D @types/web-push

# Database
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit

# Auth
npm install better-auth
```

**VAPID keys** (generate once, store in `.env.local`):
```bash
npx web-push generate-vapid-keys
```

---

## Environment Variables

```
# Turso database
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# PWA push notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-public-key
VAPID_PRIVATE_KEY=your-private-key

# Better Auth
BETTER_AUTH_SECRET=your-secret-32-chars-minimum
BETTER_AUTH_URL=https://your-domain.com

# Local development: override DATABASE_URL to file-based SQLite
# TURSO_DATABASE_URL=file:local.db
```

---

## Version Summary

| Package | Target Version | Confidence |
|---------|---------------|------------|
| next | 15.x latest | HIGH |
| react / react-dom | 19.x | HIGH |
| typescript | 5.x | HIGH |
| @serwist/next | 9.5.x | HIGH |
| serwist | 9.5.x | HIGH |
| web-push | latest | HIGH |
| drizzle-orm | 0.45.x | HIGH |
| drizzle-kit | latest | HIGH |
| @libsql/client | latest | HIGH |
| better-auth | latest stable | MEDIUM |

---

## Open Questions / Verify at Install Time

1. **Serwist + Turbopack compatibility**: Serwist requires webpack. Confirm `next dev --webpack`
   works in Next.js 15 for development when testing service worker behavior. Normal development
   (without SW testing) can use default Turbopack.

2. **better-sqlite3 for local dev**: For the local development file-based SQLite, `@libsql/client`
   with `file:local.db` URL should work without native bindings. Verify this works without
   `better-sqlite3` installation (it should — libSQL client handles local files natively).

3. **Turso partial-sync on Vercel**: The `@tursodatabase/vercel-experimental` package (Feb 2026)
   enables partial page sync. Evaluate at Phase 7 (Data Layer) whether this is worth adding
   over standard `@libsql/client` HTTP connections.

4. **Better Auth version**: Confirm current stable version at `npm show better-auth version`
   before installing. The package moved fast in 2025-2026.

---

## Sources

- [Next.js 15 official release blog](https://nextjs.org/blog/next-15)
- [Next.js 16 official release blog](https://nextjs.org/blog/next-16)
- [Next.js PWA official guide](https://nextjs.org/docs/app/guides/progressive-web-apps) (updated 2026-02-11)
- [Serwist npm package @serwist/next](https://www.npmjs.com/package/@serwist/next)
- [Serwist official docs](https://serwist.pages.dev/docs/next)
- [Vercel SQLite support KB](https://vercel.com/kb/guide/is-sqlite-supported-in-vercel)
- [Turso on Vercel marketplace](https://vercel.com/marketplace/tursocloud)
- [Drizzle ORM with Turso tutorial](https://orm.drizzle.team/docs/tutorials/drizzle-with-turso)
- [Turso partial-sync for Vercel Functions](https://turso.tech/blog/serverless)
- [Better Auth Next.js integration](https://better-auth.com/docs/integrations/next)
- [Lucia Auth deprecation announcement (March 2025)](https://lucia-auth.com)
