/**
 * ThreadRow tests (FORUM-01, FORUM-02, FORUM-03)
 * TDD: written before ThreadRow implementation (RED → GREEN).
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThreadRow } from "@/components/forum/ThreadRow";
import type { ForumThread } from "@/data/forum-seed";

// Helper: wrap in valid table context
function renderRow(thread: ForumThread, isEven: boolean, overrides?: Partial<Parameters<typeof ThreadRow>[0]>) {
  const onIconEnter = jest.fn();
  const onIconLeave = jest.fn();
  const { container } = render(
    <table>
      <tbody>
        <ThreadRow
          thread={thread}
          isEven={isEven}
          onIconEnter={overrides?.onIconEnter ?? onIconEnter}
          onIconLeave={overrides?.onIconLeave ?? onIconLeave}
        />
      </tbody>
    </table>
  );
  return { container, onIconEnter, onIconLeave };
}

const normalThread: ForumThread = {
  id: 1,
  title: "Test thread title",
  author: "TestUser",
  date: "22.03.26",
  time: "18:42",
  lastReplyDate: "22.03.26",
  lastReplyTime: "19:00",
  lastReplyAuthor: "Replier",
  lastReplyNum: 5,
  replyCount: 6,
  viewCount: 500,
  excerpt: "This is the excerpt text for the tooltip",
  category: "scoops",
  url: "/forum/scoops1/1",
};

const hotThread: ForumThread = {
  ...normalThread,
  id: 2,
  viewCount: 2000,
  replyCount: 25,
};

const fireThread: ForumThread = {
  ...normalThread,
  id: 3,
  viewCount: 6000,
  replyCount: 75,
};

describe("ThreadRow (FORUM-02, FORUM-03)", () => {
  test("renders 6 td cells in a single tr", () => {
    const { container } = renderRow(normalThread, false);
    const tr = container.querySelector("tr");
    expect(tr).toBeInTheDocument();
    const tds = tr?.querySelectorAll("td");
    expect(tds?.length).toBe(6);
  });

  test("title cell has width 55%", () => {
    const { container } = renderRow(normalThread, false);
    const tds = container.querySelectorAll("td");
    // Col 2 (index 1) is the title cell
    expect(tds[1]).toHaveAttribute("width", "55%");
  });

  test("row background is var(--rotter-row-even) when isEven=true", () => {
    const { container } = renderRow(normalThread, true);
    const tr = container.querySelector("tr") as HTMLElement;
    expect(tr.style.backgroundColor).toBe("var(--rotter-row-even)");
  });

  test("row background is var(--rotter-row-odd) when isEven=false", () => {
    const { container } = renderRow(normalThread, false);
    const tr = container.querySelector("tr") as HTMLElement;
    expect(tr.style.backgroundColor).toBe("var(--rotter-row-odd)");
  });

  test("normal thread (viewCount=500) renders thread-normal.svg icon", () => {
    const { container } = renderRow(normalThread, false);
    const img = container.querySelector("img") as HTMLImageElement;
    expect(img.src).toContain("thread-normal.svg");
  });

  test("hot thread (viewCount=2000) renders thread-hot.svg icon", () => {
    const { container } = renderRow(hotThread, false);
    const imgs = container.querySelectorAll("img");
    const iconImg = imgs[0] as HTMLImageElement;
    expect(iconImg.src).toContain("thread-hot.svg");
  });

  test("fire thread (viewCount=6000) renders thread-fire.svg icon", () => {
    const { container } = renderRow(fireThread, false);
    const imgs = container.querySelectorAll("img");
    const iconImg = imgs[0] as HTMLImageElement;
    expect(iconImg.src).toContain("thread-fire.svg");
  });

  test("hot thread view count renders with color red", () => {
    const { container } = renderRow(hotThread, false);
    const viewsCell = container.querySelectorAll("td")[5] as HTMLElement;
    // The bold element inside the views cell should have red color
    const boldEl = viewsCell.querySelector("b") as HTMLElement;
    expect(boldEl.style.color).toBe("var(--rotter-views-hot)");
  });

  test("normal thread view count renders with color #ff9933", () => {
    const { container } = renderRow(normalThread, false);
    const viewsCell = container.querySelectorAll("td")[5] as HTMLElement;
    const boldEl = viewsCell.querySelector("b") as HTMLElement;
    expect(boldEl.style.color).toBe("var(--rotter-views-orange)");
  });

  test("fire thread shows hot-news.svg next to view count", () => {
    const { container } = renderRow(fireThread, false);
    const viewsCell = container.querySelectorAll("td")[5] as HTMLElement;
    const hotNewsImg = viewsCell.querySelector("img") as HTMLImageElement;
    expect(hotNewsImg).toBeInTheDocument();
    expect(hotNewsImg.src).toContain("hot-news.svg");
  });

  test("icon cell calls onIconEnter on mouseenter with thread title and excerpt", () => {
    const { container, onIconEnter } = renderRow(normalThread, false);
    const iconCell = container.querySelectorAll("td")[0] as HTMLElement;
    fireEvent.mouseEnter(iconCell, { clientX: 100, clientY: 200 });
    expect(onIconEnter).toHaveBeenCalledWith(normalThread.title, normalThread.excerpt, 100, 200);
  });

  test("icon cell calls onIconLeave on mouseleave", () => {
    const { container, onIconLeave } = renderRow(normalThread, false);
    const iconCell = container.querySelectorAll("td")[0] as HTMLElement;
    fireEvent.mouseLeave(iconCell);
    expect(onIconLeave).toHaveBeenCalled();
  });
});
