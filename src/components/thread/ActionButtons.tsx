import React from "react";

interface ActionButtonsProps {
  forumId: string;
  onReplyClick: () => void;
}

/**
 * Action buttons row for the thread page (THRD-03).
 * Renders 5 text links: Edit, Up, Reply, View All, Back.
 * "Reply" is a <button> styled as a text link to handle the onReplyClick callback.
 * Source: data/design/thread_page.html lines 558-569.
 */
export function ActionButtons({ forumId, onReplyClick }: ActionButtonsProps) {
  const linkStyle: React.CSSProperties = {
    fontSize: "var(--rotter-size-xs)",
    color: "var(--rotter-text-primary)",
    fontFamily: "var(--rotter-font-primary)",
    textDecoration: "none",
  };

  const replyButtonStyle: React.CSSProperties = {
    ...linkStyle,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  };

  return (
    <tr style={{ backgroundColor: "var(--rotter-row-even)" }}>
      <td colSpan={2} align="center">
        <a href="#" style={linkStyle}>
          Edit
        </a>
        {" | "}
        <a href="#top" style={linkStyle}>
          Up
        </a>
        {" | "}
        <button onClick={onReplyClick} style={replyButtonStyle}>
          Reply
        </button>
        {" | "}
        <a href="#" style={linkStyle}>
          View All
        </a>
        {" | "}
        <a href={"/forum/" + forumId} style={linkStyle}>
          Back
        </a>
      </td>
    </tr>
  );
}
