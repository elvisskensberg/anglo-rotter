"use client";

import React, { useState } from "react";
import type { ForumListing } from "@/types/forum";
import { HeadlineRow } from "./HeadlineRow";
import styles from "./HeadlinesTable.module.css";

export interface HeadlinesTableProps {
  threads: ForumListing[];
}

/**
 * Converts a Rotter date string ("DD.MM.YY") and time ("HH:MM") into a
 * sortable string "YYMMDD HH:MM" for descending string comparison.
 * Handles both "DD.MM.YY" and "DD.MM.YYYY" formats.
 */
function toSortableDate(date: string, time: string): string {
  const parts = date.split(".");
  const day = parts[0] ?? "00";
  const month = parts[1] ?? "00";
  const yearRaw = parts[2] ?? "00";
  // Normalize to 2-digit year
  const year = yearRaw.length > 2 ? yearRaw.slice(-2) : yearRaw;
  return `${year}${month}${day} ${time}`;
}

/**
 * HeadlinesTable — client component showing all threads with sort toggle.
 *
 * Sort modes:
 *   "chronological" — sorted by thread.date + thread.time descending
 *   "lastReply"     — sorted by thread.lastReplyDate + thread.lastReplyTime descending
 *
 * The active sort is shown as plain bold text; the inactive sort is an orange link.
 * The h1 title updates to reflect the active sort mode.
 */
export function HeadlinesTable({ threads }: HeadlinesTableProps) {
  const [sortMode, setSortMode] = useState<"chronological" | "lastReply">("chronological");

  // Sort threads based on active sort mode (descending — most recent first)
  const sortedThreads = [...threads].sort((a: ForumListing, b: ForumListing) => {
    if (sortMode === "chronological") {
      const dateA = toSortableDate(a.date, a.time);
      const dateB = toSortableDate(b.date, b.time);
      return dateB.localeCompare(dateA);
    } else {
      const dateA = toSortableDate(a.lastReplyDate, a.lastReplyTime);
      const dateB = toSortableDate(b.lastReplyDate, b.lastReplyTime);
      return dateB.localeCompare(dateA);
    }
  });

  const handleSwitchToLastReply = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setSortMode("lastReply");
  };

  const handleSwitchToChronological = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setSortMode("chronological");
  };

  return (
    <div>
      {/* Page title — red bold h1 at 25px */}
      <h1
        style={{
          color: "red",
          fontSize: "25px",
          padding: "0px",
          margin: "0 auto",
          fontWeight: "bold",
        }}
      >
        Forum Scoops Headlines &mdash;{" "}
        {sortMode === "chronological" ? "Chronological" : "By Last Reply"}
      </h1>

      {/* Sort toggle — shows active as plain bold text, inactive as orange link */}
      <p style={{ fontFamily: "Arial, sans-serif", fontSize: "13px" }}>
        {sortMode === "chronological" ? (
          <>
            <b>Chronological</b> |{" "}
            <a href="#" onClick={handleSwitchToLastReply} className={styles.sortLink}>
              Click here for headlines sorted by last reply
            </a>
          </>
        ) : (
          <>
            <a href="#" onClick={handleSwitchToChronological} className={styles.sortLink}>
              Click here for headlines in chronological order
            </a>{" "}
            | <b>By Last Reply</b>
          </>
        )}
      </p>

      {/* Thread table — 4 columns matching Rotter headlines design */}
      <table border={0} width="100%" cellSpacing={0} cellPadding={3}>
        <tbody>
          {/* Header row — #71B7E6 blue with white text */}
          <tr style={{ backgroundColor: "#71B7E6" }}>
            <td align="center" width="1%">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/expand-threads.svg" width={16} height={16} alt="" />
            </td>
            <td align="left" width="70%">
              <span style={{ fontFamily: "Arial", color: "white", fontSize: "small" }}>
                <b>Titles</b>
              </span>
            </td>
            <td align="center">
              <span style={{ fontFamily: "Arial", color: "white", fontSize: "small" }}>
                <b>Time</b>
              </span>
            </td>
            <td align="center">
              <span style={{ fontFamily: "Arial", color: "white", fontSize: "small" }}>
                <b>Author</b>
              </span>
            </td>
          </tr>

          {/* Thread rows */}
          {sortedThreads.map((thread, i) => (
            <HeadlineRow key={thread.id} thread={thread} isEven={i % 2 === 1} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
