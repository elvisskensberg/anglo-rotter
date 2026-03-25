"use client";

import { Table } from "@/components/ui/Table";
import { BreakingNewsFeed } from "@/components/homepage/BreakingNewsFeed";
import { TickerSidebar } from "@/components/homepage/TickerSidebar";
import { AdSlot } from "@/components/homepage/AdSlot";

/**
 * HomepageLayout — 3-column table layout for the Rotter homepage.
 * Mirrors Rotter.net's table structure: 300px left ticker, 450px center
 * breaking news, remaining width right column.
 * Auto-refresh is handled inside BreakingNewsFeed via useAutoRefresh hook
 * (default 780000ms / ~13 minutes).
 */
export function HomepageLayout() {
  return (
    <div style={{ textAlign: "center" }}>
      <AdSlot width={970} height={90} label="Below Header" />
      <Table
        style={{ width: "1012px", tableLayout: "fixed", margin: "0 auto" }}
        cellSpacing={1}
        bgcolor="#000000"
      >
        <tbody>
          <tr>
            <td
              style={{
                width: "300px",
                textAlign: "center",
                verticalAlign: "top",
                backgroundColor: "#ffffff",
              }}
            >
              <TickerSidebar />
              <AdSlot width={300} height={250} label="Right Cube" />
            </td>
            <td
              style={{
                textAlign: "center",
                width: "450px",
                verticalAlign: "top",
                backgroundColor: "#ffffff",
              }}
            >
              <BreakingNewsFeed />
              <AdSlot width={450} height={300} label="Center Pos2" />
            </td>
            <td
              style={{
                verticalAlign: "top",
                backgroundColor: "#ffffff",
              }}
            >
              <AdSlot width={250} height={300} label="Left Cube" />
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
