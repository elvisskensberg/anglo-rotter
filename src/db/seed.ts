/**
 * Database seed script — populates all 5 tables from snapshot JSON files and fabricated data.
 * Run with: pnpm db:seed  (requires pnpm db:push to have been run first)
 *
 * NOTE: Scraped content is for private dev seeding only. Public launch must
 * use user-generated content. Do not commit to public repos.
 */

import * as fs from "fs";
import * as path from "path";
import { db } from "./client";
import { forums, threads, posts, newsItems, users } from "./schema";

// ── Category mapping (mirrors forum-seed.ts) ────────────────────────────────

type ForumCategory = "scoops" | "politics" | "media" | "economy" | "sports" | "culture";

function mapCategory(raw: string): ForumCategory {
  const map: Record<string, ForumCategory> = {
    security_alert: "scoops",
    security: "scoops",
    military: "scoops",
    politics: "politics",
    legal: "politics",
    international: "politics",
    domestic: "politics",
    media: "media",
    tech: "media",
    economy: "economy",
    sports: "sports",
    culture: "culture",
  };
  return map[raw] ?? "scoops";
}

// ── Stats fabrication (mirrors forum-seed.ts fabricateStats) ─────────────────

function fabricateStats(threadId: number): { viewCount: number; replyCount: number } {
  const mod = threadId % 100;
  let viewCount: number;
  if (mod < 5) {
    viewCount = 10000 + ((threadId * 137) % 8000);
  } else if (mod < 20) {
    viewCount = 2000 + ((threadId * 73) % 2000);
  } else {
    viewCount = 100 + ((threadId * 41) % 900);
  }
  const replyCount = Math.floor(viewCount / 80);
  return { viewCount, replyCount };
}

// ── Date parsing ─────────────────────────────────────────────────────────────

/**
 * Parse "DD/MM/YYYY HH:MM" or "DD/MM/YYYY" to Unix timestamp (ms).
 */
function parseDateToMs(dateStr: string): number {
  const parts = dateStr.trim().split(" ");
  const datePart = parts[0] ?? "22/03/2026";
  const timePart = parts[1] ?? "00:00";
  const [day, month, year] = datePart.split("/");
  const [hours, minutes] = timePart.split(":");
  const d = new Date(
    parseInt(year ?? "2026", 10),
    parseInt(month ?? "3", 10) - 1,
    parseInt(day ?? "22", 10),
    parseInt(hours ?? "0", 10),
    parseInt(minutes ?? "0", 10),
    0,
    0
  );
  return d.getTime();
}

/**
 * Parse "HH:MM DD/MM" format (used in news-seed.ts time field) to Unix ms.
 * Assumes year 2026.
 */
function parseNewstimeToMs(timeStr: string): number {
  // Format: "19:56 22/03"
  const match = timeStr.match(/^(\d{2}):(\d{2})\s+(\d{2})\/(\d{2})$/);
  if (!match) {
    return Date.UTC(2026, 2, 22, 12, 0, 0);
  }
  const [, hh, mm, dd, mo] = match;
  return Date.UTC(
    2026,
    parseInt(mo!, 10) - 1,
    parseInt(dd!, 10),
    parseInt(hh!, 10),
    parseInt(mm!, 10),
    0
  );
}

// ── Snapshot thread types ─────────────────────────────────────────────────────

interface SnapshotThread {
  id: number | null;
  title_en: string;
  author: string | null;
  date: string;
  category: string;
}

// ── SNAPSHOT_THREADS from scoops1_2026-03-22.json (50 threads) ───────────────
// These mirror the SNAPSHOT_THREADS array in forum-seed.ts.

