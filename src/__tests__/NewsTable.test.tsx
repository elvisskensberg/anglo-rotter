/**
 * NewsTable Wave 0 test stubs (NEWS-03)
 * These tests WILL FAIL until Plan 02 creates the component.
 * Failing at "Cannot find module '@/components/news'" is correct Wave 0 behavior.
 */
import "@testing-library/jest-dom";
import { render, within } from "@testing-library/react";
import { NewsTable } from "@/components/news";
import type { NewsItem } from "@/data/news-seed";

/** Minimal NewsItem factory for predictable test data. */
function makeItem(id: number, overrides: Partial<NewsItem> = {}): NewsItem {
  return {
    id,
    headline: `Headline ${id}`,
    time: `10:0${id % 10} 22/03`,
    source: "Ynet",
    sourceIcon: "#2a9d8f",
    category: "news",
    url: "#",
    ...overrides,
  };
}

describe("NewsTable (NEWS-03)", () => {
  test("renders correct number of news item rows", () => {
    const items = [makeItem(1), makeItem(2), makeItem(3), makeItem(4), makeItem(5)];
    const { container } = render(<NewsTable items={items} />);
    const rows = container.querySelectorAll("tbody tr");
    expect(rows.length).toBe(5);
  });

  test("each row has 4 columns", () => {
    const items = [makeItem(1), makeItem(2)];
    const { container } = render(<NewsTable items={items} />);
    const rows = container.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      expect(cells.length).toBe(4);
    });
  });

  test("rows have 24px height", () => {
    const items = [makeItem(1)];
    const { container } = render(<NewsTable items={items} />);
    const row = container.querySelector("tbody tr") as HTMLElement;
    expect(row).toBeInTheDocument();
    expect(row).toHaveStyle({ height: "24px" });
  });

  test("rows have alternating background colors", () => {
    const items = [makeItem(1), makeItem(2), makeItem(3), makeItem(4)];
    const { container } = render(<NewsTable items={items} />);
    const rows = container.querySelectorAll("tbody tr");
    // Odd rows (index 0, 2): #FDFDFD; Even rows (index 1, 3): #eeeeee
    expect(rows[0] as HTMLElement).toHaveStyle({ backgroundColor: "#FDFDFD" });
    expect(rows[1] as HTMLElement).toHaveStyle({ backgroundColor: "#eeeeee" });
    expect(rows[2] as HTMLElement).toHaveStyle({ backgroundColor: "#FDFDFD" });
    expect(rows[3] as HTMLElement).toHaveStyle({ backgroundColor: "#eeeeee" });
  });

  test("renders source icon placeholder as colored circle", () => {
    const items = [makeItem(1, { sourceIcon: "#2a9d8f" })];
    const { container } = render(<NewsTable items={items} />);
    // Source icon must be a span with borderRadius 50% (circle)
    const spans = container.querySelectorAll("span");
    const circleSpan = Array.from(spans).find((span) => {
      const style = (span as HTMLElement).getAttribute("style") ?? "";
      return style.includes("border-radius") && style.includes("50%");
    });
    expect(circleSpan).toBeInTheDocument();
  });

  test("renders headline, time, and source name in row", () => {
    const knownItem = makeItem(42, {
      headline: "Known headline text for testing",
      time: "15:30 22/03",
      source: "Globes",
    });
    const { container } = render(<NewsTable items={[knownItem]} />);
    const row = container.querySelector("tbody tr") as HTMLElement;
    expect(within(row).getByText("Known headline text for testing")).toBeInTheDocument();
    expect(within(row).getByText("15:30 22/03")).toBeInTheDocument();
    expect(within(row).getByText("Globes")).toBeInTheDocument();
  });
});
