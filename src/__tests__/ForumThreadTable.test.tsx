/**
 * ForumThreadTable tests (FORUM-01, FORUM-04, FORUM-05, FORUM-07)
 * Tests cover the orchestrator component: header row, tooltip behavior,
 * pagination, and section filtering.
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { ForumThreadTable } from "@/components/forum/ForumThreadTable";
import type { ForumThread } from "@/data/forum-seed";

// Minimal thread factory for predictable test data
function makeThread(overrides: Partial<ForumThread> & { id: number }): ForumThread {
  return {
    title: overrides.title ?? `Thread ${overrides.id}`,
    author: "TestUser",
    date: "22.03.26",
    time: "10:00",
    lastReplyDate: "22.03.26",
    lastReplyTime: "11:00",
    lastReplyAuthor: "Replier",
    lastReplyNum: 1,
    replyCount: 5,
    viewCount: 200,
    excerpt: `Excerpt for thread ${overrides.id}`,
    category: "scoops",
    url: `/forum/scoops/${overrides.id}`,
    ...overrides,
  };
}

// Generate N threads for pagination tests
function makeThreads(count: number, category: ForumThread["category"] = "scoops"): ForumThread[] {
  return Array.from({ length: count }, (_, i) =>
    makeThread({ id: i + 1, category })
  );
}

/** Returns the text of the current-page span in PaginationBar */
function getCurrentPageText(container: HTMLElement): string | undefined {
  const wrapper = container.querySelector("[class~='wrapper'], [class]");
  // PaginationBar wraps in a div — find all spans and filter out separators
  const spans = Array.from(container.querySelectorAll("span"));
  // currentPage span has class 'currentPage'; separator spans have class 'separator'
  const currentPageSpan = spans.find((s) => s.className === "currentPage");
  return currentPageSpan?.textContent ?? undefined;
}

