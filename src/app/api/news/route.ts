import { NextResponse } from "next/server";
import { db } from "@/db";
import { newsItems } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { NewsItem } from "@/types/forum";

/**
 * Format a Unix timestamp (ms) into "HH:MM DD/MM" display string.
 */
function formatNewsTime(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${hh}:${min} ${dd}/${mm}`;
}

/**
 * GET /api/news
 *
 * Returns news items, optionally filtered by category.
 * Query params:
 *   - category: string (optional) — filter by news category
 *
 * Response shape: { items: NewsItem[] }
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const query = db.select().from(newsItems).orderBy(desc(newsItems.publishedAt));

    const rows = category
      ? await query.where(eq(newsItems.category, category))
      : await query;

    const items: NewsItem[] = rows.map((row) => ({
      id: row.id,
      headline: row.headline,
      time: formatNewsTime(row.publishedAt),
      source: row.source,
      sourceIcon: row.sourceIcon,
      category: row.category as NewsItem["category"],
      url: row.url,
    }));

    return NextResponse.json({ items });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch news items" }, { status: 500 });
  }
}
