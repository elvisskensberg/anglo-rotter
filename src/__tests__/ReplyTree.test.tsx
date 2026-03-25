/**
 * ReplyTree tests (THRD-04, THRD-05, THRD-06)
 * Wave 0 — RED state. Components do not exist yet.
 * Tests will fail with "Cannot find module" until Plan 04-02.
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { ReplyTree } from "@/components/thread/ReplyTree";
import type { ReplyTreeItem } from "@/data/thread-seed";

function makeReplyItem(overrides: Partial<ReplyTreeItem> & { id: number }): ReplyTreeItem {
  return {
    replyNumber: overrides.id,
    title: `Reply ${overrides.id}`,
    author: "TestUser",
    date: "22.03.26",
    time: "12:00",
    depth: 1,
    ...overrides,
  };
}

describe("ReplyTree — column headers (THRD-04)", () => {
  it("renders 4 column headers: 'Thread', 'Author', 'Date', '#'", () => {
    render(<ReplyTree replies={[makeReplyItem({ id: 1 })]} />);
    expect(screen.getByText("Thread")).toBeInTheDocument();
    expect(screen.getByText("Author")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("#")).toBeInTheDocument();
  });
});

describe("ReplyTree — icon selection by depth (THRD-05)", () => {
  it("top-level reply (depth=1) uses message.svg icon", () => {
    const { container } = render(
      <ReplyTree replies={[makeReplyItem({ id: 1, depth: 1 })]} />
    );
    const icon = container.querySelector("img[src='/icons/message.svg']");
    expect(icon).toBeInTheDocument();
  });

  it("nested reply (depth=2) uses reply-message.svg icon", () => {
    const { container } = render(
      <ReplyTree replies={[makeReplyItem({ id: 1, depth: 2 })]} />
    );
    const icon = container.querySelector("img[src='/icons/reply-message.svg']");
    expect(icon).toBeInTheDocument();
  });

  it("depth=3 reply has 8 nbsp characters before icon", () => {
    const { container } = render(
      <ReplyTree replies={[makeReplyItem({ id: 1, depth: 3 })]} />
    );
    // Find the cell containing the icon
    const td = container.querySelector("td");
    expect(td).toBeInTheDocument();
    // 8 non-breaking spaces (\u00a0) per depth=3 formula: (3-1)*4 = 8
    const cellText = td?.textContent ?? "";
    const nbspCount = (cellText.match(/\u00a0/g) ?? []).length;
    expect(nbspCount).toBeGreaterThanOrEqual(8);
  });
});

describe("ReplyTree — alternating row colors (THRD-06)", () => {
  it("first reply row uses --rotter-row-even background", () => {
    const { container } = render(
      <ReplyTree
        replies={[
          makeReplyItem({ id: 1, depth: 1 }),
          makeReplyItem({ id: 2, depth: 1 }),
        ]}
      />
    );
    // Find data rows (skip the header row)
    const rows = container.querySelectorAll("tbody tr");
    // The first data row (index 1, after header) should have --rotter-row-even
    const firstDataRow = rows[1] as HTMLElement | undefined;
    expect(firstDataRow).toBeDefined();
    const style = firstDataRow?.getAttribute("style") ?? "";
    expect(style).toContain("--rotter-row-even");
  });

  it("second reply row uses --rotter-row-odd background", () => {
    const { container } = render(
      <ReplyTree
        replies={[
          makeReplyItem({ id: 1, depth: 1 }),
          makeReplyItem({ id: 2, depth: 1 }),
        ]}
      />
    );
    // Find data rows (skip header row)
    const rows = container.querySelectorAll("tbody tr");
    // The second data row (index 2) should have --rotter-row-odd
    const secondDataRow = rows[2] as HTMLElement | undefined;
    expect(secondDataRow).toBeDefined();
    const style = secondDataRow?.getAttribute("style") ?? "";
    expect(style).toContain("--rotter-row-odd");
  });
});