const SNAPSHOT_THREADS: SnapshotThread[] = [
  { id: 940171, title_en: "Red Alert (18:42): Shlomi, Mateh Asher, Ma'ale Yosef", author: null, date: "22/03/2026 18:42", category: "security_alert" },
  { id: 940169, title_en: "UAV infiltration (18:42): Yirka, Ma'alot-Tarshiha, Ma'ale Yosef, Mateh Asher", author: null, date: "22/03/2026 18:42", category: "security_alert" },
  { id: 940168, title_en: "Smotrich at funeral: We will collapse the PA", author: "tok_dogri", date: "22/03/2026", category: "politics" },
  { id: 940165, title_en: "Supreme Court refuses to broadcast hearing on aid organizations", author: "mortzix", date: "22/03/2026", category: "legal" },
  { id: 940154, title_en: "AG to Police Commissioner: Stop Ben Gvir's Incitement Division immediately", author: "HashOlef", date: "22/03/2026", category: "politics" },
  { id: 940152, title_en: "Yair Golan arrived at missile impact site in Dimona and was chased away", author: "Yuniger", date: "22/03/2026", category: "politics" },
  { id: 940151, title_en: "IDF investigating if Ofer Moskovitz was killed by friendly fire at Misgav Am", author: "Yuniger", date: "22/03/2026", category: "military" },
  { id: 940140, title_en: "Professionals recommend closing Ben Gurion Airport immediately", author: "Piccolo", date: "22/03/2026", category: "security" },
  { id: 940138, title_en: "Alerts for launches from Iran toward south (18:21)", author: "MiddleEast", date: "22/03/2026 18:21", category: "security_alert" },
  { id: 940137, title_en: "Ultra-Orthodox blocking light rail in Jerusalem", author: "Yuniger", date: "22/03/2026", category: "domestic" },
  { id: 940128, title_en: "Updating thread on strikes in Iran", author: "Izhack111", date: "22/03/2026", category: "military" },
  { id: 940099, title_en: "Casualty update from Arad - Prof. Dan Schwarzfuchs", author: "dj_deep", date: "22/03/2026", category: "security" },
  { id: 940080, title_en: "Former Obama official: Netanyahu is a liar because Khamenei issued fatwa against nuclear weapons", author: "NichusMuskhal", date: "22/03/2026", category: "international" },
  { id: 940079, title_en: "Trump: Now with Iran's death, America's greatest enemy is the Democratic Party", author: "Prodigy", date: "22/03/2026", category: "international" },
  { id: 940078, title_en: "UK: Pro-Palestinian called pro-Israeli 'Wannabe Jew' - he was suspended", author: "NichusMuskhal", date: "22/03/2026", category: "international" },
  { id: 940077, title_en: "Lebanese Health Ministry: 1,029 killed, 2,786 wounded since fighting began", author: "Amiros", date: "22/03/2026", category: "military" },
  { id: 940076, title_en: "Qatar trying to prevent escalation; Saudi/UAE want US to continue", author: "NichusMuskhal", date: "22/03/2026", category: "international" },
  { id: 940075, title_en: "Sudan: WHO says Sudan army drone hit hospital, killed 64", author: "Yossarian", date: "22/03/2026", category: "international" },
  { id: 940074, title_en: "Turkish FM spoke with Iranian and Egyptian FMs", author: "NichusMuskhal", date: "22/03/2026", category: "international" },
  { id: 940073, title_en: "Watch: Direct hit on beach in central Israel", author: "HaPirat", date: "22/03/2026", category: "security" },
  { id: 940072, title_en: "Netanyahu in Arad: If everyone entered shelters, nobody would have been hurt", author: "SofMaaseh", date: "22/03/2026", category: "politics" },
  { id: 940071, title_en: "IRGC: If Trump follows through on threats, we will fully close Strait of Hormuz", author: null, date: "22/03/2026", category: "international" },
  { id: 940070, title_en: "Iran's president on X: Illusion of wiping Iran off the map", author: "Amiros", date: "22/03/2026", category: "international" },
  { id: 940069, title_en: "Checking how much Iranian propaganda relies on Haaretz", author: "Yuniger", date: "22/03/2026", category: "media" },
  { id: 940068, title_en: "Smotrich: Don't wait for next Oct 7. Demands dismantling PA terror army in West Bank", author: "SofMaaseh", date: "22/03/2026", category: "politics" },
  { id: 940067, title_en: "Elon Musk announces Terafab project", author: null, date: "22/03/2026", category: "tech" },
  { id: 940066, title_en: "Arab reports: 4 eliminated in strike on Hamas police vehicle in central Gaza", author: "Izhack111", date: "22/03/2026", category: "military" },
  { id: 940065, title_en: "Initial investigation: US THAAD system was supposed to intercept Arad missile but missed", author: "Mamani", date: "22/03/2026", category: "military" },
  { id: 940064, title_en: "Israeli flag raised in Shiite village al-Khiam in south Lebanon", author: "PinkyBite", date: "22/03/2026", category: "military" },
  { id: 940063, title_en: "Qasimiyeh bridge bombed on the Litani", author: "Yuniger", date: "22/03/2026", category: "military" },
  { id: 940062, title_en: "Saudi Al-Hadath: IRGC funds Lebanese politicians and media figures", author: "Kornes", date: "22/03/2026", category: "international" },
  { id: 940061, title_en: "Bnei Brak - woman cut ultra-Orthodox boy's sidelocks because his ball knocked over a bin", author: "NichusMuskhal", date: "22/03/2026", category: "domestic" },
  { id: 940060, title_en: "Israel warned UK PM: Iran developed ballistic missiles capable of hitting London", author: "PodiBenKipod", date: "22/03/2026", category: "international" },
  { id: 940059, title_en: "Initial investigation of direct hits on Dimona and Arad by Iranian Qadr missiles", author: "Alon", date: "22/03/2026", category: "military" },
  { id: 940058, title_en: "4 Negev residents charged with smuggling weapons, drugs, animals via drones from Egypt/Jordan", author: "Naama", date: "22/03/2026", category: "domestic" },
  { id: 940057, title_en: "Violent night in territories: 20+ nationalist crime incidents against Palestinians", author: "PinkyBite", date: "22/03/2026", category: "security" },
  { id: 940056, title_en: "Cleared for publication: Ofer Moskovitz killed by fire at Misgav Am", author: "Prodigy", date: "22/03/2026", category: "military" },
  { id: 940055, title_en: "Following Defense Minister's threat, forces began attacking Litani bridges", author: null, date: "22/03/2026", category: "military" },
  { id: 940054, title_en: "Documentation of the hit in central Tel Aviv", author: null, date: "22/03/2026", category: "security" },
  { id: 940053, title_en: "Israeli company SentinelOne invested in Replit whose CEO accuses Israel of genocide", author: null, date: "22/03/2026", category: "tech" },
  { id: 940052, title_en: "IDF strikes weapons depot in Beirut southern suburb", author: "Yuniger", date: "22/03/2026", category: "military" },
  { id: 940051, title_en: "Hundreds of rockets fired toward Haifa and northern Israel overnight", author: "Izhack111", date: "22/03/2026", category: "security_alert" },
  { id: 940050, title_en: "US carrier strike group enters eastern Mediterranean", author: "MiddleEast", date: "22/03/2026", category: "military" },
  { id: 940049, title_en: "Russian FM: Nuclear escalation would be catastrophic, calls for ceasefire", author: "NichusMuskhal", date: "22/03/2026", category: "international" },
  { id: 940048, title_en: "Report: Hezbollah command structure severely degraded following Israeli strikes", author: "Amiros", date: "22/03/2026", category: "military" },
  { id: 940047, title_en: "Finance Ministry: War costs Israel 1.2 billion shekels per day", author: "EconomicWatch", date: "22/03/2026", category: "economy" },
  { id: 940046, title_en: "Ben Gurion Airport shut down after missile fragments found on runway", author: "PinkyBite", date: "22/03/2026", category: "security" },
  { id: 940045, title_en: "UN Secretary-General calls emergency session on Israel-Iran escalation", author: "Kornes", date: "22/03/2026", category: "international" },
  { id: 940044, title_en: "Iron Dome intercepts 43 of 50 rockets fired in latest barrage", author: "HashOlef", date: "22/03/2026", category: "military" },
  { id: 940043, title_en: "Netanyahu convenes security cabinet at 3 AM following Arad strikes", author: "tok_dogri", date: "22/03/2026", category: "politics" },
  { id: 940042, title_en: "Tel Aviv stock exchange halts trading after 8% drop at opening bell", author: "EconomicWatch", date: "22/03/2026", category: "economy" },
];

