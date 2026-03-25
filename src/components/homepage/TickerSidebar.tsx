import React from "react";
import styles from "./TickerSidebar.module.css";
import { TICKER_SEED } from "@/data/homepage-seed";

/**
 * Left sidebar scrolling ticker (Exclusive forum headlines).
 * Renders a 300x430px scrollable div matching the Rotter.net
 * "diego" ticker widget style.
 */
export function TickerSidebar() {
  return (
    <div
      style={{
        position: "relative",
        width: "300px",
        height: "430px",
        overflowY: "scroll",
        overflowX: "hidden",
        direction: "ltr",
        textAlign: "left",
      }}
    >
      <div style={{ width: "260px", position: "absolute" }}>
        {TICKER_SEED.map((item, index) => (
          <React.Fragment key={index}>
            <span className={styles.diegoTitle}>{item.date}</span>
            {"\u00a0\u00a0"}
            <a className={styles.diegoContent} href={item.url} target="new">
              {item.text} <b>({item.category})</b>
            </a>
            <br />
            <br />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
