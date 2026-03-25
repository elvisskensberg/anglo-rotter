import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { db } from "@/db";
import { pushSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * POST /api/push/send
 *
 * Dispatches a web-push notification to all stored subscriptions.
 * Authenticated via Authorization: Bearer {CRON_SECRET} (same as /api/scrape).
 * Expired subscriptions (HTTP 410) are automatically cleaned up.
 *
 * Body: { title: string, body: string, url?: string }
 * Returns: 200 { ok: true, sent: N, failed: N, cleaned: N }
 *          401 if CRON_SECRET mismatch
 *          400 if body invalid
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Validate CRON_SECRET
  const expectedSecret = process.env.CRON_SECRET;
  if (!expectedSecret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse and validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || !("title" in body) || !("body" in body)) {
    return NextResponse.json({ error: "Missing required fields: title, body" }, { status: 400 });
  }

  const { title, body: notifBody, url } = body as { title: unknown; body: unknown; url?: unknown };

  if (typeof title !== "string" || !title || typeof notifBody !== "string" || !notifBody) {
    return NextResponse.json({ error: "title and body must be non-empty strings" }, { status: 400 });
  }

  // Configure VAPID
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT ?? "mailto:admin@multirotter.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  // Fetch all subscriptions
  const allSubscriptions = await db.select().from(pushSubscriptions);

  let sent = 0;
  let failed = 0;
  let cleaned = 0;

  const payload = JSON.stringify({
    title,
    body: notifBody,
    url: typeof url === "string" ? url : "/",
  });

  for (const sub of allSubscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        payload
      );
      sent++;
    } catch (err) {
      // HTTP 410 Gone — subscription expired, remove it
      if (
        typeof err === "object" &&
        err !== null &&
        "statusCode" in err &&
        (err as { statusCode: number }).statusCode === 410
      ) {
        await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id));
        cleaned++;
      } else {
        failed++;
      }
    }
  }

  return NextResponse.json({ ok: true, sent, failed, cleaned });
}