// ── EXTRA_THREADS (22 fabricated threads from forum-seed.ts) ─────────────────

const EXTRA_THREADS: SnapshotThread[] = [
  { id: 800000, title_en: "BREAKING: Mass missile barrage targets Tel Aviv metropolitan area", author: "NewsDesk", date: "22/03/2026", category: "security_alert" },
  { id: 800001, title_en: "LIVE: Situation updates — Iranian strike campaign on Israeli cities", author: "Izhack111", date: "22/03/2026", category: "military" },
  { id: 800002, title_en: "CONFIRMED: Israeli retaliation strikes on Tehran infrastructure", author: "MiddleEast", date: "22/03/2026", category: "military" },
  { id: 800003, title_en: "US declares highest terror alert level; evacuates embassy staff from region", author: "NichusMuskhal", date: "22/03/2026", category: "international" },
  { id: 800004, title_en: "Multiple explosions reported in central Haifa, emergency declared", author: "HashOlef", date: "22/03/2026", category: "security_alert" },
  { id: 800005, title_en: "Opposition leader calls for emergency elections amid security crisis", author: "PoliticsDesk", date: "21/03/2026", category: "politics" },
  { id: 800006, title_en: "Knesset security committee meets in closed session for third consecutive day", author: "Reporter99", date: "21/03/2026", category: "politics" },
  { id: 800007, title_en: "Coalition collapses: Haredi parties threaten to resign over draft law", author: "PoliticsDesk", date: "20/03/2026", category: "politics" },
  { id: 800008, title_en: "Channel 13 reporter embedded with troops in northern front", author: "MediaWatch", date: "22/03/2026", category: "media" },
  { id: 800009, title_en: "Foreign press corps ordered to leave exclusion zone near Dimona", author: "MediaWatch", date: "22/03/2026", category: "media" },
  { id: 800010, title_en: "Social media flooded with unverified claims about casualties", author: "Yuniger", date: "22/03/2026", category: "media" },
  { id: 800011, title_en: "NYT publishes op-ed calling for immediate ceasefire", author: "NichusMuskhal", date: "21/03/2026", category: "media" },
  { id: 800012, title_en: "Shekel falls 4% against dollar in morning trading", author: "EconomicWatch", date: "22/03/2026", category: "economy" },
  { id: 800013, title_en: "Insurance companies suspend new policies in conflict zones", author: "FinanceDesk", date: "22/03/2026", category: "economy" },
  { id: 800014, title_en: "Tourism industry reports 95% cancellation rate for March bookings", author: "EconomicWatch", date: "21/03/2026", category: "economy" },
  { id: 800015, title_en: "Violent clashes erupt near parliament building amid protests", author: "PoliticsDesk", date: "22/03/2026", category: "politics" },
  { id: 800016, title_en: "Emergency budget approved: 50 billion shekels for war effort", author: "EconomicWatch", date: "22/03/2026", category: "economy" },
  { id: 800020, title_en: "Israeli national football team match postponed due to security situation", author: "SportsDesk", date: "22/03/2026", category: "sports" },
  { id: 800021, title_en: "UEFA grants Israel postponement on all upcoming fixtures", author: "SportsDesk", date: "21/03/2026", category: "sports" },
  { id: 800022, title_en: "Maccabi Tel Aviv practice cancelled as players seek safety in shelters", author: "SportsDesk", date: "22/03/2026", category: "sports" },
  { id: 800023, title_en: "Tel Aviv museums close indefinitely following missile strikes", author: "CultureDesk", date: "22/03/2026", category: "culture" },
  { id: 800024, title_en: "Artists release solidarity album supporting displaced families", author: "CultureDesk", date: "21/03/2026", category: "culture" },
  { id: 800025, title_en: "Film festival postponed until further notice citing safety concerns", author: "CultureDesk", date: "20/03/2026", category: "culture" },
];

