import type { NewsCategory } from "@/types/forum";
import styles from "./NewsCategoryTabs.module.css";

interface Tab {
  key: NewsCategory | "all";
  label: string;
}

const TABS: Tab[] = [
  { key: "news", label: "News" },
  { key: "sports", label: "Sports" },
  { key: "economy", label: "Economy" },
  { key: "tech", label: "Tech" },
  { key: "all", label: "All" },
];

interface NewsCategoryTabsProps {
  activeTab: NewsCategory | "all";
  onTabChange: (tab: NewsCategory | "all") => void;
}

/**
 * NewsCategoryTabs — horizontal tab row for filtering news by category.
 * Renders as a full-width table with one td per tab.
 * Active tab uses --rotter-subheader-blue; inactive uses --rotter-news-teal.
 */
export function NewsCategoryTabs({ activeTab, onTabChange }: NewsCategoryTabsProps) {
  return (
    <table width="100%" cellSpacing={0} border={0} style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          {TABS.map((tab) => (
            <td
              key={tab.key}
              className={
                activeTab === tab.key
                  ? `${styles.categoryTab} ${styles.active}`
                  : styles.categoryTab
              }
              onClick={() => onTabChange(tab.key)}
              style={{
                backgroundColor:
                  activeTab === tab.key
                    ? "var(--rotter-subheader-blue)"
                    : "var(--rotter-news-teal)",
                textDecoration: activeTab === tab.key ? "underline" : undefined,
              }}
            >
              <b>{tab.label}</b>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
