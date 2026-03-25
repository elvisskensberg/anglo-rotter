/**
 * Thread seed data derived from data/threads/threads_with_comments_2026-03-22.json
 * Used for the thread detail page during dev/SSR.
 * NOTE: Scraped content is for private dev seeding only. Public launch must
 * use user-generated content. Do not commit to public repos.
 */

// ── Interfaces ──────────────────────────────────────────────────────────────

/** Original post data for the thread */
export interface ThreadPost {
  /** Numeric post ID (same as thread ID for original post) */
  id: number;
  /** Username of post author */
  author: string;
  /** Post content (English translation of original) */
  content: string;
  /** Post date in DD.MM.YY format */
  date: string;
  /** Post time in HH:MM format */
  time: string;
  /** Author member-since date in D.M.YY format */
  memberSince: string;
  /** Author total post count */
  postCount: number;
  /** Star rating 1-5 */
  starRating: number;
  /** Number of users who rated this post */
  ratersCount: number;
  /** Accumulated rating points */
  points: number;
}

/** Single item in the reply tree (pre-computed flat list) */
export interface ReplyTreeItem {
  /** Post number from original data */
  id: number;
  /** Sequential reply number displayed in the tree (post_number) */
  replyNumber: number;
  /** Reply title (thread title for depth-1, "Re: ..." for depth-2+) */
  title: string;
  /** Username of reply author */
  author: string;
  /** Reply date in DD.MM.YY format */
  date: string;
  /** Reply time in HH:MM format */
  time: string;
  /** Nesting depth: 1 = top-level reply, 2+ = nested reply */
  depth: number;
}

/** Complete thread data including original post and reply tree */
export interface ThreadData {
  /** Numeric thread ID */
  id: number;
  /** Forum slug (e.g. "scoops1") */
  forumId: string;
  /** Human-readable section name (e.g. "Scoops") */
  sectionName: string;
  /** Thread title */
  title: string;
  /** Original post */
  post: ThreadPost;
  /** Pre-computed flat reply tree (sorted by post_number) */
  replies: ReplyTreeItem[];
}

// ── Depth computation helper ─────────────────────────────────────────────────

/**
 * Compute depth for each post given reply_to chains.
 * depth 0 = original post (reply_to undefined or null)
 * depth 1 = direct reply to original post (reply_to: 0)
 * depth N = reply to a depth-(N-1) post
 */
