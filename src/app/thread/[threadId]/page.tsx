import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeaderBar, BlueNavBar, OrangeNavBar } from "@/components/layout";
import { ThreadPageClient } from "@/components/thread/ThreadPageClient";
import type { ThreadData } from "@/data/thread-seed";

/**
 * Thread detail page at /thread/[threadId].
 *
 * Server component — no 'use client' (client boundary lives inside ThreadPageClient).
 * Fetches thread from /api/threads/[threadId] instead of hardcoded seed data.
 *
 * Note: Next.js 15 requires params to be awaited as a Promise.
 */
interface Props {
  params: Promise<{ threadId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { threadId } = await params;
  return {
    title: `Thread #${threadId}`,
    description: `Read thread #${threadId} — view the original post, replies, and discussion.`,
    openGraph: {
      title: `Thread #${threadId} — MultiRotter`,
    },
  };
}

export default async function ThreadPage({ params }: Props) {
  const { threadId } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/threads/${threadId}`, { cache: "no-store" });

  if (!res.ok) {
    notFound();
  }

  const thread: ThreadData = await res.json();

  return (
    <div style={{ backgroundColor: "var(--rotter-body-forum)" }}>
      <center>
        <HeaderBar />
        <BlueNavBar />
        <OrangeNavBar />
        <ThreadPageClient thread={thread} />
      </center>
    </div>
  );
}
