import React from "react";
import styles from "./ForumToolbar.module.css";

/**
 * ForumToolbar renders the row of 4 action icons above the forum thread table.
 *
 * Layout: table with one row, each cell containing a 33x33 icon + label below.
 * Source: scoops_forum.html line 439, Pattern 7 in 03-RESEARCH.md
 *
 * Props:
 *   forumId — used to build the "Post" link to /forum/[forumId]/new
 */

interface ForumToolbarProps {
  forumId?: string;
}

interface ToolbarItem {
  icon: string;
  label: string;
  href: string;
}

function buildToolbarItems(forumId?: string): ToolbarItem[] {
  return [
    { icon: "/icons/toolbar-login.svg", label: "Login", href: "/auth/login" },
    { icon: "/icons/toolbar-help.svg", label: "Help", href: "/help" },
    { icon: "/icons/toolbar-search.svg", label: "Search", href: "/search" },
    {
      icon: "/icons/toolbar-post.svg",
      label: "Post",
      href: forumId ? `/forum/${forumId}/new` : "/forum",
    },
  ];
}

export function ForumToolbar({ forumId }: ForumToolbarProps) {
  const toolbarItems = buildToolbarItems(forumId);

  return (
    <table border={0} cellSpacing={0} cellPadding={0} className={styles.toolbarTable}>
      <tbody>
        <tr>
          {toolbarItems.map((item) => (
            <td key={item.label} align="center" style={{ whiteSpace: "nowrap", width: 50 }}>
              <a href={item.href}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.icon}
                  alt={item.label}
                  width={33}
                  height={33}
                  style={{ width: "var(--rotter-icon-toolbar)", height: "var(--rotter-icon-toolbar)" }}
                />
              </a>
              <br />
              <a href={item.href} className={styles.label}>
                {item.label}
              </a>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
