import React from "react";

export interface HeadlinesPageLayoutProps {
  children: React.ReactNode;
}

/**
 * HeadlinesPageLayout — two-column table layout for the headlines page.
 *
 * Left column: 160px sidebar with ad placeholder (matching Rotter Section 7 design)
 * Right column: main content area (HeadlinesTable with sort toggle)
 *
 * No "use client" needed — presentational wrapper. The client boundary lives
 * inside HeadlinesTable.
 */
export function HeadlinesPageLayout({ children }: HeadlinesPageLayoutProps) {
  return (
    <table width="100%">
      <tbody>
        <tr>
          {/* Left sidebar — 160px ad column */}
          <td style={{ borderWidth: 0, width: "160px" }} valign="top">
            <div
              style={{
                width: "160px",
                height: "600px",
                backgroundColor: "#f0f0f0",
                border: "1px dashed #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Arial, sans-serif",
                fontSize: "11px",
                color: "#999",
              }}
            >
              Ad Space
            </div>
          </td>

          {/* Main content — thread table with sort toggle */}
          <td valign="top">{children}</td>
        </tr>
      </tbody>
    </table>
  );
}
