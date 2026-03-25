import React from "react";
import styles from "./HeadlineRow.module.css";
import type { ForumListing } from "@/types/forum";

/**
 * Classifies a thread into one of three icon types for the headlines page.
 * - 'fire': security alert scoops (Red Alert, UAV, BREAKING, etc.) or viral threads (viewCount > 5000)
 * - 'camera': media category threads or Watch:/Documentation-of titles
 * - 'normal': all other threads
 */
export function getHeadlineIconType(thread: ForumListing): "normal" | "fire" | "camera" {
  // Fire: security-alert-origin scoops by title prefix
  const fireTitle =
    thread.title.startsWith("Red Alert") ||
    thread.title.startsWith("UAV infiltration") ||
    thread.title.startsWith("Alerts for launches") ||
    thread.title.startsWith("BREAKING") ||
    thread.title.startsWith("LIVE") ||
    thread.title.startsWith("Multiple explosions");

  if ((thread.category === "scoops" && fireTitle) || thread.viewCount > 5000) {
    return "fire";
  }

  // Camera: media category or documentary/watch titles
  if (
    thread.category === "media" ||
    thread.title.startsWith("Watch:") ||
    thread.title.startsWith("Documentation of")
  ) {
    return "camera";
  }

  return "normal";
}

const iconMap: Record<"normal" | "fire" | "camera", string> = {
  normal: "/icons/thread-normal.svg",
  fire: "/icons/thread-fire.svg",
  camera: "/icons/thread-camera.svg",
};

export interface HeadlineRowProps {
  thread: ForumListing;
  isEven: boolean;
}

/**
 * Single headlines row with 4 columns matching the Rotter headlines page layout.
 *
 * Column layout:
 *   1. Icon cell — 16x16 thread type icon (normal/fire/camera)
 *   2. Title cell (70% width) — bold navy link to thread
 *   3. Time + date cell — bold time, small date below
 *   4. Author cell — red bold author name
 *
 * Row background alternates: #eeeeee (even) / #FDFDFD (odd)
 * Uses inline hex values — jsdom cannot resolve CSS custom properties in toHaveStyle assertions.
 */
export function HeadlineRow({ thread, isEven }: HeadlineRowProps) {
  const iconType = getHeadlineIconType(thread);
  const iconSrc = iconMap[iconType];

  return (
    <tr style={{ backgroundColor: isEven ? "#eeeeee" : "#FDFDFD" }}>
      {/* Col 1: Thread type icon */}
      <td>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconSrc}
          alt={iconType}
          width={16}
          height={16}
          style={{ width: "16px", height: "16px" }}
        />
      </td>

      {/* Col 2: Thread title — 70% width, bold navy link */}
      <td width="70%" align="left">
        <a href={thread.url} className={styles.text15bn}>
          {thread.title}
        </a>
      </td>

      {/* Col 3: Time + date */}
      <td align="center">
        <span className={styles.text13b}>{thread.time}</span>
        <br />
        <span style={{ fontSize: "10px" }}>{thread.date}</span>
      </td>

      {/* Col 4: Author — red bold */}
      <td align="center">
        <span className={styles.text13r}>{thread.author}</span>
      </td>
    </tr>
  );
}
