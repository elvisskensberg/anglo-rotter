import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pushSubscriptions } from "@/db/schema";

/**
 * POST /api/push/subscribe
 *
 * Stores a browser PushSubscription in the database so the server can
 * dispatch notifications to that browser later via /api/push/send.
 *
 * Body: { endpoint: string, keys: { p256dh: string, auth: string } }
 * Returns: 201 { ok: true } on success
 *          400 { error: "Invalid subscription" } on validation failure
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  // Validate required fields
  if (
    typeof body !== "object" ||
    body === null ||
    !("endpoint" in body) ||
    !("keys" in body)
  ) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  const { endpoint, keys } = body as { endpoint: unknown; keys: unknown };

  if (
    typeof endpoint !== "string" ||
    !endpoint ||
    typeof keys !== "object" ||
    keys === null ||
    !("p256dh" in keys) ||
    !("auth" in keys)
  ) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  const { p256dh, auth } = keys as { p256dh: unknown; auth: unknown };

  if (typeof p256dh !== "string" || !p256dh || typeof auth !== "string" || !auth) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  try {
    await db
      .insert(pushSubscriptions)
      .values({
        endpoint,
        p256dh,
        auth,
        createdAt: Date.now(),
      })
      .onConflictDoUpdate({
        target: pushSubscriptions.endpoint,
        set: { p256dh, auth },
      });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }
}
