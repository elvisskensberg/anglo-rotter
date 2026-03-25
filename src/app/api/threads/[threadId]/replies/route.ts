import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { threads, posts, user } from "@/db/schema";
import { eq, sql, max } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ threadId: string }>;
}

/**
 * POST /api/threads/[threadId]/replies
 *
 * Creates a new reply post in the given thread.
 * Requires authentication via Better Auth session cookie.
 *
 * Body: { content: string, parentId?: number }
 * Returns: 201 { id: number, postNumber: number }
 */
export async function POST(request: Request, { params }: RouteParams): Promise<NextResponse> {
  try {
    // Validate session
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { threadId } = await params;
    const threadIdNum = parseInt(threadId, 10);

    if (isNaN(threadIdNum)) {
      return NextResponse.json({ error: "Invalid thread ID" }, { status: 400 });
    }

    // Parse and validate body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (typeof body !== "object" || body === null || !("content" in body)) {
      return NextResponse.json({ error: "Missing required field: content" }, { status: 400 });
    }

    const { content, parentId } = body as { content: unknown; parentId?: unknown };

    if (typeof content !== "string" || content.trim().length < 1 || content.trim().length > 5000) {
      return NextResponse.json(
        { error: "Content must be between 1 and 5000 characters" },
        { status: 400 }
      );
    }

    const parentIdNum =
      parentId !== undefined && parentId !== null && typeof parentId === "number"
        ? parentId
        : null;

    // Verify thread exists
    const [thread] = await db
      .select()
      .from(threads)
      .where(eq(threads.id, threadIdNum))
      .limit(1);

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // Get current max postNumber for this thread
    const [{ maxPostNum }] = await db
      .select({ maxPostNum: max(posts.postNumber) })
      .from(posts)
      .where(eq(posts.threadId, threadIdNum));

    const nextPostNumber = (maxPostNum ?? 0) + 1;

    const authorName =
      session.user.name && session.user.name.trim().length > 0
        ? session.user.name.trim()
        : session.user.email;

    const now = Date.now();

    // Insert the reply post
    const [newPost] = await db
      .insert(posts)
      .values({
        threadId: threadIdNum,
        parentId: parentIdNum,
        author: authorName,
        content: content.trim(),
        postNumber: nextPostNumber,
        createdAt: now,
      })
      .returning();

    // Update thread: increment replyCount, set lastReplyAt, set lastReplyAuthor
    await db
      .update(threads)
      .set({
        replyCount: sql`reply_count + 1`,
        lastReplyAt: now,
        lastReplyAuthor: authorName,
      })
      .where(eq(threads.id, threadIdNum));

    // Increment user's postCount
    await db
      .update(user)
      .set({ postCount: sql`post_count + 1` })
      .where(eq(user.id, session.user.id));

    return NextResponse.json(
      { id: newPost?.id ?? null, postNumber: nextPostNumber },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create reply:", error);
    return NextResponse.json({ error: "Failed to create reply" }, { status: 500 });
  }
}
