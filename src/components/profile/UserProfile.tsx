import React from "react";
import { Table } from "@/components/ui/Table";
import styles from "./UserProfile.module.css";

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    username: string | null;
    email: string;
    createdAt: number | string | Date;
    postCount: number;
    starRating: number;
    ratersCount: number;
    points: number;
  };
}

/**
 * Format a timestamp (Unix ms, ISO string, or Date) as DD.MM.YY
 * matching Rotter's date display pattern.
 */
function formatMemberSince(ts: number | string | Date): string {
  const d = typeof ts === "number" ? new Date(ts) : new Date(ts);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}.${mm}.${yy}`;
}

/**
 * UserProfile component — displays user stats in Rotter retro table style.
 *
 * Shows: username, star rating, member since date, post count, raters/points.
 * Layout: table-based matching OriginalPostBlock author info pattern.
 */
export function UserProfile({ user }: UserProfileProps) {
  const displayName = user.username || user.name;
  const memberSince = formatMemberSince(user.createdAt);
  const starRating = Math.min(5, Math.max(1, user.starRating));

  return (
    <div className={styles.profileContainer}>
      <Table
        width="100%"
        border={0}
        cellSpacing={0}
        cellPadding={0}
        style={{ backgroundColor: "#000000" }}
      >
        <tbody>
          <tr>
            <td>
              <Table
                width="100%"
                border={0}
                cellSpacing={0}
                cellPadding={1}
                style={{ backgroundColor: "#000000" }}
              >
                <tbody>
                  <tr>
                    <td>
                      <Table width="100%" border={0} cellPadding={3} cellSpacing={0}>
                        <tbody>
                          {/* Title row */}
                          <tr style={{ backgroundColor: "var(--rotter-header-bg)" }}>
                            <td colSpan={2}>
                              <span className={styles.profileTitle}>User Profile</span>
                            </td>
                          </tr>

                          {/* Profile info row */}
                          <tr style={{ backgroundColor: "var(--rotter-row-odd)" }}>
                            <td valign="top" width="30%" className={styles.infoRow}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`/icons/star-${starRating}.svg`}
                                alt={`${starRating} stars`}
                              />
                            </td>
                            <td valign="top" width="70%" className={styles.infoRow}>
                              <span className={styles.username}>{displayName}</span>
                              <br />
                              <span className={styles.stat}>Member since: {memberSince}</span>
                              <br />
                              <span className={styles.stat}>Posts: {user.postCount}</span>
                              <br />
                              <span className={styles.stat}>
                                Rating: {starRating}/5 (
                                <span className={styles.ratersCount}>{user.ratersCount} raters</span>
                                {", "}
                                <span className={styles.points}>{user.points} points</span>
                                )
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
