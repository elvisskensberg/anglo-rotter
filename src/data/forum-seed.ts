/**
 * Forum seed data derived from data/snapshots/scoops1_2026-03-22.json
 * Used for ForumThreadTable component during dev/SSR.
 * NOTE: Scraped content is for private dev seeding only. Public launch must
 * use user-generated content. Do not commit to public repos.
 */

export interface ForumThread {
  /** Numeric thread ID */
  id: number;
  /** English thread title */
  title: string;
  /** Username of post author */
  author: string;
  /** Post date in DD.MM.YY format */
  date: string;
  /** Post time in HH:MM format (displayed in red) */
  time: string;
  /** Last reply date in DD.MM.YY format */
  lastReplyDate: string;
  /** Last reply time in HH:MM format */
  lastReplyTime: string;
  /** Username of last reply author */
  lastReplyAuthor: string;
  /** Sequential reply number of last reply */
  lastReplyNum: number;
  /** Total reply count */
  replyCount: number;
  /** Total view count */
  viewCount: number;
  /** First ~200 chars of post content for tooltip display */
  excerpt: string;
  /** Forum section category */
  category: "scoops" | "politics" | "media" | "economy" | "sports" | "culture";
  /** Local route path */
  url: string;
}

/**
 * Parse date string "DD/MM/YYYY HH:MM" → { date: "DD.MM.YY", time: "HH:MM" }
 */
function parseDate(dateStr: string): { date: string; time: string } {
  const parts = dateStr.trim().split(" ");
  const datePart = parts[0] ?? "22/03/2026";
  const timePart = parts[1] ?? "00:00";
  const [day, month, year] = datePart.split("/");
  const yy = (year ?? "2026").slice(-2);
  return {
    date: `${day ?? "22"}.${month ?? "03"}.${yy}`,
    time: timePart,
  };
}

/**
 * Deterministic stats generator based on thread ID.
 * ~5% fire (views > 10000), ~15% hot (views 2000-4000), ~80% normal (views 100-999)
 */
function fabricateStats(threadId: number): { viewCount: number; replyCount: number } {
  const mod = threadId % 100;
  let viewCount: number;
  if (mod < 5) {
    // ~5% fire state
    viewCount = 10000 + ((threadId * 137) % 8000);
  } else if (mod < 20) {
    // ~15% hot state
    viewCount = 2000 + ((threadId * 73) % 2000);
  } else {
    // ~80% normal state
    viewCount = 100 + ((threadId * 41) % 900);
  }
  const replyCount = Math.floor(viewCount / 80);
  return { viewCount, replyCount };
}

/**
 * Map snapshot category strings to ForumThread category union.
 * Categories not mapping cleanly fall back to 'scoops'.
 */
function mapCategory(raw: string): ForumThread["category"] {
  const map: Record<string, ForumThread["category"]> = {
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

// Base thread data from scoops1_2026-03-22.json — 50 threads
const SNAPSHOT_THREADS: Array<{
  id: number | null;
  title_en: string;
  author: string | null;
  date: string;
  category: string;
}> = [
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

// Additional fabricated threads for politics, media, economy, sports, culture categories.
// IDs are chosen so that threadId % 100 puts ~5% in fire range (< 5) and ~15% in hot range (5-19),
// giving the required distribution across the full 66-thread seed.
const EXTRA_THREADS: Array<{
  id: number;
  title_en: string;
  author: string;
  date: string;
  category: string;
}> = [
  // Fire-state threads (id % 100 < 5) — ensures >= 3 fire threads
  { id: 800000, title_en: "BREAKING: Mass missile barrage targets Tel Aviv metropolitan area", author: "NewsDesk", date: "22/03/2026", category: "security_alert" },
  { id: 800001, title_en: "LIVE: Situation updates — Iranian strike campaign on Israeli cities", author: "Izhack111", date: "22/03/2026", category: "military" },
  { id: 800002, title_en: "CONFIRMED: Israeli retaliation strikes on Tehran infrastructure", author: "MiddleEast", date: "22/03/2026", category: "military" },
  { id: 800003, title_en: "US declares highest terror alert level; evacuates embassy staff from region", author: "NichusMuskhal", date: "22/03/2026", category: "international" },
  { id: 800004, title_en: "Multiple explosions reported in central Haifa, emergency declared", author: "HashOlef", date: "22/03/2026", category: "security_alert" },
  // Hot-state threads (id % 100 in 5-19) — ensures >= 9 total hot threads
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
  // Normal-state threads for remaining categories
  { id: 800020, title_en: "Israeli national football team match postponed due to security situation", author: "SportsDesk", date: "22/03/2026", category: "sports" },
  { id: 800021, title_en: "UEFA grants Israel postponement on all upcoming fixtures", author: "SportsDesk", date: "21/03/2026", category: "sports" },
  { id: 800022, title_en: "Maccabi Tel Aviv practice cancelled as players seek safety in shelters", author: "SportsDesk", date: "22/03/2026", category: "sports" },
  { id: 800023, title_en: "Tel Aviv museums close indefinitely following missile strikes", author: "CultureDesk", date: "22/03/2026", category: "culture" },
  { id: 800024, title_en: "Artists release solidarity album supporting displaced families", author: "CultureDesk", date: "21/03/2026", category: "culture" },
  { id: 800025, title_en: "Film festival postponed until further notice citing safety concerns", author: "CultureDesk", date: "20/03/2026", category: "culture" },
];

/**
 * Build a full ForumThread from raw snapshot data.
 */
function buildThread(
  raw: { id: number | null; title_en: string; author: string | null; date: string; category: string },
  index: number
): ForumThread {
  const resolvedId = raw.id ?? 900100 + index;
  const { date, time } = parseDate(raw.date);
  const stats = fabricateStats(resolvedId);
  const lastReplyNum = Math.max(1, stats.replyCount);
  const lastReplyAuthorNum = resolvedId % 20;

  return {
    id: resolvedId,
    title: raw.title_en,
    author: raw.author ?? "Anonymous",
    date,
    time,
    lastReplyDate: date,
    lastReplyTime: `${String(Math.floor((resolvedId * 7) % 24)).padStart(2, "0")}:${String(Math.floor((resolvedId * 13) % 60)).padStart(2, "0")}`,
    lastReplyAuthor: `User${lastReplyAuthorNum}`,
    lastReplyNum,
    replyCount: stats.replyCount,
    viewCount: stats.viewCount,
    excerpt: raw.title_en.length >= 200
      ? raw.title_en
      : (raw.title_en + " " + raw.title_en + " " + raw.title_en).slice(0, 200),
    category: mapCategory(raw.category),
    url: `/thread/${resolvedId}`,
  };
}

export const FORUM_SEED: ForumThread[] = [
  ...SNAPSHOT_THREADS.map((raw, i) => buildThread(raw, i)),
  ...EXTRA_THREADS.map((raw, i) => buildThread(raw, SNAPSHOT_THREADS.length + i)),
];
