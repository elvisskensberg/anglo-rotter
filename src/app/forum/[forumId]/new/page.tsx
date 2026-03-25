import { HeaderBar, BlueNavBar, OrangeNavBar } from "@/components/layout";
import { NewThreadForm } from "@/components/forum/NewThreadForm";

/**
 * New Thread page at /forum/[forumId]/new.
 *
 * Server component — no 'use client'.
 * The 'use client' boundary lives inside NewThreadForm.
 */
interface Props {
  params: Promise<{ forumId: string }>;
}

export default async function NewThreadPage({ params }: Props) {
  const { forumId } = await params;

  return (
    <div style={{ backgroundColor: "var(--rotter-body-forum)" }}>
      <center>
        <HeaderBar />
        <BlueNavBar />
        <OrangeNavBar />
        <div style={{ width: "var(--rotter-container)" }}>
          <NewThreadForm forumId={forumId} />
        </div>
      </center>
    </div>
  );
}
