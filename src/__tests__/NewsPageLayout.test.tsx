/**
 * NewsPageLayout tests (NEWS-01, NEWS-04)
 * Tests structural rendering and auto-refresh behavior via useAutoRefresh hook.
 */
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { NewsPageLayout } from "@/components/news";
import type { NewsItem } from "@/types/forum";

// Mock fetch so useAutoRefresh doesn't fail in jsdom
const mockFetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ items: [] }),
  } as Response)
);
global.fetch = mockFetch;

const NEWS_SAMPLE: NewsItem[] = [
  {
    id: 1,
    headline: "Test headline",
    time: "10:00 22/03",
    source: "Ynet",
    sourceIcon: "#2a9d8f",
    category: "news",
    url: "#",
  },
  {
    id: 2,
    headline: "Sports news item",
    time: "11:00 22/03",
    source: "Maariv",
    sourceIcon: "#e63946",
    category: "sports",
    url: "#",
  },
];

describe("NewsPageLayout (NEWS-01, NEWS-04)", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("renders with news body background token", () => {
    const { container } = render(<NewsPageLayout initialItems={NEWS_SAMPLE} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    // Background must match --rotter-body-news (#eaf4ff)
    const style = wrapper.getAttribute("style") ?? "";
    expect(style).toMatch(/eaf4ff|var\(--rotter-body-news\)/i);
  });

  test("renders teal header bar", () => {
    const { container } = render(<NewsPageLayout initialItems={NEWS_SAMPLE} />);
    // Header bar background must match --rotter-news-teal (#3984ad)
    const allElements = container.querySelectorAll("*");
    const tealEl = Array.from(allElements).find((el) => {
      const style = (el as HTMLElement).getAttribute("style") ?? "";
      return style.includes("#3984ad") || style.includes("var(--rotter-news-teal)");
    });
    expect(tealEl).toBeInTheDocument();
  });

  test("renders logo in header", () => {
    const { container } = render(<NewsPageLayout initialItems={NEWS_SAMPLE} />);
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img?.getAttribute("alt")?.toLowerCase()).toContain("logo");
  });

  test("triggers fetch on 300000ms interval for auto-refresh", () => {
    render(<NewsPageLayout initialItems={NEWS_SAMPLE} />);
    // Initial fetch on mount
    expect(mockFetch).toHaveBeenCalledTimes(1);
    // Second fetch after interval
    jest.advanceTimersByTime(300000);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  test("does not fetch again after unmount", () => {
    const { unmount } = render(<NewsPageLayout initialItems={NEWS_SAMPLE} />);
    unmount();
    mockFetch.mockClear();
    jest.advanceTimersByTime(600000);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
