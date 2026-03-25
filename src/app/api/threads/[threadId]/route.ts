import { NextResponse } from "next/server";
import { db } from "@/db";
import { threads, posts, users } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import type { ThreadData, ThreadPost, ReplyTreeItem } from "@/data/thread-seed";

/**
 * Map forum IDs to human-readable section names.
 */
const FORUM_SECTION_NAMES: Record<string, string> = {
  scoops1: "Scoops",
  politics: "Politics",
  media: "Media",
  economy: "Economy",
  sports: "Sports",
  culture: "Culture",
};

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

/**
 * Compute nesting depth for each post using BFS from parentId chains.
 * depth 0 = original post (parentId is null)
 * depth 1 = direct reply to original post
 * depth N = reply to a depth-(N-1) post
 */
function buildDepthMap(
  postRows: Array<{ postNumber: number; parentId: number | null }>
): Map<number, number> {
  const depths = new Map<number, number>();

  // Seed: posts with no parent are depth 0
  for (const post of postRows) {
    if (post.parentId === null) {
      depths.set(post.postNumber, 0);
    }
  }

  // BFS: resolve remaining depths iteratively
  let changed = true;
  while (changed) {
    changed = false;
    for (const post of postRows) {
      if (!depths.has(post.postNumber) && post.parentId !== null) {
        const parentDepth = depths.get(post.parentId);
        if (parentDepth !== undefined) {
          depths.set(post.postNumber, parentDepth + 1);
          changed = true;
        }
      }
    }
  }

  return depths;
}

interface RouteParams {
  params: Promise<{ threadId: string }>;
}

/**
 * GET /api/threads/[threadId]
 *
 * Returns a single thread with its original post and flat reply tree.
 * Response shape: ThreadData (id, forumId, sectionName, title, post, replies)
 */
export async function GET(_request: Request, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { threadId } = await params;
    const threadIdNum = parseInt(threadId, 10);

    if (isNaN(threadIdNum)) {
      return NextResponse.json({ error: "Invalid thread ID" }, { status: 400 });
    }

    // Fetch thread row
    const [thread] = await db.select().from(threads).where(eq(threads.id, threadIdNum)).limit(1);

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // Fetch posts sorted by postNumber ascending
    const postRows = await db
      .select()
      .from(posts)
      .where(eq(posts.threadId, threadIdNum))
      .orderBy(asc(posts.postNumber));

    // Fetch author user profile if available
    const [authorUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, thread.author))
      .limit(1);

    // Build the original post (ThreadPost shape)
    const created = formatDate(thread.createdAt);

    // Derive memberSince from the user's createdAt timestamp (Unix ms → DD.MM.YY).
    // The legacy `memberSince` text column no longer exists; it is now computed.
    const memberSince = authorUser?.createdAt
      ? formatDate(authorUser.createdAt).date
      : "1.1.24";

    const originalPost: ThreadPost = {
      id: thread.id,
      author: thread.author,
      content: thread.content,
      date: created.date,
      time: created.time,
      memberSince,
      postCount: authorUser?.postCount ?? 0,
      starRating: authorUser?.starRating ?? 3,
      ratersCount: authorUser?.ratersCount ?? 0,
      points: authorUser?.points ?? 0,
    };

    // Compute depth map for replies (postNumber-based)
    const depthMap = buildDepthMap(
      postRows.map((p) => ({ postNumber: p.postNumber, parentId: p.parentId }))
    );

    // Transform posts into ReplyTreeItem array (skip depth-0 = original post)
    const replies: ReplyTreeItem[] = postRows
      .filter((p) => {
        const depth = depthMap.get(p.postNumber) ?? 0;
        return depth > 0;
      })
      .map((p) => {
        const replyCreated = formatDate(p.createdAt);
        const depth = depthMap.get(p.postNumber) ?? 1;
        return {
          id: p.id,
          replyNumber: p.postNumber,
          title: depth === 1 ? thread.title : `Re: ${thread.title}`,
          author: p.author,
          date: replyCreated.date,
          time: replyCreated.time,
          depth,
        };
      });

    const threadData: ThreadData = {
      id: thread.id,
      forumId: thread.forumId,
      sectionName: FORUM_SECTION_NAMES[thread.forumId] ?? thread.forumId,
      title: thread.title,
      post: originalPost,
      replies,
    };

    return NextResponse.json(threadData);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch thread" }, { status: 500 });
  }
}
