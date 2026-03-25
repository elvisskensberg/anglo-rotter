"use client";

import { useState } from "react";
import type { NewsItem, NewsCategory } from "@/types/forum";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { NewsCategoryTabs } from "./NewsCategoryTabs";
import { NewsTable } from "./NewsTable";
import { PushSubscribeButton } from "@/components/pwa/PushSubscribeButton";
import styles from "./NewsPageLayout.module.css";

const REFRESH_MS = Number(process.env.NEXT_PUBLIC_NEWS_REFRESH_INTERVAL_MS ?? 300000);

interface NewsPageLayoutProps {
  initialItems?: NewsItem[];
}

/**
 * NewsPageLayout — full news flash page layout.
 * Renders teal header with logo, category filter tabs, and news table.
 * Auto-refreshes every 5 minutes (300000ms) via useAutoRefresh hook.
 */
export function NewsPageLayout({ initialItems = [] }: NewsPageLayoutProps) {
  const [activeCategory, setActiveCategory] = useState<NewsCategory | "all">("all");

  const { data } = useAutoRefresh<{ items: NewsItem[] }>("/api/news", REFRESH_MS);
  const items = data?.items ?? initialItems;

  const visibleItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <div style={{ backgroundColor: "var(--rotter-body-news)" }}>
      {/* Full-width header table */}
      <table border={0} width="100%" cellSpacing={0} cellPadding={0}>
        <tbody>
          <tr>
            <td className={styles.logoCell}>
              <a href="/">
                <img
                  src="/images/logo.svg"
                  alt="MultiRotter News logo"
                  style={{ maxHeight: "60px" }}
                />
              </a>
            </td>
            <td className={styles.infoCell}>
              {/* Sub-header row with date and nav links */}
              <table
                border={0}
                width="100%"
                cellSpacing={0}
                style={{
                  backgroundColor: "var(--rotter-news-teal)",
                  color: "var(--rotter-text-header)",
                }}
              >
                <tbody>
                  <tr>
                    <td className={styles.dateCell}>
                      <span style={{ fontSize: "small", fontWeight: "bold" }}>
                        &nbsp;&nbsp;{new Date().toLocaleDateString("en-GB")}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <a
                        href="/forum/scoops1"
                        style={{ color: "white", fontWeight: "bold", marginRight: "16px" }}
                      >
                        Scoops Forum
                      </a>
                      <a
                        href="/headlines"
                        style={{ color: "white", fontWeight: "bold", marginRight: "16px" }}
                      >
                        Headlines
                      </a>
                      <PushSubscribeButton />
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* Category filter tabs */}
              <NewsCategoryTabs activeTab={activeCategory} onTabChange={setActiveCategory} />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Section title and news items */}
      <center>
        <table border={0} cellSpacing={1} width="100%">
          <tbody>
            <tr>
              <td className={styles.sectionTitle}>
                <h2 style={{ fontSize: "15px", margin: "4px 0" }}>
                  Press Review / News Flashes
                </h2>
              </td>
            </tr>
          </tbody>
        </table>

        <NewsTable items={visibleItems} />
      </center>
    </div>
  );
}
