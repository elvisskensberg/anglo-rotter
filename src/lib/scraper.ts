/**
 * Rotter.net content scraper pipeline.
 * Fetches forum listing HTML (windows-1255 encoded), parses thread data,
 * and upserts into the Turso database via Drizzle ORM.
 */

import * as cheerio from "cheerio";
import * as iconv from "iconv-lite";
import { db } from "@/db";
import { threads, newsItems } from "@/db/schema";

const ROTTER_FORUM_URL =
  "https://rotter.net/cgi-bin/forum/dcboard.cgi?az=list&forum=scoops1";
const ROTTER_ENEWS_URL = "https://rotter.net/enews/news.php";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

export interface ScrapeResult {
  threadsAdded: number;
  threadsUpdated: number;
  newsAdded: number;
  errors: string[];
}

/**
 * Parse a Rotter date string "DD/MM/YYYY HH:MM" or "DD/MM/YYYY" into a Unix ms timestamp.
 */
function parseDateToTimestamp(dateStr: string): number {
  if (!dateStr) return Date.now();
  const parts = dateStr.trim().split(" ");
  const datePart = parts[0] ?? "";
  const timePart = parts[1] ?? "00:00";
  const [dd, mm, yyyy] = datePart.split("/");
  const [hh, min] = timePart.split(":");
  const d = new Date(
    parseInt(yyyy ?? "2026", 10),
    parseInt(mm ?? "1", 10) - 1,
    parseInt(dd ?? "1", 10),
    parseInt(hh ?? "0", 10),
    parseInt(min ?? "0", 10)
  );
  return isNaN(d.getTime()) ? Date.now() : d.getTime();
}

/**
 * Scrape the Rotter.net forum listing and English news, then upsert into DB.
 * This is the main entry point called by POST /api/scrape.
 */
export async function scrapeForumListing(): Promise<ScrapeResult> {
  const result: ScrapeResult = {
    threadsAdded: 0,
    threadsUpdated: 0,
    newsAdded: 0,
    errors: [],
  };

  // --- Scrape forum threads ---
  try {
    const response = await fetch(ROTTER_FORUM_URL, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!response.ok) {
      result.errors.push(`Forum fetch returned HTTP ${response.status}`);
    } else {
      // Rotter uses windows-1255 encoding — decode via iconv-lite
      const buffer = Buffer.from(await response.arrayBuffer());
      const html = iconv.decode(buffer, "windows-1255");
      const $ = cheerio.load(html);

      interface ParsedThread {
        id: number;
        title: string;
        author: string;
        createdAt: number;
        lastReplyAt: number | null;
        lastReplyAuthor: string | null;
        replyCount: number;
        viewCount: number;
        category: string;
      }

      const parsedThreads: ParsedThread[] = [];

      // Rotter forum listing: each thread row links to /forum/scoops1/NNNNN.shtml
      // The table row contains: [icon] [title link] [author] [date] [replies] [views]
      $("a[href*='/forum/scoops1/']").each((_, el) => {
        const href = $(el).attr("href") ?? "";
        const match = href.match(/\/forum\/scoops1\/(\d+)\.shtml/);
        if (!match) return;

        const threadId = parseInt(match[1] ?? "0", 10);
        const title = $(el).text().trim();
        if (!title || isNaN(threadId) || threadId === 0) return;

        // Walk up to the table row to extract metadata columns
        const row = $(el).closest("tr");
        const cells = row.find("td");

        const author = cells.eq(2).text().trim() || "Anonymous";
        const dateStr = cells.eq(3).text().trim();
        const replyStr = cells.eq(4).text().trim();
        const viewStr = cells.eq(5).text().trim();

        const createdAt = parseDateToTimestamp(dateStr);
        const replyCount = parseInt(replyStr, 10) || 0;
        const viewCount = parseInt(viewStr.replace(/,/g, ""), 10) || 0;

        parsedThreads.push({
          id: threadId,
          title,
          author,
          createdAt,
          lastReplyAt: null,
          lastReplyAuthor: null,
          replyCount,
          viewCount,
          category: "scoops",
        });
      });

      // Upsert each thread — insert new, update title/author on conflict
      for (const t of parsedThreads) {
        try {
          const existing = await db.query.threads.findFirst({
            where: (tbl, { eq }) => eq(tbl.id, t.id),
            columns: { id: true },
          });

          await db
            .insert(threads)
            .values({
              id: t.id,
              forumId: "scoops1",
              title: t.title,
              author: t.author,
              content: t.title, // Full content requires per-thread scraping (future phase)
              excerpt: t.title.slice(0, 200),
              category: t.category,
              viewCount: t.viewCount,
              replyCount: t.replyCount,
              createdAt: t.createdAt,
              lastReplyAt: t.lastReplyAt,
              lastReplyAuthor: t.lastReplyAuthor,
            })
            .onConflictDoUpdate({
              target: threads.id,
              set: {
                title: t.title,
                author: t.author,
                viewCount: t.viewCount,
                replyCount: t.replyCount,
              },
            });

          if (existing) {
            result.threadsUpdated++;
          } else {
            result.threadsAdded++;
          }
        } catch (err) {
          result.errors.push(`Thread ${t.id}: ${String(err)}`);
        }
      }
    }
  } catch (err) {
    result.errors.push(`Forum scrape failed: ${String(err)}`);
  }

  // --- Scrape English news ---
  try {
    const response = await fetch(ROTTER_ENEWS_URL, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!response.ok) {
      result.errors.push(`News fetch returned HTTP ${response.status}`);
    } else {
      const html = await response.text(); // English news is UTF-8
      const $ = cheerio.load(html);

      // English news page: rows with time, headline, source columns
      $("tr").each((_, el) => {
        const cells = $(el).find("td");
        if (cells.length < 2) return;

        // Try to find the headline link
        const linkEl = $(el).find("a").first();
        const headline = linkEl.text().trim() || cells.eq(1).text().trim();
        if (!headline || headline.length < 5) return;

        const url = linkEl.attr("href") || "#";
        const source = cells.last().text().trim() || "Unknown";
        const timeStr = cells.eq(0).text().trim();

        // Determine category from time cell or class hints
        const category = "news";

        // Build publishedAt from time string if available
        let publishedAt = Date.now();
        if (timeStr && /^\d{1,2}:\d{2}$/.test(timeStr)) {
          const today = new Date();
          const [hh, min] = timeStr.split(":");
          today.setHours(parseInt(hh ?? "0", 10), parseInt(min ?? "0", 10), 0, 0);
          publishedAt = today.getTime();
        }

        db.insert(newsItems)
          .values({
            headline,
            source: source.slice(0, 100),
            sourceIcon: "#555555",
            category,
            url: url.startsWith("http") ? url : `https://rotter.net${url}`,
            publishedAt,
          })
          .onConflictDoNothing()
          .catch(() => {
            // Silently ignore duplicate news items
          });

        result.newsAdded++;
      });
    }
  } catch (err) {
    result.errors.push(`News scrape failed: ${String(err)}`);
  }

  // Trigger push notification if new news items were added
  if (result.newsAdded > 0) {
    try {
      const pushUrl = process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/push/send`
        : "http://localhost:3000/api/push/send";
      await fetch(pushUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
        body: JSON.stringify({
          title: "MultiRotter: Breaking News",
          body: `${result.newsAdded} new news item${result.newsAdded > 1 ? "s" : ""} just dropped`,
          url: "/news",
        }),
      });
    } catch {
      result.errors.push("Push notification dispatch failed");
    }
  }

  return result;
}
