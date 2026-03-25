import { NextRequest, NextResponse } from "next/server";
import { scrapeForumListing } from "@/lib/scraper";

/**
 * POST /api/scrape
 *
 * Triggers a full scrape of Rotter.net forum listing and English news,
 * upserting results into the Turso database.
 *
 * Authentication: Authorization: Bearer {CRON_SECRET}
 * Returns: { ok: true, stats: ScrapeResult } on success
 *          { error: string } on auth failure or crash
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Validate CRON_SECRET is configured
  const expectedSecret = process.env.CRON_SECRET;
  if (!expectedSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 500 }
    );
  }

  // Check Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Run the scraper
  try {
    const result = await scrapeForumListing();
    return NextResponse.json({
      ok: true,
      stats: {
        threadsAdded: result.threadsAdded,
        threadsUpdated: result.threadsUpdated,
        newsAdded: result.newsAdded,
        errors: result.errors,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Scrape failed", details: String(err) },
      { status: 500 }
    );
  }
}