// ── News seed data (mirrors news-seed.ts NEWS_SEED) ───────────────────────────

interface NewsSeedItem {
  headline: string;
  time: string;
  source: string;
  sourceIcon: string;
  category: string;
  url: string;
}

const SOURCE_COLORS: Record<string, string> = {
  Ynet: "#2a9d8f",
  Maariv: "#e63946",
  "Israel Today": "#264653",
  "Channel 7": "#e76f51",
  "Israel Defense": "#606c38",
  Walla: "#457b9d",
  Globes: "#f4a261",
  Calcalist: "#023e8a",
};

const NEWS_SEED_DATA: NewsSeedItem[] = [
  { headline: "Iran fires 12 ballistic missiles toward Israeli cities in overnight barrage", time: "19:56 22/03", source: "Ynet", sourceIcon: SOURCE_COLORS["Ynet"]!, category: "news", url: "#" },
  { headline: "Security cabinet convenes emergency session following Arad and Dimona strikes", time: "19:40 22/03", source: "Maariv", sourceIcon: SOURCE_COLORS["Maariv"]!, category: "news", url: "#" },
  { headline: "IDF confirms interception of 43 of 50 rockets in latest barrage over northern Israel", time: "19:22 22/03", source: "Israel Today", sourceIcon: SOURCE_COLORS["Israel Today"]!, category: "news", url: "#" },
  { headline: "Ben Gurion Airport closed: missile fragments discovered on main runway", time: "19:05 22/03", source: "Walla", sourceIcon: SOURCE_COLORS["Walla"]!, category: "news", url: "#" },
  { headline: "US carrier strike group enters eastern Mediterranean in show of support", time: "18:48 22/03", source: "Channel 7", sourceIcon: SOURCE_COLORS["Channel 7"]!, category: "news", url: "#" },
  { headline: "UN Security Council calls emergency meeting on Israel-Iran escalation", time: "18:30 22/03", source: "Israel Defense", sourceIcon: SOURCE_COLORS["Israel Defense"]!, category: "news", url: "#" },
  { headline: "Red Alert sirens sound across Haifa Bay, residents urged to enter shelters", time: "17:55 22/03", source: "Ynet", sourceIcon: SOURCE_COLORS["Ynet"]!, category: "news", url: "#" },
  { headline: "Netanyahu addresses nation: We will respond forcefully to any further aggression", time: "17:20 22/03", source: "Maariv", sourceIcon: SOURCE_COLORS["Maariv"]!, category: "news", url: "#" },
  { headline: "UEFA postpones all Israeli club fixtures pending security situation assessment", time: "19:50 22/03", source: "Ynet", sourceIcon: SOURCE_COLORS["Ynet"]!, category: "sports", url: "#" },
  { headline: "Maccabi Tel Aviv basketball practice suspended as players shelter in safe rooms", time: "19:35 22/03", source: "Israel Today", sourceIcon: SOURCE_COLORS["Israel Today"]!, category: "sports", url: "#" },
  { headline: "Israeli national football team match against Denmark called off with 48 hours notice", time: "19:10 22/03", source: "Channel 7", sourceIcon: SOURCE_COLORS["Channel 7"]!, category: "sports", url: "#" },
  { headline: "Hapoel Be'er Sheva striker returns from loan to help club amid crisis", time: "18:55 22/03", source: "Globes", sourceIcon: SOURCE_COLORS["Globes"]!, category: "sports", url: "#" },
  { headline: "Israeli Olympic committee holds emergency board meeting over Tokyo qualifier status", time: "18:25 22/03", source: "Walla", sourceIcon: SOURCE_COLORS["Walla"]!, category: "sports", url: "#" },
  { headline: "Maccabi Haifa announces stadium unavailable following infrastructure damage", time: "17:48 22/03", source: "Ynet", sourceIcon: SOURCE_COLORS["Ynet"]!, category: "sports", url: "#" },
  { headline: "Israeli tennis player advances to quarterfinals despite travel disruptions", time: "17:15 22/03", source: "Maariv", sourceIcon: SOURCE_COLORS["Maariv"]!, category: "sports", url: "#" },
  { headline: "Premier League clubs extend contracts for Israeli players due to force majeure", time: "16:40 22/03", source: "Israel Today", sourceIcon: SOURCE_COLORS["Israel Today"]!, category: "sports", url: "#" },
  { headline: "Tel Aviv Stock Exchange halts trading after 8.3% plunge at opening bell", time: "19:45 22/03", source: "Globes", sourceIcon: SOURCE_COLORS["Globes"]!, category: "economy", url: "#" },
  { headline: "Shekel falls to six-year low against dollar amid security escalation fears", time: "19:28 22/03", source: "Calcalist", sourceIcon: SOURCE_COLORS["Calcalist"]!, category: "economy", url: "#" },
  { headline: "Finance Ministry approves emergency 50-billion-shekel war budget supplement", time: "19:00 22/03", source: "Globes", sourceIcon: SOURCE_COLORS["Globes"]!, category: "economy", url: "#" },
  { headline: "War cost estimate rises to 1.2 billion shekels per day, Finance Ministry says", time: "18:40 22/03", source: "Calcalist", sourceIcon: SOURCE_COLORS["Calcalist"]!, category: "economy", url: "#" },
  { headline: "Tourism industry reports 97% booking cancellation rate for April and May", time: "18:10 22/03", source: "Walla", sourceIcon: SOURCE_COLORS["Walla"]!, category: "economy", url: "#" },
  { headline: "Insurance companies suspend new policies in northern and southern conflict zones", time: "17:38 22/03", source: "Globes", sourceIcon: SOURCE_COLORS["Globes"]!, category: "economy", url: "#" },
  { headline: "Bank of Israel intervenes in forex market to defend shekel floor", time: "16:55 22/03", source: "Calcalist", sourceIcon: SOURCE_COLORS["Calcalist"]!, category: "economy", url: "#" },
  { headline: "Tech sector exports decline 12% as overseas clients invoke force majeure clauses", time: "16:10 22/03", source: "Globes", sourceIcon: SOURCE_COLORS["Globes"]!, category: "economy", url: "#" },
  { headline: "Elon Musk announces Terafab semiconductor gigafactory project, details sparse", time: "19:52 22/03", source: "Calcalist", sourceIcon: SOURCE_COLORS["Calcalist"]!, category: "tech", url: "#" },
  { headline: "Israeli startup Mobileye pauses autonomous vehicle road tests in affected regions", time: "19:30 22/03", source: "Globes", sourceIcon: SOURCE_COLORS["Globes"]!, category: "tech", url: "#" },
  { headline: "Cyber Division detects surge in Iranian phishing campaigns targeting infrastructure", time: "19:12 22/03", source: "Israel Defense", sourceIcon: SOURCE_COLORS["Israel Defense"]!, category: "tech", url: "#" },
  { headline: "SentinelOne faces investor backlash over funding of Replit whose CEO backed Gaza campaign", time: "18:50 22/03", source: "Calcalist", sourceIcon: SOURCE_COLORS["Calcalist"]!, category: "tech", url: "#" },
  { headline: "Check Point warns of DDoS attacks targeting Israeli banking and government portals", time: "18:20 22/03", source: "Israel Today", sourceIcon: SOURCE_COLORS["Israel Today"]!, category: "tech", url: "#" },
  { headline: "Waze reroutes millions of Israeli commuters in real time around road closures", time: "17:40 22/03", source: "Walla", sourceIcon: SOURCE_COLORS["Walla"]!, category: "tech", url: "#" },
  { headline: "Intel Haifa R&D center switches to remote work as precautionary measure", time: "16:30 22/03", source: "Globes", sourceIcon: SOURCE_COLORS["Globes"]!, category: "tech", url: "#" },
  { headline: "Iron Dome fire-control software upgrade credited with higher interception rate", time: "14:30 22/03", source: "Israel Defense", sourceIcon: SOURCE_COLORS["Israel Defense"]!, category: "tech", url: "#" },
];