describe("ForumThreadTable (FORUM-01, FORUM-04, FORUM-05, FORUM-07)", () => {
  // ── FORUM-01: 6-column header row ──────────────────────────────────────
  describe("Column header row (FORUM-01)", () => {
    it("renders Titles label in header", () => {
      render(<ForumThreadTable threads={makeThreads(1)} />);
      expect(screen.getByText("Titles")).toBeInTheDocument();
    });

    it("renders Author label in header", () => {
      render(<ForumThreadTable threads={makeThreads(1)} />);
      expect(screen.getByText("Author")).toBeInTheDocument();
    });

    it("renders Last Reply label in header", () => {
      render(<ForumThreadTable threads={makeThreads(1)} />);
      expect(screen.getByText("Last Reply")).toBeInTheDocument();
    });

    it("renders Replies label in header", () => {
      render(<ForumThreadTable threads={makeThreads(1)} />);
      expect(screen.getByText("Replies")).toBeInTheDocument();
    });

    it("renders Views label in header", () => {
      render(<ForumThreadTable threads={makeThreads(1)} />);
      expect(screen.getByText("Views")).toBeInTheDocument();
    });

    it("header row has 6 cells (td elements)", () => {
      const { container } = render(<ForumThreadTable threads={makeThreads(1)} />);
      // table[0] = ForumToolbar, table[1] = breadcrumb, table[2] = thread table
      const tables = container.querySelectorAll("table");
      const threadTable = tables[2];
      const headerRow = threadTable?.querySelector("tbody tr");
      const cells = headerRow?.querySelectorAll("td");
      expect(cells?.length).toBe(6);
    });
  });

  // ── FORUM-04: Tooltip behavior ─────────────────────────────────────────
  describe("Tooltip behavior (FORUM-04)", () => {
    it("tooltip is NOT in the DOM by default", () => {
      const thread = makeThread({ id: 1, title: "My Title", excerpt: "My unique excerpt xyz" });
      render(<ForumThreadTable threads={[thread]} />);
      // The excerpt only appears inside the tooltip (not in ThreadRow columns)
      expect(screen.queryByText("My unique excerpt xyz")).not.toBeInTheDocument();
    });

    it("tooltip appears after mouseEnter on thread icon cell", () => {
      const thread = makeThread({
        id: 1,
        title: "Tooltip Test Title",
        excerpt: "Unique tooltip excerpt abc123",
      });
      render(<ForumThreadTable threads={[thread]} />);

      // The thread row contains the title link
      const rows = screen.getAllByRole("row");
      const threadRow = rows.find((row) =>
        within(row).queryByText("Tooltip Test Title")
      );
      expect(threadRow).toBeTruthy();

      const cells = within(threadRow!).getAllByRole("cell");
      const iconCell = cells[0]; // first cell = icon cell

      fireEvent.mouseEnter(iconCell);
      // excerpt should now be in the DOM (inside tooltip)
      expect(screen.getByText("Unique tooltip excerpt abc123")).toBeInTheDocument();
    });

    it("tooltip disappears after mouseLeave on thread icon cell", () => {
      const thread = makeThread({
        id: 1,
        title: "Tooltip Test Title",
        excerpt: "Unique tooltip excerpt abc123",
      });
      render(<ForumThreadTable threads={[thread]} />);

      const rows = screen.getAllByRole("row");
      const threadRow = rows.find((row) =>
        within(row).queryByText("Tooltip Test Title")
      );
      const cells = within(threadRow!).getAllByRole("cell");
      const iconCell = cells[0];

      fireEvent.mouseEnter(iconCell);
      expect(screen.getByText("Unique tooltip excerpt abc123")).toBeInTheDocument();

      fireEvent.mouseLeave(iconCell);
      expect(screen.queryByText("Unique tooltip excerpt abc123")).not.toBeInTheDocument();
    });
  });

  // ── Sub-component rendering ────────────────────────────────────────────
  describe("Sub-component rendering", () => {
    it("renders ForumToolbar (Login img exists)", () => {
      render(<ForumThreadTable threads={makeThreads(1)} />);
      // ForumToolbar renders an img with alt="Login"
      expect(screen.getByAltText("Login")).toBeInTheDocument();
    });

    it("renders PaginationBar (rows-per-page select exists)", () => {
      render(<ForumThreadTable threads={makeThreads(1)} />);
      expect(screen.getByRole("combobox", { name: /rows per page/i })).toBeInTheDocument();
    });
  });

  // ── FORUM-05: Pagination ───────────────────────────────────────────────
  describe("Pagination (FORUM-05)", () => {
    it("shows only 30 thread rows by default when more than 30 threads exist", () => {
      const threads = makeThreads(65);
      const { container } = render(<ForumThreadTable threads={threads} />);
      // table[2] = thread table. Count all tbody rows.
      const tables = container.querySelectorAll("table");
      const threadTable = tables[2];
      const allRows = threadTable?.querySelectorAll("tbody tr");
      // 1 header row + 30 thread rows = 31
      expect(allRows?.length).toBe(31);
    });

    it("shows correct total pages in pagination bar for 65 threads / 30 per page = 3 pages", () => {
      const threads = makeThreads(65);
      render(<ForumThreadTable threads={threads} />);
      // PaginationBar shows pages 2 and 3 as links
      expect(screen.getByRole("link", { name: "2" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "3" })).toBeInTheDocument();
    });

    it("resets to page 1 when rows-per-page changes", () => {
      const threads = makeThreads(65);
      const { container } = render(<ForumThreadTable threads={threads} />);

      // Navigate to page 2
      const page2Link = screen.getByRole("link", { name: "2" });
      fireEvent.click(page2Link);

      // Verify page 2 is current (currentPage span has class 'currentPage')
      expect(getCurrentPageText(container)).toBe("2");

      // Change rows-per-page to 50
      const select = screen.getByRole("combobox", { name: /rows per page/i });
      fireEvent.change(select, { target: { value: "50" } });

      // Should reset to page 1
      expect(getCurrentPageText(container)).toBe("1");
    });
  });

  // ── FORUM-07: Section filtering ───────────────────────────────────────
  describe("Section filtering (FORUM-07)", () => {
    it("renders ForumSectionDropdown", () => {
      render(<ForumThreadTable threads={makeThreads(1)} />);
      expect(screen.getByRole("combobox", { name: /forum section/i })).toBeInTheDocument();
    });

    it("filters to show only threads matching selected category", () => {
      const threads = [
        makeThread({ id: 1, title: "Scoops Thread 1", category: "scoops" }),
        makeThread({ id: 2, title: "Politics Thread 1", category: "politics" }),
        makeThread({ id: 3, title: "Scoops Thread 2", category: "scoops" }),
      ];
      render(<ForumThreadTable threads={threads} />);

      // Default is 'scoops' — only 2 scoops threads shown
      expect(screen.getByText("Scoops Thread 1")).toBeInTheDocument();
      expect(screen.getByText("Scoops Thread 2")).toBeInTheDocument();
      expect(screen.queryByText("Politics Thread 1")).not.toBeInTheDocument();

      // Switch to politics
      const sectionSelect = screen.getByRole("combobox", { name: /forum section/i });
      fireEvent.change(sectionSelect, { target: { value: "politics" } });

      // Now only politics thread shown
      expect(screen.queryByText("Scoops Thread 1")).not.toBeInTheDocument();
      expect(screen.getByText("Politics Thread 1")).toBeInTheDocument();
    });

    it("resets to page 1 when category changes", () => {
      // 35 scoops + 1 politics thread
      const threads = [
        ...makeThreads(35, "scoops"),
        makeThread({ id: 100, title: "Politics Thread", category: "politics" }),
      ];
      const { container } = render(<ForumThreadTable threads={threads} />);

      // Navigate to page 2 of scoops (35 threads / 30 per page = 2 pages)
      const page2Link = screen.getByRole("link", { name: "2" });
      fireEvent.click(page2Link);

      // Verify page 2 is current
      expect(getCurrentPageText(container)).toBe("2");

      // Switch category to politics
      const sectionSelect = screen.getByRole("combobox", { name: /forum section/i });
      fireEvent.change(sectionSelect, { target: { value: "politics" } });

      // Should reset to page 1
      expect(getCurrentPageText(container)).toBe("1");
    });
  });
});
