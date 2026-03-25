/**
 * forum-seed tests (FORUM-01)
 * Validates ForumThread interface and FORUM_SEED array integrity.
 */
import "@testing-library/jest-dom";
import { FORUM_SEED } from "@/data/forum-seed";
import type { ForumThread } from "@/data/forum-seed";

describe("FORUM_SEED (FORUM-01)", () => {
  test("has length >= 60", () => {
    expect(FORUM_SEED.length).toBeGreaterThanOrEqual(60);
  });

  test("every thread satisfies ForumThread interface (all 14 fields)", () => {
    const validCategories = ["scoops", "politics", "media", "economy", "sports", "culture"];
    FORUM_SEED.forEach((thread: ForumThread, i: number) => {
      expect(typeof thread.id).toBe("number");
      expect(typeof thread.title).toBe("string");
      expect(typeof thread.author).toBe("string");
      expect(typeof thread.date).toBe("string");
      expect(typeof thread.time).toBe("string");
      expect(typeof thread.lastReplyDate).toBe("string");
      expect(typeof thread.lastReplyTime).toBe("string");
      expect(typeof thread.lastReplyAuthor).toBe("string");
      expect(typeof thread.lastReplyNum).toBe("number");
      expect(typeof thread.replyCount).toBe("number");
      expect(typeof thread.viewCount).toBe("number");
      expect(typeof thread.excerpt).toBe("string");
      expect(validCategories.includes(thread.category)).toBe(
        true
      );
      expect(typeof thread.url).toBe("string");
      // Smoke test the index to get useful failure messages
      expect(i).toBeGreaterThanOrEqual(0);
    });
  });

  test("at least 3 threads have viewCount > 5000 (fire state)", () => {
    const fireThreads = FORUM_SEED.filter((t) => t.viewCount > 5000);
    expect(fireThreads.length).toBeGreaterThanOrEqual(3);
  });

  test("at least 9 threads have viewCount > 1000 (hot state)", () => {
    const hotThreads = FORUM_SEED.filter((t) => t.viewCount > 1000);
    expect(hotThreads.length).toBeGreaterThanOrEqual(9);
  });

  test("at least 40 threads have viewCount <= 1000 (normal state)", () => {
    const normalThreads = FORUM_SEED.filter((t) => t.viewCount <= 1000);
    expect(normalThreads.length).toBeGreaterThanOrEqual(40);
  });
});
