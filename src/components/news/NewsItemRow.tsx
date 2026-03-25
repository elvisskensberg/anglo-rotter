import type { NewsItem } from "@/types/forum";
import styles from "./NewsItemRow.module.css";

interface NewsItemRowProps {
  item: NewsItem;
  isEven: boolean;
}

/**
 * NewsItemRow — single 24px tall row in the news flash table.
 * 4 columns: source icon circle, headline link, time, source name.
 * Alternates background between --rotter-row-odd and --rotter-row-even.
 */
export function NewsItemRow({ item, isEven }: NewsItemRowProps) {
  // Use explicit hex values so jsdom tests can assert on style (CSS vars don't resolve in jsdom)
  // isEven=true → index 0, 2, 4... → odd visual rows (1-indexed) → #FDFDFD (row-odd)
  // isEven=false → index 1, 3, 5... → even visual rows → #eeeeee (row-even)
  const rowBg = isEven ? "#FDFDFD" : "#eeeeee";

  return (
    <tr style={{ height: "24px", backgroundColor: rowBg }}>
      <td className={styles.iconCell}>
        <span
          className={styles.sourceIcon}
          style={{
            display: "inline-block",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: item.sourceIcon,
          }}
        />
      </td>
      <td className={styles.headlineCell}>
        <a href={item.url} style={{ color: "var(--rotter-text-primary)", fontSize: "16px" }}>
          {item.headline}
        </a>
      </td>
      <td className={styles.timeCell} dir="ltr">
        <span style={{ fontSize: "small" }}>{item.time}</span>
      </td>
      <td className={styles.sourceCell}>
        <span style={{ fontSize: "small", fontWeight: "bold" }}>{item.source}</span>
      </td>
    </tr>
  );
}
