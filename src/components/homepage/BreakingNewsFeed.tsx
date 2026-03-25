"use client";

import React from "react";
import styles from "./BreakingNewsFeed.module.css";
import type { ForumListing } from "@/types/forum";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";

const REFRESH_MS = Number(process.env.NEXT_PUBLIC_REFRESH_INTERVAL_MS ?? 780000);

interface BreakingNewsFeedProps {
  initialHeadlines?: ForumListing[];
}

/**
 * Center column breaking news feed.
 * Renders each headline as: red bold time + nbsp + navy headline link.
 * Matches Rotter.net's "חדשות מתפרצות" (Breaking News) section.
 * Auto-refreshes at 13-minute interval via useAutoRefresh hook.
 */
export function BreakingNewsFeed({ initialHeadlines = [] }: BreakingNewsFeedProps) {
  const { data } = useAutoRefresh<{ threads: ForumListing[] }>("/api/forums/scoops1", REFRESH_MS);
  const headlines = data?.threads ?? initialHeadlines;

  return (
    <div>
      <div
        style={{
          backgroundColor: "var(--rotter-subheader-blue)",
          color: "#ffffff",
          fontWeight: "bold",
          padding: "2px 8px",
          fontSize: "10pt",
        }}
      >
        Breaking News
      </div>
      {headlines.map((item, index) => (
        <React.Fragment key={item.id ?? index}>
          <span className={styles.timeLabel}>
            <b>{item.time}</b>
          </span>
          {"\u00a0"}
          <a href={item.url} target="news" className={styles.headlineLink}>
            {item.title}
          </a>
          <br />
        </React.Fragment>
      ))}
    </div>
  );
}
