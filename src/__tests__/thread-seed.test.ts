/**
 * Thread seed data validation tests.
 * Ensures THREAD_SEED has correct structure, types, and depth levels.
 */
import { THREAD_SEED } from "@/data/thread-seed";
import type { ThreadData, ThreadPost, ReplyTreeItem } from "@/data/thread-seed";

describe("THREAD_SEED structure", () => {
  it("has at least 2 entries", () => {
    expect(THREAD_SEED.length).toBeGreaterThanOrEqual(2);
  });

  it("exports ThreadData, ThreadPost, and ReplyTreeItem types (compile check)", () => {
    // If these type assertions compile, the types are exported correctly.
    const thread: ThreadData = THREAD_SEED[0]!;
    const post: ThreadPost = thread.post;
    const reply: ReplyTreeItem = thread.replies[0]!;
    expect(thread).toBeDefined();
    expect(post).toBeDefined();
    expect(reply).toBeDefined();
  });
});

describe("Thread 940165 (Supreme Court)", () => {
  let thread: ThreadData;

  beforeEach(() => {
    thread = THREAD_SEED.find((t) => t.id === 940165)!;
    expect(thread).toBeDefined();
  });

  it("has id 940165", () => {
    expect(thread.id).toBe(940165);
  });

  it("has title", () => {
    expect(thread.title).toBeTruthy();
    expect(thread.title.length).toBeGreaterThan(0);
  });

  it("has forumId scoops1", () => {
    expect(thread.forumId).toBe("scoops1");
  });

  it("has sectionName", () => {
    expect(thread.sectionName).toBeTruthy();
  });

  it("has 35 replies (posts 1-35)", () => {
    expect(thread.replies.length).toBeGreaterThanOrEqual(35);
  });

  it("has replies at depth >= 3", () => {
    const maxDepth = Math.max(...thread.replies.map((r) => r.depth));
    expect(maxDepth).toBeGreaterThanOrEqual(3);
  });

  it("every reply has valid depth >= 1", () => {
    for (const reply of thread.replies) {
      expect(reply.depth).toBeGreaterThanOrEqual(1);
    }
  });

  it("original post has author mortzix", () => {
    expect(thread.post.author).toBe("mortzix");
  });

  it("original post starRating is 1-5", () => {
    expect(thread.post.starRating).toBeGreaterThanOrEqual(1);
    expect(thread.post.starRating).toBeLessThanOrEqual(5);
  });

  it("original post has memberSince", () => {
    expect(thread.post.memberSince).toBeTruthy();
  });

  it("original post postCount > 0", () => {
    expect(thread.post.postCount).toBeGreaterThan(0);
  });

  it("original post ratersCount >= 0", () => {
    expect(thread.post.ratersCount).toBeGreaterThanOrEqual(0);
  });

  it("original post points >= 0", () => {
    expect(thread.post.points).toBeGreaterThanOrEqual(0);
  });

  it("original post content is non-empty", () => {
    expect(thread.post.content.length).toBeGreaterThan(0);
  });

  it("deep chain reaches depth 6 (5->31->32->33->34->35)", () => {
    const depthMap = new Map(thread.replies.map((r) => [r.id, r.depth]));
    // Post 5 is reply_to 0 → depth 1
    expect(depthMap.get(5)).toBe(1);
    // Post 31 is reply_to 5 → depth 2
    expect(depthMap.get(31)).toBe(2);
    // Post 32 is reply_to 31 → depth 3
    expect(depthMap.get(32)).toBe(3);
    // Post 33 is reply_to 32 → depth 4
    expect(depthMap.get(33)).toBe(4);
    // Post 34 is reply_to 33 → depth 5
    expect(depthMap.get(34)).toBe(5);
    // Post 35 is reply_to 34 → depth 6
    expect(depthMap.get(35)).toBe(6);
  });
});

describe("Thread 940099 (Arad casualty update)", () => {
  let thread: ThreadData;

  beforeEach(() => {
    thread = THREAD_SEED.find((t) => t.id === 940099)!;
    expect(thread).toBeDefined();
  });

  it("has id 940099", () => {
    expect(thread.id).toBe(940099);
  });

  it("has 6 replies", () => {
    expect(thread.replies.length).toBe(6);
  });

  it("max depth is 2", () => {
    const maxDepth = Math.max(...thread.replies.map((r) => r.depth));
    expect(maxDepth).toBe(2);
  });

  it("original post has author dj_deep", () => {
    expect(thread.post.author).toBe("dj_deep");
  });

  it("original post starRating is 1-5", () => {
    expect(thread.post.starRating).toBeGreaterThanOrEqual(1);
    expect(thread.post.starRating).toBeLessThanOrEqual(5);
  });
});

describe("All threads: field validity", () => {
  it("all posts have non-empty author", () => {
    for (const thread of THREAD_SEED) {
      expect(thread.post.author.length).toBeGreaterThan(0);
    }
  });

  it("all posts have date in DD.MM.YY format", () => {
    const datePattern = /^\d{1,2}\.\d{2}\.\d{2}$/;
    for (const thread of THREAD_SEED) {
      expect(thread.post.date).toMatch(datePattern);
    }
  });

  it("all posts have time in HH:MM format", () => {
    const timePattern = /^\d{2}:\d{2}$/;
    for (const thread of THREAD_SEED) {
      expect(thread.post.time).toMatch(timePattern);
    }
  });

  it("all replies have non-empty title", () => {
    for (const thread of THREAD_SEED) {
      for (const reply of thread.replies) {
        expect(reply.title.length).toBeGreaterThan(0);
      }
    }
  });

  it("all replies have non-empty author", () => {
    for (const thread of THREAD_SEED) {
      for (const reply of thread.replies) {
        expect(reply.author.length).toBeGreaterThan(0);
      }
    }
  });

  it("all reply depths are >= 1", () => {
    for (const thread of THREAD_SEED) {
      for (const reply of thread.replies) {
        expect(reply.depth).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("all reply replyNumbers match their ids", () => {
    for (const thread of THREAD_SEED) {
      for (const reply of thread.replies) {
        expect(reply.replyNumber).toBe(reply.id);
      }
    }
  });
});
