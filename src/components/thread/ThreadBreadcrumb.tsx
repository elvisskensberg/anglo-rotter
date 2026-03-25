import React from "react";
import { Table } from "@/components/ui/Table";

interface BreadcrumbProps {
  forumId: string;
  sectionName: string;
  threadId: number;
}

/**
 * Breadcrumb bar for the thread page (THRD-08).
 * Renders: Forums > {SectionName} > Thread #{threadId}
 * Blue background bar matching Rotter's #3293CD header pattern.
 * Source: data/design/thread_page.html lines 483-500.
 */
export function ThreadBreadcrumb({ forumId, sectionName, threadId }: BreadcrumbProps) {
  const linkStyle: React.CSSProperties = {
    color: "var(--rotter-text-header)",
    fontFamily: "var(--rotter-font-primary)",
    fontSize: "var(--rotter-size-sm)",
  };

  return (
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
            <Table width="100%" border={0} cellSpacing={0} cellPadding={3}>
              <tbody>
                <tr style={{ backgroundColor: "var(--rotter-subheader-blue)" }}>
                  <th align="right" style={{ verticalAlign: "bottom" }}>
                    <a href="/" style={linkStyle}>
                      Forums
                    </a>
                    {" "}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/icons/dir-arrow.svg" alt=">" width={8} height={8} />
                    {" "}
                    <a href={`/forum/${forumId}`} style={linkStyle}>
                      {sectionName}
                    </a>
                    {" "}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/icons/dir-arrow.svg" alt=">" width={8} height={8} />
                    {" "}
                    <span style={linkStyle}>Thread #{threadId}</span>
                  </th>
                </tr>
              </tbody>
            </Table>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
