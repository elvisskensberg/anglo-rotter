/**
 * BreakingNewsFeed test (HOME-02)
 * Tests the component with initialHeadlines prop (ForumListing shape).
 * The component also polls via useAutoRefresh, which is mocked via fetch.
 */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BreakingNewsFeed } from "@/components/homepage";
import type { ForumListing } from "@/types/forum";

// Mock fetch so useAutoRefresh doesn't fail in jsdom
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ threads: [] }),
  } as Response)
);

const SAMPLE_HEADLINES: ForumListing[] = [
  {
    id: 1,
    title: "Red Alert (18:42): Shlomi, Mateh Asher",
    time: "18:42",
    date: "22.03.26",
    author: "reporter1",
    lastReplyDate: "22.03.26",
    lastReplyTime: "18:50",
    lastReplyAuthor: "user1",
    lastReplyNum: 5,
    replyCount: 5,
    viewCount: 1200,
    excerpt: "Red Alert details",
    category: "scoops",
    url: "/thread/940171",
  },
  {
    id: 2,
    title: "UAV infiltration (18:42): Yirka",
    time: "18:42",
    date: "22.03.26",
    author: "reporter2",
    lastReplyDate: "22.03.26",
    lastReplyTime: "19:00",
    lastReplyAuthor: "user2",
    lastReplyNum: 2,
    replyCount: 2,
    viewCount: 800,
    excerpt: "UAV details",
    category: "scoops",
    url: "/thread/940169",
  },
];

describe("BreakingNewsFeed (HOME-02)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all initial headlines titles", () => {
    render(<BreakingNewsFeed initialHeadlines={SAMPLE_HEADLINES} />);
    SAMPLE_HEADLINES.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  test("time labels have red color via CSS module class", () => {
    const { container } = render(<BreakingNewsFeed initialHeadlines={SAMPLE_HEADLINES} />);
    const timeSpans = container.querySelectorAll("span.timeLabel");
    expect(timeSpans.length).toBe(SAMPLE_HEADLINES.length);
  });

  test("headline links have navy color via CSS module class", () => {
    const { container } = render(<BreakingNewsFeed initialHeadlines={SAMPLE_HEADLINES} />);
    const links = container.querySelectorAll("a.headlineLink");
    expect(links.length).toBe(SAMPLE_HEADLINES.length);
  });

  test("headline links have target=news", () => {
    const { container } = render(<BreakingNewsFeed initialHeadlines={SAMPLE_HEADLINES} />);
    const links = container.querySelectorAll("a[target='news']");
    expect(links.length).toBe(SAMPLE_HEADLINES.length);
  });
});
