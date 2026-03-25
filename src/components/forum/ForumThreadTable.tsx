"use client";

import React, { useState } from "react";
import type { ForumListing } from "@/types/forum";
import { ThreadRow } from "./ThreadRow";
import { ForumToolbar } from "./ForumToolbar";
import { PaginationBar } from "./PaginationBar";
import { ForumSectionDropdown } from "./ForumSectionDropdown";
import styles from "./ForumThreadTable.module.css";

/**
 * TooltipState tracks the mouse-following tooltip position and content.
 * visible=false means tooltip is not rendered in the DOM.
 */
interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  title: string;
  excerpt: string;
}

export interface ForumThreadTableProps {
  threads: ForumListing[];
  forumId?: string;
}

/**
 * ForumThreadTable is the top-level 'use client' orchestrator for the forum listing.
 *
 * Owns:
 * - Tooltip state (mouse-following overlay on thread icon hover)
 * - Pagination state (currentPage, rowsPerPage)
 * - Section filter state (selectedCategory)
 *
 * Renders:
 *   ForumSectionDropdown → section filter
 *   ForumToolbar        → Login/Help/Search/Post icons
 *   breadcrumb header   → blue nav row
 *   thread table        → 6-column header + ThreadRow[] for current page
 *   PaginationBar       → page numbers + rows-per-page
 *   tooltip overlay     → fixed-position div (rendered when visible=true)
 *
 * Architecture note: imports siblings directly (not via barrel index.ts)
 * to avoid circular dependency — same pattern as Phase 2's HomepageLayout.
 */
export function ForumThreadTable({ threads, forumId }: ForumThreadTableProps) {
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("scoops");
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    title: "",
    excerpt: "",
  });

  // Derived state — filter and paginate
  const filteredThreads = threads.filter(
    (t) => t.category === selectedCategory || selectedCategory === "all"
  );
  const totalPages = Math.ceil(filteredThreads.length / rowsPerPage);
  const pageStart = (currentPage - 1) * rowsPerPage;
  const pageThreads = filteredThreads.slice(pageStart, pageStart + rowsPerPage);

  // Section label for breadcrumb (capitalize first letter)
  const sectionLabel =
    selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);

  // ── Handlers ────────────────────────────────────────────────────────────

  /** Update tooltip position as mouse moves over the table wrapper */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltip.visible) {
      setTooltip((prev) => ({ ...prev, x: e.clientX + 15, y: e.clientY + 15 }));
    }
  };

  /** Show tooltip when cursor enters the thread icon cell */
  const handleIconEnter = (title: string, excerpt: string, x: number, y: number) => {
    setTooltip({ visible: true, x: x + 15, y: y + 15, title, excerpt });
  };

  /** Hide tooltip when cursor leaves the thread icon cell */
  const handleIconLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  /** Reset to page 1 when rows-per-page changes to avoid landing on non-existent page */
  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  /** Reset to page 1 when category changes */
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div onMouseMove={handleMouseMove}>
      {/* Section filter dropdown */}
      <ForumSectionDropdown
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Action toolbar: Login / Help / Search / Post */}
      <ForumToolbar forumId={forumId} />

      {/* Breadcrumb header row — black outer table for 1px border effect */}
      <table bgcolor="#000000" width="100%" cellSpacing={1} cellPadding={0} border={0}>
        <tbody>
          <tr style={{ backgroundColor: "var(--rotter-subheader-blue)" }}>
            <th align="right" colSpan={6}>
              <a href="/forum">
                <span style={{ fontFamily: "Arial", color: "#ffffff", fontSize: "small" }}>
                  Forums
                </span>
              </a>
              &nbsp;&gt;&nbsp;
              <span style={{ fontFamily: "Arial", color: "#ffffff", fontSize: "small" }}>
                {sectionLabel}
              </span>
            </th>
          </tr>
        </tbody>
      </table>

      {/* Mouse-following tooltip — fixed position, pointer-events: none (Pitfall 1) */}
      {tooltip.visible && (
        <div
          className={styles.tooltip}
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className={styles.tooltipHeader}>{tooltip.title}</div>
          <div className={styles.tooltipBody}>{tooltip.excerpt}</div>
        </div>
      )}

      {/* Thread table — 6 columns matching Rotter's exact structure */}
      <table border={0} width="100%" cellSpacing={0} cellPadding={3}>
        <tbody>
          {/* Column header row — blue #71B7E6 */}
          <tr style={{ backgroundColor: "var(--rotter-header-blue)" }}>
            <td align="center" width="1%">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/expand-threads.svg"
                width={16}
                height={16}
                alt=""
              />
            </td>
            <td align="right" width="55%">
              <span style={{ fontFamily: "Arial", color: "white", fontSize: "small" }}>
                <b>Titles</b>
              </span>
            </td>
            <td align="center">
              <span style={{ fontFamily: "Arial", color: "white", fontSize: "small" }}>
                <b>Author</b>
              </span>
            </td>
            <td align="center">
              <span style={{ fontFamily: "Arial", color: "white", fontSize: "small" }}>
                <b>Last Reply</b>
              </span>
            </td>
            <td align="center">
              <span style={{ fontFamily: "Arial", color: "white", fontSize: "small" }}>
                <b>Replies</b>
              </span>
            </td>
            <td align="center">
              <span style={{ fontFamily: "Arial", color: "white", fontSize: "small" }}>
                <b>Views</b>
              </span>
            </td>
          </tr>

          {/* Thread rows for current page */}
          {pageThreads.map((thread, i) => (
            <ThreadRow
              key={thread.id}
              thread={thread}
              isEven={i % 2 === 1}
              onIconEnter={handleIconEnter}
              onIconLeave={handleIconLeave}
            />
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </div>
  );
}
