/**
 * Homepage seed data extracted from data/snapshots/scoops1_2026-03-22.json
 * Used for BreakingNewsFeed and TickerSidebar components during dev/SSR.
 * NOTE: Scraped content is for private dev seeding only. Public launch must
 * use user-generated content. Do not commit to public repos.
 */

export interface HomepageSeedItem {
  /** Display time string, e.g. "18:42" or "00:00" if no time in date field */
  time: string;
  /** English headline text */
  headline: string;
  /** Local path, e.g. /forum/scoops1/940171 */
  url: string;
}

export interface TickerSeedItem {
  /** Display date string, e.g. "03/22 18:42" */
  date: string;
  /** Short headline text for ticker display */
  text: string;
  /** Category label shown in parentheses */
  category: string;
  /** Local path */
  url: string;
}

/**
 * Extract HH:MM time from a date string like "22/03/2026 18:42".
 * Returns "00:00" if no time portion present.
 */
function extractTime(dateStr: string): string {
  const parts = dateStr.split(" ");
  if (parts.length >= 2 && parts[1]) {
    return parts[1];
  }
  return "00:00";
}

/** 20 breaking news headlines from the scoops1 snapshot (2026-03-22) */
export const HOMEPAGE_SEED: HomepageSeedItem[] = [
  {
    time: extractTime("22/03/2026 18:42"),
    headline: "Red Alert (18:42): Shlomi, Mateh Asher, Ma'ale Yosef",
    url: "/forum/scoops1/940171",
  },
  {
    time: extractTime("22/03/2026 18:42"),
    headline: "UAV infiltration (18:42): Yirka, Ma'alot-Tarshiha, Ma'ale Yosef, Mateh Asher",
    url: "/forum/scoops1/940169",
  },
  {
    time: extractTime("22/03/2026"),
    headline: "Smotrich at funeral: We will collapse the PA",
    url: "/forum/scoops1/940168",
  },
  {
    time: extractTime("22/03/2026"),
    headline: "Supreme Court refuses to broadcast hearing on aid organizations",
    url: "/forum/scoops1/940165",
  },
  {
    time: extractTime("22/03/2026"),
    headline: "AG to Police Commissioner: Stop Ben Gvir's Incitement Division immediately",
    url: "/forum/scoops1/940154",
  },
  {
    time: extractTime("22/03/2026"),
    headline: "Yair Golan arrived at missile impact site in Dimona and was chased away",
    url: "/forum/scoops1/940152",
  },
  {
    time: extractTime("22/03/2026"),
    headline: "IDF investigating if Ofer Moskovitz was killed by friendly fire at Misgav Am",
    url: "/forum/scoops1/940151",
  },
  {
    time: extractTime("22/03/2026"),
    headline: "Professionals recommend closing Ben Gurion Airport immediately",
    url: "/forum/scoops1/940140",
  },
  {
    time: extractTime("22/03/2026 18:21"),
    headline: "Alerts for launches from Iran toward south (18:21)",
    url: "/forum/scoops1/940138",
  },
  {
    time: extractTime("22/03/2026"),
    headline: "Ultra-Orthodox blocking light rail in Jerusalem",
    url: "/forum/scoops1/940137",
  },
  {
    time: extractTime("22/03/2026"),
    headline: "Updating thread on strikes in Iran",
    url: "/forum/scoops1/940128",
  },
  {
    time: extractTime("22/03/2026"),
    headline: "Casualty update from Arad - Prof. Dan Schwarzfuchs",
    url: "/forum/scoops1/940099",
  },
  {
    time: extractTime("22/03/2026"),
    headline: "Former Obama official: Netanyahu is a liar because Khamenei issued fatwa against nuclear weapons",
    url: "/forum/scoops1/unknown-1",
  },
  {
    time: extractTime("22/03/2026"),
    headline: "Trump: Now with Iran's death, America's greatest enemy is the Democratic Party",
    url: "/forum/scoops1/unknown-2",
  },
  {
    time: extractTime("22/03/2026"),
    headline: "Watch: Direct hit on beach in central Israel",
    url: "/forum/scoops1/unknown-3",
  },
  {
    time: extractTime("22/03/2026"),
    headline: "Netanyahu in Arad: If everyone entered shelters, nobody would have been hurt",
    url: "/forum/scoops1/unknown-4",
  },
  {
    time: extractTime("22/03/2026"),
    headline: "IRGC: If Trump follows through on threats, we will fully close Strait of Hormuz",
    url: "/forum/scoops1/unknown-5",
  },
  {
    time: extractTime("22/03/2026"),
    headline: "Initial investigation: US THAAD system was supposed to intercept Arad missile but missed",
    url: "/forum/scoops1/unknown-6",
  },
  {
    time: extractTime("22/03/2026"),
    headline: "Israeli flag raised in Shiite village al-Khiam in south Lebanon",
    url: "/forum/scoops1/unknown-7",
  },
  {
    time: extractTime("22/03/2026"),
    headline: "Qatar trying to prevent escalation; Saudi/UAE want US to continue",
    url: "/forum/scoops1/unknown-8",
  },
];

/** 10 ticker items for the left sidebar scrolling feed */
export const TICKER_SEED: TickerSeedItem[] = [
  {
    date: "03/22 18:42",
    text: "Red Alert: Shlomi, Mateh Asher",
    category: "Security",
    url: "/forum/scoops1/940171",
  },
  {
    date: "03/22 18:42",
    text: "UAV infiltration: Northern communities",
    category: "Security",
    url: "/forum/scoops1/940169",
  },
  {
    date: "03/22 18:21",
    text: "Alerts for launches from Iran toward south",
    category: "Security",
    url: "/forum/scoops1/940138",
  },
  {
    date: "03/22 18:00",
    text: "Smotrich: We will collapse the PA",
    category: "Politics",
    url: "/forum/scoops1/940168",
  },
  {
    date: "03/22 17:45",
    text: "AG orders halt to Ben Gvir's Incitement Division",
    category: "Politics",
    url: "/forum/scoops1/940154",
  },
  {
    date: "03/22 17:30",
    text: "IDF investigating friendly fire incident at Misgav Am",
    category: "Military",
    url: "/forum/scoops1/940151",
  },
  {
    date: "03/22 17:15",
    text: "Professionals recommend closing Ben Gurion Airport",
    category: "Security",
    url: "/forum/scoops1/940140",
  },
  {
    date: "03/22 17:00",
    text: "Ultra-Orthodox blocking light rail in Jerusalem",
    category: "Domestic",
    url: "/forum/scoops1/940137",
  },
  {
    date: "03/22 16:45",
    text: "US THAAD missed Arad missile interception",
    category: "Military",
    url: "/forum/scoops1/unknown-6",
  },
  {
    date: "03/22 16:30",
    text: "Qatar trying to prevent US-Iran escalation",
    category: "International",
    url: "/forum/scoops1/unknown-8",
  },
];
