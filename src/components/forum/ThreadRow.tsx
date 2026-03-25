import React from "react";
import styles from "./ThreadRow.module.css";
import type { ForumListing } from "@/types/forum";

/**
 * Classifies a thread into one of three visual states based on engagement metrics.
 * - 'fire': viral threads with viewCount > 5000 (thread-fire.svg + hot-news badge)
 * - 'hot': popular threads with viewCount > 1000 or replyCount > 50 (thread-hot.svg)
 * - 'normal': standard threads (thread-normal.svg)
 */
function getThreadState(thread: ForumListing): "normal" | "hot" | "fire" {
  if (thread.viewCount > 5000) return "fire";
  if (thread.viewCount > 1000 || thread.replyCount > 50) return "hot";
  return "normal";
}

const iconMap: Record<"normal" | "hot" | "fire", string> = {
  normal: "/icons/thread-normal.svg",
  hot: "/icons/thread-hot.svg",
  fire: "/icons/thread-fire.svg",
};

export interface ThreadRowProps {
  thread: ForumListing;
  isEven: boolean;
  onIconEnter: (title: string, excerpt: string, x: number, y: number) => void;
  onIconLeave: () => void;
}

/**
 * Single forum thread row with 6 columns matching Rotter's thread table structure.
 *
 * Column layout:
 *   1. Icon cell (fixed, right-aligned) — thread state icon with tooltip trigger
 *   2. Title cell (55% width) — bold link to thread
 *   3. Author + date cell — posted by info
 *   4. Last reply cell — last reply author + date
 *   5. Reply count cell — total replies
 *   6. Views cell — view count colored by state; fire threads show hot-news badge
 */
export function ThreadRow({ thread, isEven, onIconEnter, onIconLeave }: ThreadRowProps) {
  const state = getThreadState(thread);
  const iconSrc = iconMap[state];

  const viewsColor =
    state === "normal"
      ? "var(--rotter-views-orange)"
      : "var(--rotter-views-hot)";

  const handleMouseEnter = (e: React.MouseEvent<HTMLTableCellElement>) => {
    onIconEnter(thread.title, thread.excerpt, e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    onIconLeave();
  };

  return (
    <tr style={{ backgroundColor: isEven ? "var(--rotter-row-even)" : "var(--rotter-row-odd)" }}>
      {/* Col 1: Thread state icon — triggers tooltip on mouseenter */}
      <td
        align="right"
        valign="top"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconSrc}
          alt={state}
          width={16}
          height={16}
          style={{ width: "var(--rotter-icon-sm)", height: "var(--rotter-icon-sm)" }}
        />
      </td>

      {/* Col 2: Thread title — 55% width, bold navy link */}
      <td align="right" valign="top" width="55%">
        <a href={thread.url} className={styles.text15bn}>
          {thread.title}
        </a>
      </td>

      {/* Col 3: Author + date posted */}
      <td align="center" valign="top">
        <span className={styles.text13}>
          <span style={{ color: "var(--rotter-text-primary)" }}>{thread.date}</span>
          {" "}
          <span style={{ color: "var(--rotter-text-time)" }}>{thread.time}</span>
          <br />
          <a href={`/user/${thread.author}`} className={styles.authorLink}>
            {thread.author}
          </a>
        </span>
      </td>

      {/* Col 4: Last reply info */}
      <td align="center" valign="top">
        <span className={styles.text13}>
          <span style={{ color: "var(--rotter-text-primary)" }}>{thread.lastReplyDate}</span>
          {" "}
          <span style={{ color: "var(--rotter-text-time)" }}>{thread.lastReplyTime}</span>
          <br />
          <a href={`/user/${thread.lastReplyAuthor}`} className={styles.lastByLink}>
            {thread.lastReplyAuthor}
          </a>
        </span>
      </td>

      {/* Col 5: Reply count */}
      <td align="center" valign="top">
        <b style={{ color: "var(--rotter-text-primary)", fontFamily: "var(--rotter-font-primary)" }}>
          {thread.replyCount}
        </b>
      </td>

      {/* Col 6: View count — red for hot/fire, orange for normal; fire also shows hot-news icon */}
      <td align="right" valign="top">
        <b style={{ color: viewsColor, fontFamily: "var(--rotter-font-primary)" }}>
          {thread.viewCount.toLocaleString()}
        </b>
        {state === "fire" && (
          <>
            {" "}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/hot-news.svg"
              alt="hot news"
              width={16}
              height={16}
              style={{ width: "var(--rotter-icon-sm)", height: "var(--rotter-icon-sm)" }}
            />
          </>
        )}
      </td>
    </tr>
  );
}
