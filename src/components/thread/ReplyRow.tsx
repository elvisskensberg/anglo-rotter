import React from "react";
import type { ReplyTreeItem } from "@/data/thread-seed";

interface ReplyRowProps {
  item: ReplyTreeItem;
  isEven: boolean;
}

export function ReplyRow({ item, isEven }: ReplyRowProps) {
  const nbspCount = item.depth === 1 ? 2 : (item.depth - 1) * 4;
  const iconSrc = item.depth === 1 ? "/icons/message.svg" : "/icons/reply-message.svg";

  return (
    <tr style={{ backgroundColor: isEven ? "var(--rotter-row-even)" : "var(--rotter-row-odd)" }}>
      <td align="right" width="100%" style={{ whiteSpace: "nowrap" }}>
        {"\u00a0".repeat(nbspCount)}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSrc} alt="" width={16} height={16} />
        {" "}
        <a
          href={`#${item.replyNumber}`}
          style={{
            fontSize: "var(--rotter-size-thread-title)",
            color: "var(--rotter-text-primary)",
          }}
        >
          {item.title}
        </a>
      </td>
      <td align="center" style={{ whiteSpace: "nowrap" }}>
        <span
          style={{
            fontSize: "var(--rotter-size-sm)",
            color: "var(--rotter-text-primary)",
          }}
        >
          {item.author}
        </span>
      </td>
      <td align="center" style={{ whiteSpace: "nowrap" }}>
        <span
          style={{
            fontSize: "var(--rotter-size-sm)",
            color: "var(--rotter-text-primary)",
          }}
        >
          {item.date}
        </span>{" "}
        <span
          style={{
            fontSize: "var(--rotter-size-sm)",
            color: "var(--rotter-text-time)",
          }}
        >
          {item.time}
        </span>
      </td>
      <td align="center" style={{ whiteSpace: "nowrap" }}>
        <span
          style={{
            fontSize: "var(--rotter-size-sm)",
            color: "var(--rotter-text-primary)",
          }}
        >
          {item.replyNumber}
        </span>
      </td>
    </tr>
  );
}
