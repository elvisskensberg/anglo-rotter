import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeaderBar, BlueNavBar, OrangeNavBar } from "@/components/layout";
import { UserProfile } from "@/components/profile/UserProfile";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * User profile page at /profile/[userId].
 *
 * Server component — queries user by ID and renders profile stats.
 * Returns 404 if user not found.
 *
 * Note: Next.js 15 requires params to be awaited as a Promise.
 */
interface Props {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  void userId;
  return {
    title: "User Profile",
    description: "View user profile — post history, member since date, and forum rating.",
    openGraph: {
      title: "User Profile — MultiRotter",
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { userId } = await params;

  const [userRow] = await db.select().from(user).where(eq(user.id, userId)).limit(1);

  if (!userRow) {
    notFound();
  }

  return (
    <div style={{ backgroundColor: "var(--rotter-body-forum)" }}>
      <center>
        <HeaderBar />
        <BlueNavBar />
        <OrangeNavBar />
        <div style={{ width: "var(--rotter-container)", paddingTop: "8px" }}>
          <UserProfile user={userRow} />
        </div>
      </center>
    </div>
  );
}
