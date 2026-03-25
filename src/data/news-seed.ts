/**
 * News Flash seed data for the news page.
 * Used for NewsTable and NewsPageLayout components during dev/SSR.
 * NOTE: Fabricated but realistic headlines. Public launch must use live data.
 */

export type NewsCategory = "news" | "sports" | "economy" | "tech";

export const NEWS_CATEGORIES = ["news", "sports", "economy", "tech"] as const;

export interface NewsItem {
  /** Numeric item ID */
  id: number;
  /** English news headline */
  headline: string;
  /** Display time in "HH:MM DD/MM" format */
  time: string;
  /** News source name (e.g. "Ynet", "Maariv") */
  source: string;
  /**
   * Hex color representing the source's brand color.
   * Rendered as a colored circle icon in the table.
   */
  sourceIcon: string;
  /** Content category */
  category: NewsCategory;
  /** External link URL (or "#" placeholder) */
  url: string;
}

/**
 * Source color palette — one hex per outlet.
 * Used as colored circle icon placeholder in the news table.
 */
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

/**
 * Helper to build a NewsItem with the source color resolved automatically.
 */
function item(
  id: number,
  headline: string,
  time: string,
  source: keyof typeof SOURCE_COLORS,
  category: NewsCategory,
  url: string = "#"
): NewsItem {
  return {
    id,
    headline,
    time,
    source,
    sourceIcon: SOURCE_COLORS[source] ?? "#555555",
    category,
    url,
  };
}

/**
 * 32 seed items across 4 categories (8+ each).
 * Times are descending from 19:56 22/03 → 14:30 22/03.
 */
export const NEWS_SEED: NewsItem[] = [
  // ── NEWS (8 items) ──────────────────────────────────────────────────────
  item(1, "Iran fires 12 ballistic missiles toward Israeli cities in overnight barrage", "19:56 22/03", "Ynet", "news"),
  item(2, "Security cabinet convenes emergency session following Arad and Dimona strikes", "19:40 22/03", "Maariv", "news"),
  item(3, "IDF confirms interception of 43 of 50 rockets in latest barrage over northern Israel", "19:22 22/03", "Israel Today", "news"),
  item(4, "Ben Gurion Airport closed: missile fragments discovered on main runway", "19:05 22/03", "Walla", "news"),
  item(5, "US carrier strike group enters eastern Mediterranean in show of support", "18:48 22/03", "Channel 7", "news"),
  item(6, "UN Security Council calls emergency meeting on Israel-Iran escalation", "18:30 22/03", "Israel Defense", "news"),
  item(7, "Red Alert sirens sound across Haifa Bay, residents urged to enter shelters", "17:55 22/03", "Ynet", "news"),
  item(8, "Netanyahu addresses nation: We will respond forcefully to any further aggression", "17:20 22/03", "Maariv", "news"),

  // ── SPORTS (8 items) ────────────────────────────────────────────────────
  item(9, "UEFA postpones all Israeli club fixtures pending security situation assessment", "19:50 22/03", "Ynet", "sports"),
  item(10, "Maccabi Tel Aviv basketball practice suspended as players shelter in safe rooms", "19:35 22/03", "Israel Today", "sports"),
  item(11, "Israeli national football team match against Denmark called off with 48 hours notice", "19:10 22/03", "Channel 7", "sports"),
  item(12, "Hapoel Be'er Sheva striker returns from loan to help club amid crisis", "18:55 22/03", "Globes", "sports"),
  item(13, "Israeli Olympic committee holds emergency board meeting over Tokyo qualifier status", "18:25 22/03", "Walla", "sports"),
  item(14, "Maccabi Haifa announces stadium unavailable following infrastructure damage", "17:48 22/03", "Ynet", "sports"),
  item(15, "Israeli tennis player advances to quarterfinals despite travel disruptions", "17:15 22/03", "Maariv", "sports"),
  item(16, "Premier League clubs extend contracts for Israeli players due to force majeure", "16:40 22/03", "Israel Today", "sports"),

  // ── ECONOMY (8 items) ────────────────────────────────────────────────────
  item(17, "Tel Aviv Stock Exchange halts trading after 8.3% plunge at opening bell", "19:45 22/03", "Globes", "economy"),
  item(18, "Shekel falls to six-year low against dollar amid security escalation fears", "19:28 22/03", "Calcalist", "economy"),
  item(19, "Finance Ministry approves emergency 50-billion-shekel war budget supplement", "19:00 22/03", "Globes", "economy"),
  item(20, "War cost estimate rises to 1.2 billion shekels per day, Finance Ministry says", "18:40 22/03", "Calcalist", "economy"),
  item(21, "Tourism industry reports 97% booking cancellation rate for April and May", "18:10 22/03", "Walla", "economy"),
  item(22, "Insurance companies suspend new policies in northern and southern conflict zones", "17:38 22/03", "Globes", "economy"),
  item(23, "Bank of Israel intervenes in forex market to defend shekel floor", "16:55 22/03", "Calcalist", "economy"),
  item(24, "Tech sector exports decline 12% as overseas clients invoke force majeure clauses", "16:10 22/03", "Globes", "economy"),

  // ── TECH (8 items) ──────────────────────────────────────────────────────
  item(25, "Elon Musk announces Terafab semiconductor gigafactory project, details sparse", "19:52 22/03", "Calcalist", "tech"),
  item(26, "Israeli startup Mobileye pauses autonomous vehicle road tests in affected regions", "19:30 22/03", "Globes", "tech"),
  item(27, "Cyber Division detects surge in Iranian phishing campaigns targeting infrastructure", "19:12 22/03", "Israel Defense", "tech"),
  item(28, "SentinelOne faces investor backlash over funding of Replit whose CEO backed Gaza campaign", "18:50 22/03", "Calcalist", "tech"),
  item(29, "Check Point warns of DDoS attacks targeting Israeli banking and government portals", "18:20 22/03", "Israel Today", "tech"),
  item(30, "Waze reroutes millions of Israeli commuters in real time around road closures", "17:40 22/03", "Walla", "tech"),
  item(31, "Intel Haifa R&D center switches to remote work as precautionary measure", "16:30 22/03", "Globes", "tech"),
  item(32, "Iron Dome fire-control software upgrade credited with higher interception rate", "14:30 22/03", "Israel Defense", "tech"),
];
