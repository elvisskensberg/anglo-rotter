import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { threads, user } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

/**
 * POST /api/threads
 *
 * Creates a new thread in the given forum.
 * Requires authentication via Better Auth session cookie.
 *
 * Body: { title: string, content: string, forumId: string, category?: string }
 * Returns: 201 { id: number, url: string }
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Validate session
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Parse and validate body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("title" in body) ||
      !("content" in body) ||
      !("forumId" in body)
    ) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, forumId" },
        { status: 400 }
      );
    }

    const { title, content, forumId, category } = body as {
      title: unknown;
      content: unknown;
      forumId: unknown;
      category?: unknown;
    };

    if (typeof title !== "string" || title.trim().length < 3 || title.trim().length > 200) {
      return NextResponse.json(
        { error: "Title must be between 3 and 200 characters" },
        { status: 400 }
      );
    }

    if (typeof content !== "string" || content.trim().length < 1 || content.trim().length > 5000) {
      return NextResponse.json(
        { error: "Content must be between 1 and 5000 characters" },
        { status: 400 }
      );
    }

    if (typeof forumId !== "string" || forumId.trim().length === 0) {
      return NextResponse.json({ error: "forumId is required" }, { status: 400 });
    }

    const categoryValue =
      typeof category === "string" && category.trim().length > 0
        ? category.trim()
        : "scoops";

    const authorName =
      session.user.name && session.user.name.trim().length > 0
        ? session.user.name.trim()
        : session.user.email;

    const now = Date.now();
    const threadId = now; // Use timestamp as ID (unique enough for our purposes)

    // Insert thread
    await db.insert(threads).values({
      id: threadId,
      forumId: forumId.trim(),
      title: title.trim(),
      author: authorName,
      content: content.trim(),
      excerpt: content.trim().slice(0, 150),
      category: categoryValue,
      viewCount: 0,
      replyCount: 0,
      createdAt: now,
      lastReplyAt: null,
      lastReplyAuthor: null,
    });

    // Increment user's postCount
    await db
      .update(user)
      .set({ postCount: sql`post_count + 1` })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({ id: threadId, url: `/thread/${threadId}` }, { status: 201 });
  } catch (error) {
    console.error("Failed to create thread:", error);
    return NextResponse.json({ error: "Failed to create thread" }, { status: 500 });
  }
}
