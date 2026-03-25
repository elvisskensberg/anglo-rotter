import "@testing-library/jest-dom";
import React from "react";
import { render } from "@testing-library/react";
import type { ForumThread } from "@/data/forum-seed";
import { HeadlineRow, getHeadlineIconType } from "./HeadlineRow";

const baseThread: ForumThread = {
  id: 1,
  title: "Government announces new policy",
  author: "JohnDoe",
  date: "22.03.26",
  time: "14:30",
  lastReplyDate: "22.03.26",
  lastReplyTime: "15:00",
  lastReplyAuthor: "JaneDoe",
  lastReplyNum: 5,
  replyCount: 10,
  viewCount: 500,
  excerpt: "A new policy was announced today by the government...",
  category: "politics",
  url: "/thread/1",
};

const mediaThread: ForumThread = {
  ...baseThread,
  id: 2,
  title: "New documentary released",
  category: "media",
  url: "/thread/2",
};

const fireThread: ForumThread = {
  ...baseThread,
  id: 3,
  title: "Red Alert in the north",
  category: "scoops",
  url: "/thread/3",
};

const highViewsThread: ForumThread = {
  ...baseThread,
  id: 4,
  title: "Major event happening now",
  category: "economy",
  viewCount: 6000,
  url: "/thread/4",
};

const watchThread: ForumThread = {
  ...baseThread,
  id: 5,
  title: "Watch: Dramatic footage of the incident",
  category: "culture",
  url: "/thread/5",
};

// Test 1: HeadlineRow renders 4 td elements in a tr
describe("HeadlineRow rendering", () => {
  it("renders 4 td elements inside a tr", () => {
    const { container } = render(
      <table>
        <tbody>
          <HeadlineRow thread={baseThread} isEven={false} />
        </tbody>
      </table>
    );
    const tr = container.querySelector("tr");
    expect(tr).toBeTruthy();
    const tds = container.querySelectorAll("td");
    expect(tds).toHaveLength(4);
  });

  // Test 2: First td contains an img with width=16 height=16
  it("first td contains an img with width=16 and height=16", () => {
    const { container } = render(
      <table>
        <tbody>
          <HeadlineRow thread={baseThread} isEven={false} />
        </tbody>
      </table>
    );
    const tds = container.querySelectorAll("td");
    const img = tds[0]?.querySelector("img");
    expect(img).toBeTruthy();
    expect(img?.getAttribute("width")).toBe("16");
    expect(img?.getAttribute("height")).toBe("16");
  });

  // Test 3: Second td has width="70%" attribute
  it("second td has width='70%' attribute", () => {
    const { container } = render(
      <table>
        <tbody>
          <HeadlineRow thread={baseThread} isEven={false} />
        </tbody>
      </table>
    );
    const tds = container.querySelectorAll("td");
    expect(tds[1]?.getAttribute("width")).toBe("70%");
  });

  // Test 4: Title text renders as bold navy link to thread.url
  it("title renders as a link to thread.url with text15bn class", () => {
    const { container } = render(
      <table>
        <tbody>
          <HeadlineRow thread={baseThread} isEven={false} />
        </tbody>
      </table>
    );
    const link = container.querySelector("a");
    expect(link).toBeTruthy();
    expect(link?.getAttribute("href")).toBe(baseThread.url);
    expect(link?.textContent).toBe(baseThread.title);
    // identity-obj-proxy returns class name string
    expect(link?.className).toContain("text15bn");
  });

  // Test 5: Time renders bold, date renders below in small font
  it("time and date render in the third td", () => {
    const { container } = render(
      <table>
        <tbody>
          <HeadlineRow thread={baseThread} isEven={false} />
        </tbody>
      </table>
    );
    const tds = container.querySelectorAll("td");
    const timeDateCell = tds[2];
    expect(timeDateCell?.textContent).toContain(baseThread.time);
    expect(timeDateCell?.textContent).toContain(baseThread.date);
  });

  // Test 6: Author renders in red bold (text13r class)
  it("author renders in the fourth td with text13r class", () => {
    const { container } = render(
      <table>
        <tbody>
          <HeadlineRow thread={baseThread} isEven={false} />
        </tbody>
      </table>
    );
    const tds = container.querySelectorAll("td");
    const authorCell = tds[3];
    expect(authorCell?.textContent).toContain(baseThread.author);
    const authorEl = authorCell?.querySelector("[class]");
    expect(authorEl?.className).toContain("text13r");
  });

  // Test 10: isEven=true renders #eeeeee background, isEven=false renders #FDFDFD
  it("isEven=true renders #eeeeee background", () => {
    const { container } = render(
      <table>
        <tbody>
          <HeadlineRow thread={baseThread} isEven={true} />
        </tbody>
      </table>
    );
    const tr = container.querySelector("tr");
    expect(tr).toHaveStyle({ backgroundColor: "#eeeeee" });
  });

  it("isEven=false renders #FDFDFD background", () => {
    const { container } = render(
      <table>
        <tbody>
          <HeadlineRow thread={baseThread} isEven={false} />
        </tbody>
      </table>
    );
    const tr = container.querySelector("tr");
    expect(tr).toHaveStyle({ backgroundColor: "#FDFDFD" });
  });
});

