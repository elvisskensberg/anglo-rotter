import React from "react";
import { Table } from "@/components/ui/Table";
import { ReplyRow } from "@/components/thread/ReplyRow";
import type { ReplyTreeItem } from "@/data/thread-seed";
import styles from "./ReplyTree.module.css";

interface ReplyTreeProps {
  replies: ReplyTreeItem[];
}

export function ReplyTree({ replies }: ReplyTreeProps) {
  return (
    <Table width="100%" cellSpacing={1} cellPadding={1}>
      <tbody>
        <tr
          className={styles.headerRow}
          style={{ backgroundColor: "var(--rotter-row-even)" }}
        >
          <th align="right">Thread</th>
          <th align="center">Author</th>
          <th align="center">Date</th>
          <th align="center">#</th>
        </tr>
        {replies.map((item, index) => (
          <ReplyRow key={item.id} item={item} isEven={index % 2 === 0} />
        ))}
      </tbody>
    </Table>
  );
}
