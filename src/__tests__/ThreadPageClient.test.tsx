/**
 * ThreadPageClient integration tests (THRD-07 toggle integration)
 * Wave 0 — RED state. Component does not exist yet.
 * Tests will fail with "Cannot find module" until Plan 04-04.
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { ThreadPageClient } from "@/components/thread/ThreadPageClient";
import type { ThreadData, ThreadPost, ReplyTreeItem } from "@/data/thread-seed";

function makeThreadPost(overrides?: Partial<ThreadPost>): ThreadPost {
  return {
    id: 1,
    author: "TestUser",
    content: "Test post content.",
    date: "22.03.26",
    time: "14:00",
    memberSince: "1.1.20",
    postCount: 100,
    starRating: 3,
    ratersCount: 10,
    points: 25,
    ...overrides,
  };
}

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

function makeThreadData(overrides?: Partial<ThreadData>): ThreadData {
  return {
    id: 1,
    forumId: "scoops1",
    sectionName: "Scoops",
    title: "Test Thread Title",
    post: makeThreadPost(),
    replies: [
      makeReplyItem({ id: 1 }),
      makeReplyItem({ id: 2, depth: 2 }),
    ],
    ...overrides,
  };
}

describe("ThreadPageClient (THRD-07 toggle integration)", () => {
  it("renders without crashing with valid thread data", () => {
    const { container } = render(<ThreadPageClient thread={makeThreadData()} />);
    expect(container).toBeTruthy();
  });

  it("QuickReplyForm is not rendered by default", () => {
    const { queryByRole } = render(<ThreadPageClient thread={makeThreadData()} />);
    // QuickReplyForm returns null when visible=false; "Submit Reply" button must not exist
    const submitReplyButton = queryByRole("button", { name: /submit reply/i });
    expect(submitReplyButton).not.toBeInTheDocument();
  });

  it("clicking Reply button renders QuickReplyForm", () => {
    const { getByRole, queryByRole } = render(<ThreadPageClient thread={makeThreadData()} />);
    // Before click: QuickReplyForm not visible
    expect(queryByRole("button", { name: /submit reply/i })).not.toBeInTheDocument();
    // Click the Reply action button (fireEvent wraps in act automatically)
    const replyButton = getByRole("button", { name: /^reply$/i });
    fireEvent.click(replyButton);
    // After click: QuickReplyForm becomes visible with Submit Reply button
    expect(queryByRole("button", { name: /submit reply/i })).toBeInTheDocument();
  });
});
