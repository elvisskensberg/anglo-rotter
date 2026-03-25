import type { NewsItem } from "@/types/forum";
import { NewsItemRow } from "./NewsItemRow";
import styles from "./NewsTable.module.css";

interface NewsTableProps {
  items: NewsItem[];
}

/**
 * NewsTable — renders a full-width table of news items.
 * Each item renders as a NewsItemRow with alternating row colors.
 * Explicit tbody per DSGN-04 (avoids React hydration mismatch).
 */
export function NewsTable({ items }: NewsTableProps) {
  return (
    <table className={styles.newsTable} border={0} width="100%" cellSpacing={1}>
      <tbody>
        {items.map((item, index) => (
          <NewsItemRow key={item.id} item={item} isEven={index % 2 === 0} />
        ))}
      </tbody>
    </table>
  );
}