// Test 7: getHeadlineIconType returns "fire" for scoops with security-alert-pattern titles
describe("getHeadlineIconType", () => {
  it('returns "fire" for scoops category with "Red Alert" title prefix', () => {
    expect(getHeadlineIconType(fireThread)).toBe("fire");
  });

  it('returns "fire" for scoops category with "UAV infiltration" title prefix', () => {
    const t: ForumThread = { ...baseThread, title: "UAV infiltration over border", category: "scoops" };
    expect(getHeadlineIconType(t)).toBe("fire");
  });

  it('returns "fire" for scoops category with "Alerts for launches" title prefix', () => {
    const t: ForumThread = { ...baseThread, title: "Alerts for launches detected", category: "scoops" };
    expect(getHeadlineIconType(t)).toBe("fire");
  });

  it('returns "fire" for scoops category with "BREAKING" title prefix', () => {
    const t: ForumThread = { ...baseThread, title: "BREAKING: Major event", category: "scoops" };
    expect(getHeadlineIconType(t)).toBe("fire");
  });

  it('returns "fire" for scoops category with "LIVE" title prefix', () => {
    const t: ForumThread = { ...baseThread, title: "LIVE: Coverage of event", category: "scoops" };
    expect(getHeadlineIconType(t)).toBe("fire");
  });

  it('returns "fire" for scoops category with "Multiple explosions" title prefix', () => {
    const t: ForumThread = { ...baseThread, title: "Multiple explosions reported", category: "scoops" };
    expect(getHeadlineIconType(t)).toBe("fire");
  });

  it('returns "fire" for any thread with viewCount > 5000', () => {
    expect(getHeadlineIconType(highViewsThread)).toBe("fire");
  });

  // Test 8: getHeadlineIconType returns "camera" for media category threads
  it('returns "camera" for media category threads', () => {
    expect(getHeadlineIconType(mediaThread)).toBe("camera");
  });

  it('returns "camera" for threads with "Watch:" title prefix', () => {
    expect(getHeadlineIconType(watchThread)).toBe("camera");
  });

  it('returns "camera" for threads with "Documentation of" title prefix', () => {
    const t: ForumThread = { ...baseThread, title: "Documentation of the incident", category: "culture" };
    expect(getHeadlineIconType(t)).toBe("camera");
  });

  // Test 9: getHeadlineIconType returns "normal" for politics/economy/sports/culture threads
  it('returns "normal" for politics threads', () => {
    expect(getHeadlineIconType(baseThread)).toBe("normal");
  });

  it('returns "normal" for economy threads', () => {
    const t: ForumThread = { ...baseThread, category: "economy" };
    expect(getHeadlineIconType(t)).toBe("normal");
  });

  it('returns "normal" for sports threads', () => {
    const t: ForumThread = { ...baseThread, category: "sports" };
    expect(getHeadlineIconType(t)).toBe("normal");
  });

  it('returns "normal" for culture threads', () => {
    const t: ForumThread = { ...baseThread, category: "culture" };
    expect(getHeadlineIconType(t)).toBe("normal");
  });

  // Test for icon src displayed based on type
  it("uses thread-fire.svg icon for fire-type thread", () => {
    const { container } = render(
      <table>
        <tbody>
          <HeadlineRow thread={fireThread} isEven={false} />
        </tbody>
      </table>
    );
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toContain("thread-fire.svg");
  });

  it("uses thread-camera.svg icon for camera-type thread", () => {
    const { container } = render(
      <table>
        <tbody>
          <HeadlineRow thread={mediaThread} isEven={false} />
        </tbody>
      </table>
    );
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toContain("thread-camera.svg");
  });

  it("uses thread-normal.svg icon for normal-type thread", () => {
    const { container } = render(
      <table>
        <tbody>
          <HeadlineRow thread={baseThread} isEven={false} />
        </tbody>
      </table>
    );
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toContain("thread-normal.svg");
  });
});
