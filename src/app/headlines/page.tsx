import type { Metadata } from "next";
import { HeaderBar, BlueNavBar, OrangeNavBar } from "@/components/layout";
import { HeadlinesPageLayout } from "@/components/headlines";

export const metadata: Metadata = {
  title: "Headlines",
  description:
    "All forum headlines sorted chronologically or by last reply. Browse the latest scoops.",
  openGraph: {
    title: "Headlines — MultiRotter",
  },
};
import { HeadlinesTable } from "@/components/headlines/HeadlinesTable";
import type { ForumListing } from "@/types/forum";

/**
 * Headlines page at /headlines.
 *
 * Server component — no "use client". The client boundary lives inside HeadlinesTable.
 * Fetches threads from /api/forums/scoops1 instead of hardcoded seed data.
 *
 * Renders the full page with shared layout chrome and two-column headlines layout.
 */
export default async function HeadlinesPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  let threads: ForumListing[] = [];

  try {
    const res = await fetch(`${baseUrl}/api/forums/scoops1`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      threads = data.threads ?? [];
    } else {
      console.error(`Forum API returned ${res.status} for scoops1`);
    }
  } catch (err) {
    console.error("Failed to fetch headlines threads:", err);
  }

  return (
    <div style={{ backgroundColor: "#FEFEFE" }}>
      <center>
        <HeaderBar />
        <BlueNavBar />
        <OrangeNavBar />
        <div style={{ width: "1012px" }}>
          <HeadlinesPageLayout>
            <HeadlinesTable threads={threads} />
          </HeadlinesPageLayout>
        </div>
      </center>
    </div>
  );
}
