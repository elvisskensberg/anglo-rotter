import type { Metadata } from "next";
import { NewsPageLayout } from "@/components/news";
import type { NewsItem } from "@/types/forum";

export const metadata: Metadata = {
  title: "News Flashes",
  description:
    "Latest breaking news flashes from all sources — news, sports, economy, and tech updates in real-time.",
  openGraph: {
    title: "News Flashes — MultiRotter",
  },
};

/**
 * News Flash page — server component entry point.
 * Fetches initial items from /api/news for SSR, then NewsPageLayout
 * auto-refreshes via useAutoRefresh hook at 5-minute intervals.
 * Does not use HeaderBar/BlueNavBar — the news page has its own distinct teal header.
 */
export default async function NewsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  let initialItems: NewsItem[] = [];

  try {
    const res = await fetch(`${baseUrl}/api/news`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      initialItems = data.items ?? [];
    } else {
      console.error(`News API returned ${res.status}`);
    }
  } catch (err) {
    console.error("Failed to fetch news items:", err);
  }

  return <NewsPageLayout initialItems={initialItems} />;
}
