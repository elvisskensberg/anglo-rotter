import type { Metadata } from "next";
import { HeaderBar, BlueNavBar, OrangeNavBar } from "@/components/layout";
import { ForumThreadTable } from "@/components/forum/ForumThreadTable";
import type { ForumListing } from "@/types/forum";

/**
 * Forum listing page at /forum/[forumId].
 *
 * Server component — no 'use client' (matching Phase 2 page.tsx pattern).
 * The 'use client' boundary lives inside ForumThreadTable.
 *
 * Fetches threads from /api/forums/[forumId] instead of hardcoded seed data.
 *
 * Note: Next.js 15 requires params to be awaited as a Promise.
 */
interface Props {
  params: Promise<{ forumId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { forumId } = await params;
  const forumName = forumId
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${forumName} Forum`,
    description: `Browse threads in the ${forumName} forum — latest discussions, scoops, and breaking news.`,
    openGraph: {
      title: `${forumName} Forum — MultiRotter`,
    },
  };
}

export default async function ForumPage({ params }: Props) {
  const { forumId } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  let threads: ForumListing[] = [];

  try {
    const res = await fetch(`${baseUrl}/api/forums/${forumId}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      threads = data.threads ?? [];
    } else {
      console.error(`Forum API returned ${res.status} for forumId=${forumId}`);
    }
  } catch (err) {
    console.error("Failed to fetch forum threads:", err);
  }

  return (
    <div style={{ backgroundColor: "var(--rotter-body-forum)" }}>
      <center>
        <HeaderBar />
        <BlueNavBar />
        <OrangeNavBar />
        <div style={{ width: "var(--rotter-container)" }}>
          <ForumThreadTable threads={threads} forumId={forumId} />
        </div>
      </center>
    </div>
  );
}