// ── Main seed function ─────────────────────────────────────────────────────────

async function seed(): Promise<void> {
  console.log("Starting database seed...");

  // ── 1. Seed forums ──────────────────────────────────────────────────────────

  const forumRows = [
    { id: "scoops1", name: "Scoops & News", slug: "scoops1" },
    { id: "politics", name: "Politics", slug: "politics" },
    { id: "media", name: "Media", slug: "media" },
    { id: "economy", name: "Economy", slug: "economy" },
    { id: "sports", name: "Sports", slug: "sports" },
    { id: "culture", name: "Culture", slug: "culture" },
  ];

  await db.insert(forums).values(forumRows).onConflictDoNothing();
  console.log(`  Forums: ${forumRows.length} rows`);

  // ── 2. Collect all threads to determine unique authors ─────────────────────

  const allRawThreads = [...SNAPSHOT_THREADS, ...EXTRA_THREADS];

  // ── 3. Seed users table ────────────────────────────────────────────────────

  const authorSet = new Set<string>();
  authorSet.add("Anonymous");
  for (const t of allRawThreads) {
    if (t.author) {
      authorSet.add(t.author);
    }
  }

  const now = Date.now();
  const userRows = Array.from(authorSet).map((username, idx) => {
    const len = username.length;
    const starRating = (len % 5) + 1;
    const postCount = (len * 137) % 10000;
    const ratersCount = (len * 41) % 500;
    const points = postCount * starRating;
    return {
      // Better Auth required fields
      id: `seed-user-${idx}`,
      name: username,
      email: `${username.toLowerCase().replace(/[^a-z0-9]/g, "")}@seed.local`,
      emailVerified: false as const,
      createdAt: now,
      updatedAt: now,
      // Forum-specific profile fields
      username,
      postCount,
      starRating,
      ratersCount,
      points,
    };
  });

  await db.insert(users).values(userRows).onConflictDoNothing();
  console.log(`  Users: ${userRows.length} rows`);

  // ── 4. Seed threads + collect for posts ────────────────────────────────────

  interface ThreadRow {
    id: number;
    forumId: string;
    title: string;
    author: string;
    content: string;
    excerpt: string;
    category: string;
    viewCount: number;
    replyCount: number;
    createdAt: number;
    lastReplyAt: number;
    lastReplyAuthor: string;
  }

  const threadRows: ThreadRow[] = allRawThreads.map((raw, index) => {
    const resolvedId = raw.id ?? 900100 + index;
    const stats = fabricateStats(resolvedId);
    const createdAt = parseDateToMs(raw.date);
    const lastReplyAt =
      createdAt + ((resolvedId * 7919) % (4 * 60 * 60 * 1000)); // up to 4h offset
    const lastReplyAuthor = `User${resolvedId % 20}`;
    const excerpt =
      raw.title_en.length >= 200
        ? raw.title_en
        : (raw.title_en + " " + raw.title_en + " " + raw.title_en).slice(0, 200);

    return {
      id: resolvedId,
      forumId: "scoops1",
      title: raw.title_en,
      author: raw.author ?? "Anonymous",
      content: raw.title_en,
      excerpt,
      category: mapCategory(raw.category),
      viewCount: stats.viewCount,
      replyCount: stats.replyCount,
      createdAt,
      lastReplyAt,
      lastReplyAuthor,
    };
  });

  // Also try to read from the actual snapshot JSON for any additional threads
  let snapshotExtras = 0;
  try {
    const snapshotPath = path.join(process.cwd(), "data/snapshots/scoops1_2026-03-22.json");
    if (fs.existsSync(snapshotPath)) {
      const raw = JSON.parse(fs.readFileSync(snapshotPath, "utf-8")) as {
        threads: Array<{
          id: number;
          title_en: string;
          author: string | null;
          date: string;
          category: string;
        }>;
      };
      const seededIds = new Set(threadRows.map((t) => t.id));
      for (const t of raw.threads) {
        if (!seededIds.has(t.id)) {
          const stats = fabricateStats(t.id);
          const createdAt = parseDateToMs(t.date);
          threadRows.push({
            id: t.id,
            forumId: "scoops1",
            title: t.title_en,
            author: t.author ?? "Anonymous",
            content: t.title_en,
            excerpt: (t.title_en + " " + t.title_en + " " + t.title_en).slice(0, 200),
            category: mapCategory(t.category),
            viewCount: stats.viewCount,
            replyCount: stats.replyCount,
            createdAt,
            lastReplyAt: createdAt + ((t.id * 7919) % (4 * 60 * 60 * 1000)),
            lastReplyAuthor: `User${t.id % 20}`,
          });
          snapshotExtras++;
        }
      }
    }
  } catch (err) {
    console.warn("  Warning: could not read scoops1 snapshot JSON:", err);
  }

  // Insert in batches of 50 to avoid SQLite statement size limits
  const BATCH_SIZE = 50;
  for (let i = 0; i < threadRows.length; i += BATCH_SIZE) {
    const batch = threadRows.slice(i, i + BATCH_SIZE);
    await db.insert(threads).values(batch).onConflictDoNothing();
  }
  console.log(`  Threads: ${threadRows.length} rows (${snapshotExtras} from snapshot JSON)`);

  // ── 5. Seed posts ───────────────────────────────────────────────────────────

  interface PostRow {
    threadId: number;
    parentId: number | null;
    author: string;
    content: string;
    postNumber: number;
    createdAt: number;
  }

  const postRows: PostRow[] = [];
  for (const thread of threadRows) {
    // Original post (postNumber 0)
    postRows.push({
      threadId: thread.id,
      parentId: null,
      author: thread.author,
      content: thread.content,
      postNumber: 0,
      createdAt: thread.createdAt,
    });

    // 2-5 fabricated replies per thread
    const replyCount = 2 + (thread.id % 4); // 2, 3, 4, or 5
    for (let r = 1; r <= replyCount; r++) {
      const replyMs = thread.createdAt + r * ((thread.id * 1009) % (30 * 60 * 1000)); // up to 30min offsets
      postRows.push({
        threadId: thread.id,
        parentId: r === 1 ? null : 0, // first reply is top-level, rest chain from original
        author: `User${(thread.id + r) % 20}`,
        content: `Reply to: ${thread.title}`,
        postNumber: r,
        createdAt: replyMs,
      });
    }
  }

  // Insert posts in batches
  for (let i = 0; i < postRows.length; i += BATCH_SIZE) {
    const batch = postRows.slice(i, i + BATCH_SIZE);
    await db.insert(posts).values(batch).onConflictDoNothing();
  }
  console.log(`  Posts: ${postRows.length} rows`);

  // ── 6. Seed news_items ─────────────────────────────────────────────────────

  const newsRows = NEWS_SEED_DATA.map((item) => ({
    headline: item.headline,
    source: item.source,
    sourceIcon: item.sourceIcon,
    category: item.category,
    url: item.url,
    publishedAt: parseNewstimeToMs(item.time),
  }));

  // Also try to seed from enews snapshot
  let enewsExtras = 0;
  try {
    const enewsPath = path.join(process.cwd(), "data/snapshots/enews_2026-03-22.json");
    if (fs.existsSync(enewsPath)) {
      const raw = JSON.parse(fs.readFileSync(enewsPath, "utf-8")) as {
        headlines: Array<{ title: string; date: string }>;
        sources?: string[];
      };
      const existingHeadlines = new Set(newsRows.map((n) => n.headline));
      for (const h of raw.headlines) {
        if (!existingHeadlines.has(h.title)) {
          newsRows.push({
            headline: h.title,
            source: "Jerusalem Post",
            sourceIcon: "#1a1a2e",
            category: "news",
            url: "#",
            publishedAt: parseDateToMs(h.date + " 12:00"),
          });
          enewsExtras++;
        }
      }
    }
  } catch (err) {
    console.warn("  Warning: could not read enews snapshot JSON:", err);
  }

  for (let i = 0; i < newsRows.length; i += BATCH_SIZE) {
    const batch = newsRows.slice(i, i + BATCH_SIZE);
    await db.insert(newsItems).values(batch).onConflictDoNothing();
  }
  console.log(`  News items: ${newsRows.length} rows (${enewsExtras} from enews snapshot)`);

  // ── Summary ─────────────────────────────────────────────────────────────────

  console.log("\nSeeded:");
  console.log(`  ${forumRows.length} forums`);
  console.log(`  ${userRows.length} users`);
  console.log(`  ${threadRows.length} threads`);
  console.log(`  ${postRows.length} posts`);
  console.log(`  ${newsRows.length} news items`);
  console.log("\nDone.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