function buildDepthMap(
  posts: Array<{ post_number: number; reply_to?: number | null }>
): Map<number, number> {
  const depths = new Map<number, number>();

  // Seed: original post is depth 0
  for (const post of posts) {
    if (post.reply_to === undefined || post.reply_to === null) {
      depths.set(post.post_number, 0);
    }
  }

  // BFS: resolve all remaining depths
  let changed = true;
  while (changed) {
    changed = false;
    for (const post of posts) {
      if (!depths.has(post.post_number) && post.reply_to !== undefined && post.reply_to !== null) {
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

// ── Thread 940165: Supreme Court refuses to broadcast hearing ────────────────
// Source: data/threads/threads_with_comments_2026-03-22.json key scoops1_940165

const THREAD_940165_TITLE = "Supreme Court refuses to broadcast hearing on aid organizations";

// Hebrew-named authors transliterated to English equivalents
function transliterateAuthor(author: string): string {
  const map: Record<string, string> = {
    "בחלם": "BaChalem",
    "גנוטי": "Gnoti",
    "קפסולה": "Capsule",
    "עדי": "Adi",
    "שונר": "Shoner",
    "סתם אחת": "JustOneUser",
    "השפוי האחרון": "TheLastSane",
    "אבן חן": "AvenChen",
    "יוסף": "Yosef",
  };
  return map[author] ?? author;
}

// Raw posts from scoops1_940165 (post_number + reply_to chain)
const RAW_940165 = [
  { post_number: 0, author: "mortzix", member_since: "1.3.26", author_post_count: "6555", reply_to: null, time: "14:00" },
  { post_number: 1, author: "Sidewinder", member_since: "27.9.07", author_post_count: "9649", reply_to: 0, time: "14:05" },
  { post_number: 2, author: "barry white", member_since: "31.5.12", author_post_count: "26021", reply_to: 0, time: "14:06" },
  { post_number: 3, author: "גנוטי", member_since: "24.3.20", author_post_count: "7531", reply_to: 0, time: "14:07" },
  { post_number: 4, author: "barry white", member_since: "31.5.12", author_post_count: "26021", reply_to: 1, time: "14:08" },
  { post_number: 5, author: "Sarek", member_since: "2.4.12", author_post_count: "15909", reply_to: 0, time: "14:09" },
  { post_number: 6, author: "בחלם", member_since: "2.4.12", author_post_count: "36672", reply_to: 0, time: "14:10" },
  { post_number: 7, author: "עדי", member_since: "6.9.19", author_post_count: "60302", reply_to: 0, time: "14:11" },
  { post_number: 8, author: "בחלם", member_since: "2.4.12", author_post_count: "36672", reply_to: 1, time: "14:12" },
  { post_number: 9, author: "קפסולה", member_since: "28.6.20", author_post_count: "14689", reply_to: 2, time: "14:13" },
  { post_number: 10, author: "בחלם", member_since: "2.4.12", author_post_count: "36672", reply_to: 7, time: "14:14" },
  { post_number: 11, author: "שונר", member_since: "30.11.16", author_post_count: "17892", reply_to: 0, time: "14:15" },
  { post_number: 12, author: "שונר", member_since: "30.11.16", author_post_count: "17892", reply_to: 7, time: "14:16" },
  { post_number: 13, author: "עדי", member_since: "6.9.19", author_post_count: "60302", reply_to: 10, time: "14:17" },
  { post_number: 14, author: "עדי", member_since: "6.9.19", author_post_count: "60302", reply_to: 12, time: "14:18" },
  { post_number: 15, author: "moto123", member_since: "30.5.12", author_post_count: "7675", reply_to: 0, time: "14:19" },
  { post_number: 16, author: "סתם אחת", member_since: "3.8.18", author_post_count: "39949", reply_to: 10, time: "14:20" },
  { post_number: 17, author: "BlackHawkIL", member_since: "18.9.16", author_post_count: "45558", reply_to: 0, time: "14:21" },
  { post_number: 18, author: "שונר", member_since: "30.11.16", author_post_count: "17892", reply_to: 13, time: "14:22" },
  { post_number: 19, author: "בחלם", member_since: "2.4.12", author_post_count: "36672", reply_to: 13, time: "14:23" },
  { post_number: 20, author: "OxBlood", member_since: "28.11.20", author_post_count: "1106", reply_to: 0, time: "14:24" },
  { post_number: 21, author: "בחלם", member_since: "2.4.12", author_post_count: "36672", reply_to: 16, time: "14:25" },
  { post_number: 22, author: "שונר", member_since: "30.11.16", author_post_count: "17892", reply_to: 14, time: "14:26" },
  { post_number: 23, author: "בחלם", member_since: "2.4.12", author_post_count: "36672", reply_to: 12, time: "14:27" },
  { post_number: 24, author: "shabor", member_since: "30.11.03", author_post_count: "58254", reply_to: 7, time: "14:28" },
  { post_number: 25, author: "ANTI-PC", member_since: "8.8.18", author_post_count: "25232", reply_to: 0, time: "14:29" },
  { post_number: 26, author: "אבן חן", member_since: "29.8.25", author_post_count: "58", reply_to: 0, time: "14:30" },
  { post_number: 27, author: "עדי", member_since: "6.9.19", author_post_count: "60302", reply_to: 0, time: "14:31" },
  { post_number: 28, author: "hutznik", member_since: "2.4.12", author_post_count: "31531", reply_to: 0, time: "14:32" },
  { post_number: 29, author: "יוסף", member_since: "29.3.18", author_post_count: "44716", reply_to: 0, time: "14:33" },
  { post_number: 30, author: "השפוי האחרון", member_since: "14.10.22", author_post_count: "21345", reply_to: 1, time: "14:34" },
  { post_number: 31, author: "boynet", member_since: "1.4.12", author_post_count: "23526", reply_to: 5, time: "14:35" },
  { post_number: 32, author: "Sarek", member_since: "2.4.12", author_post_count: "15909", reply_to: 31, time: "14:36" },
  { post_number: 33, author: "boynet", member_since: "1.4.12", author_post_count: "23526", reply_to: 32, time: "14:37" },
  { post_number: 34, author: "Sarek", member_since: "2.4.12", author_post_count: "15909", reply_to: 33, time: "14:38" },
  { post_number: 35, author: "boynet", member_since: "1.4.12", author_post_count: "23526", reply_to: 34, time: "14:39" },
];

function buildThread940165(): ThreadData {
  const depthMap = buildDepthMap(RAW_940165);

  // Build replies (all posts except post_number 0)
  const replies: ReplyTreeItem[] = RAW_940165.filter((p) => p.post_number !== 0)
    .sort((a, b) => a.post_number - b.post_number)
    .map((p) => {
      const depth = depthMap.get(p.post_number) ?? 1;
      const title =
        depth === 1
          ? THREAD_940165_TITLE.slice(0, 60)
          : `Re: ${THREAD_940165_TITLE}`.slice(0, 60);
      return {
        id: p.post_number,
        replyNumber: p.post_number,
        title,
        author: transliterateAuthor(p.author),
        date: "22.03.26",
        time: p.time,
        depth,
      };
    });

  return {
    id: 940165,
    forumId: "scoops1",
    sectionName: "Scoops",
    title: THREAD_940165_TITLE,
    post: {
      id: 940165,
      author: "mortzix",
      content:
        "Quietly, quietly — the Supreme Court refuses to allow broadcasting of a hearing on a petition by aid organizations that are refusing Israel's request to provide details about their workers. The hearing will be held tomorrow at 9:00 AM.",
      date: "22.03.26",
      time: "14:00",
      memberSince: "1.3.26",
      postCount: 6555,
      starRating: 3,
      ratersCount: 45,
      points: 120,
    },
    replies,
  };
}

// ── Thread 940099: Casualty update from Arad ────────────────────────────────
// Simpler seed thread with 6 replies and max depth 2

const THREAD_940099_TITLE = "Casualty update from Arad - Prof. Dan Schwarzfuchs";

function buildThread940099(): ThreadData {
  const RAW_940099 = [
    { post_number: 0, reply_to: null },
    { post_number: 1, reply_to: 0 },
    { post_number: 2, reply_to: 0 },
    { post_number: 3, reply_to: 1 },
    { post_number: 4, reply_to: 1 },
    { post_number: 5, reply_to: 0 },
    { post_number: 6, reply_to: 2 },
  ];

  const depthMap = buildDepthMap(RAW_940099);

  const authors940099 = ["NewsDesk", "SkyWatch", "GroundZero", "Mamani", "TelAvivNow", "InfoStream"];

  const replies: ReplyTreeItem[] = RAW_940099.filter((p) => p.post_number !== 0)
    .sort((a, b) => a.post_number - b.post_number)
    .map((p, i) => {
      const depth = depthMap.get(p.post_number) ?? 1;
      const title =
        depth === 1
          ? THREAD_940099_TITLE.slice(0, 60)
          : `Re: ${THREAD_940099_TITLE}`.slice(0, 60);
      const baseTime = 14 + i;
      return {
        id: p.post_number,
        replyNumber: p.post_number,
        title,
        author: authors940099[i % authors940099.length] ?? "User",
        date: "22.03.26",
        time: `${String(baseTime).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
        depth,
      };
    });

  return {
    id: 940099,
    forumId: "scoops1",
    sectionName: "Scoops",
    title: THREAD_940099_TITLE,
    post: {
      id: 940099,
      author: "dj_deep",
      content:
        "Updated casualty report from Arad following the Iranian missile strike. Professor Dan Schwarzfuchs provides medical assessment of casualties treated at Soroka Medical Center.",
      date: "22.03.26",
      time: "13:00",
      memberSince: "15.1.24",
      postCount: 1200,
      starRating: 2,
      ratersCount: 18,
      points: 45,
    },
    replies,
  };
}

// ── Export ───────────────────────────────────────────────────────────────────

export const THREAD_SEED: ThreadData[] = [buildThread940165(), buildThread940099()];
