import type { Metadata } from "next";
import { HeaderBar, BlueNavBar, OrangeNavBar } from "@/components/layout";
import { HomepageLayout } from "@/components/homepage";

export const metadata: Metadata = {
  title: "MultiRotter — Breaking News Forum",
  description:
    "Real-time breaking news scoops, forum discussions, and news flashes. Browse the latest headlines and join the conversation.",
  openGraph: {
    title: "MultiRotter — Breaking News Forum",
    description: "Real-time breaking news scoops and forum discussions",
  },
};

export default function Home() {
  return (
    <div>
      <HeaderBar />
      <BlueNavBar />
      <OrangeNavBar />
      <HomepageLayout />
    </div>
  );
}
