"use client";

import React, { useState } from "react";
import { ThreadBreadcrumb } from "./ThreadBreadcrumb";
import { OriginalPostBlock } from "./OriginalPostBlock";
import { ActionButtons } from "./ActionButtons";
import { ReplyTree } from "./ReplyTree";
import { QuickReplyForm } from "./QuickReplyForm";
import type { ThreadData } from "@/data/thread-seed";

interface ThreadPageClientProps {
  thread: ThreadData;
}

/**
 * Client boundary for the thread page (THRD-07).
 * Manages quick-reply toggle state and composes all thread sub-components.
 * This is the ONLY 'use client' component in the thread page.
 * page.tsx remains a server component.
 *
 * Render order (top-to-bottom matching Rotter thread page):
 * 1. ThreadBreadcrumb — navigation context
 * 2. OriginalPostBlock — author info + post content
 * 3. ActionButtons — Edit | Up | Reply | View All | Back (Reply toggles form)
 * 4. ReplyTree — flat list of nested replies
 * 5. QuickReplyForm — visible only when Reply has been clicked
 */
export function ThreadPageClient({ thread }: ThreadPageClientProps) {
  const [quickReplyOpen, setQuickReplyOpen] = useState(false);

  return (
    <div style={{ width: "var(--rotter-container)" }}>
      <ThreadBreadcrumb
        forumId={thread.forumId}
        sectionName={thread.sectionName}
        threadId={thread.id}
      />
      <OriginalPostBlock post={thread.post} title={thread.title} threadId={thread.id} />
      <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: "#000000" }}>
        <tbody>
          <ActionButtons
            forumId={thread.forumId}
            onReplyClick={() => setQuickReplyOpen((v) => !v)}
          />
        </tbody>
      </table>
      <ReplyTree replies={thread.replies} />
      <QuickReplyForm visible={quickReplyOpen} threadId={thread.id} />
    </div>
  );
}
