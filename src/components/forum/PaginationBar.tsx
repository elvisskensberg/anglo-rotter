import React from "react";
import styles from "./PaginationBar.module.css";

/**
 * PaginationBar renders forum page numbers and rows-per-page dropdown.
 *
 * - Current page is plain text (unlinked)
 * - Other pages are red bold links
 * - Separator "|" between page numbers
 * - Rows-per-page dropdown with options 15/30/50/100/150/200/250/300
 *
 * Source: scoops_forum.html lines 548-562 (rows dropdown) and line 568 (page numbers)
 * Pattern 6 in 03-RESEARCH.md
 */

const ROWS_OPTIONS = [15, 30, 50, 100, 150, 200, 250, 300] as const;

export interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

export function PaginationBar({
  currentPage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: PaginationBarProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={styles.wrapper}>
      {pages.map((page, index) => (
        <React.Fragment key={page}>
          {index > 0 && <span className={styles.separator}>|</span>}
          {page === currentPage ? (
            <span className={styles.currentPage}>{page}</span>
          ) : (
            <a
              className={styles.pageLink}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(page);
              }}
            >
              {page}
            </a>
          )}
        </React.Fragment>
      ))}
      <select
        className={styles.rowsSelect}
        value={rowsPerPage}
        onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
        aria-label="Rows per page"
      >
        {ROWS_OPTIONS.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </div>
  );
}
