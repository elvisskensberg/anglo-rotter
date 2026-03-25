import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { threads, threadRatings, user } from "@/db/schema";
import { eq, and, avg, count, inArray } from "drizzle-orm";
import { headers } from "next/headers";

interface RouteParams {
  params: Promise<{ threadId: string }>;
}

/**
 * POST /api/threads/[threadId]/rate
 *
 * Authenticated users can rate a thread 1-5 stars.
 * Upserts rating (one rating per user per thread).
 * After rating, recalculates the thread author's aggregated star rating.
 *
 * Request body: { score: number } — must be integer 1-5
 * Response: { score, averageRating, ratersCount }
 */
export async function POST(request: Request, { params }: RouteParams): Promise<NextResponse> {
  try {
    // Validate auth session
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const score = (body as Record<string, unknown>)?.score;
    if (typeof score !== "number" || !Number.isInteger(score) || score < 1 || score > 5) {
      return NextResponse.json({ error: "score must be an integer 1-5" }, { status: 400 });
    }

    // Verify thread exists
    const [thread] = await db.select().from(threads).where(eq(threads.id, threadIdNum)).limit(1);
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const userId = session.user.id;
    const now = Date.now();

    // Upsert rating: check if user already rated
    const [existingRating] = await db
      .select()
      .from(threadRatings)
      .where(and(eq(threadRatings.threadId, threadIdNum), eq(threadRatings.userId, userId)))
      .limit(1);

    if (existingRating) {
      // Update existing rating
      await db
        .update(threadRatings)
        .set({ score, createdAt: now })
        .where(eq(threadRatings.id, existingRating.id));
    } else {
      // Insert new rating
      await db.insert(threadRatings).values({
        threadId: threadIdNum,
        userId,
        score,
        createdAt: now,
      });
    }

    // Recalculate the thread author's star rating
    // Find all threads by the same author to aggregate their ratings
    const authorThreads = await db
      .select({ id: threads.id })
      .from(threads)
      .where(eq(threads.author, thread.author));

    const authorThreadIds = authorThreads.map((t) => t.id);

    // Get aggregated rating stats across all author's threads
    let avgRating = 1;
    let totalRaters = 0;
    let totalPoints = 0;

    if (authorThreadIds.length > 0) {
      const [stats] = await db
        .select({
          avgScore: avg(threadRatings.score),
          totalCount: count(threadRatings.id),
        })
        .from(threadRatings)
        .where(inArray(threadRatings.threadId, authorThreadIds));

      if (stats) {
        const rawAvg = typeof stats.avgScore === "string" ? parseFloat(stats.avgScore) : (stats.avgScore ?? 1);
        avgRating = Math.min(5, Math.max(1, Math.round(rawAvg)));
        totalRaters = stats.totalCount ?? 0;

        // Points = sum of all scores — compute separately
        const allRatings = await db
          .select({ score: threadRatings.score })
          .from(threadRatings)
          .where(inArray(threadRatings.threadId, authorThreadIds));
        totalPoints = allRatings.reduce((sum, r) => sum + r.score, 0);
      }
    }

    // Update the author's user profile stats
    // Find user by username (thread.author is the display name)
    const [authorUser] = await db
      .select()
      .from(user)
      .where(eq(user.username, thread.author))
      .limit(1);

    if (authorUser) {
      await db
        .update(user)
        .set({
          starRating: avgRating,
          ratersCount: totalRaters,
          points: totalPoints,
          updatedAt: now,
        })
        .where(eq(user.id, authorUser.id));
    }

    return NextResponse.json({
      score,
      averageRating: avgRating,
      ratersCount: totalRaters,
    });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to save rating" }, { status: 500 });
  }
}
