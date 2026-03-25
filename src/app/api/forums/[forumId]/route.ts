import { NextResponse } from "next/server";
import { db } from "@/db";
import { threads } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { ForumListing } from "@/types/forum";

/**
 * Format a Unix timestamp (ms) into separate date and time strings.
 */
function formatDate(ts: number): { date: string; time: string } {
  const d = new Date(ts);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return { date: `${dd}.${mm}.${yy}`, time: `${hh}:${min}` };
}

interface RouteParams {
  params: Promise<{ forumId: string }>;
}

/**
 * GET /api/forums/[forumId]
 *
 * Returns threads for the given forum section, ordered by createdAt descending.
 * Response shape: { threads: ForumListing[], total: number }
 */
export async function GET(_request: Request, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { forumId } = await params;

    const rows = await db
      .select()
      .from(threads)
      .where(eq(threads.forumId, forumId))
      .orderBy(desc(threads.createdAt));

    const transformed: ForumListing[] = rows.map((thread) => {
      const created = formatDate(thread.createdAt);
      const lastReply = thread.lastReplyAt ? formatDate(thread.lastReplyAt) : null;

      return {
        id: thread.id,
        title: thread.title,
        author: thread.author,
        date: created.date,
        time: created.time,
        lastReplyDate: lastReply ? lastReply.date : created.date,
        lastReplyTime: lastReply ? lastReply.time : "00:00",
        lastReplyAuthor: thread.lastReplyAuthor ?? "Anonymous",
        lastReplyNum: thread.replyCount,
        replyCount: thread.replyCount,
        viewCount: thread.viewCount,
        excerpt: thread.excerpt ?? thread.title,
        category: thread.category,
        url: `/thread/${thread.id}`,
      };
    });

    return NextResponse.json({ threads: transformed, total: transformed.length });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch forum threads" }, { status: 500 });
  }
}
