/**
 * ActionButtons tests (THRD-03)
 * Wave 0 — RED state. Components do not exist yet.
 * Tests will fail with "Cannot find module" until Plan 04-02.
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ActionButtons } from "@/components/thread/ActionButtons";

describe("ActionButtons (THRD-03)", () => {
  const defaultProps = {
    forumId: "scoops1",
    onReplyClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders 5 action links: 'Edit', 'Up', 'Reply', 'View All', 'Back'", () => {
    render(<ActionButtons {...defaultProps} />);
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Up")).toBeInTheDocument();
    expect(screen.getByText("Reply")).toBeInTheDocument();
    expect(screen.getByText("View All")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("'Reply' button calls onReplyClick callback when clicked", () => {
    const onReplyClick = jest.fn();
    render(<ActionButtons {...defaultProps} onReplyClick={onReplyClick} />);
    fireEvent.click(screen.getByText("Reply"));
    expect(onReplyClick).toHaveBeenCalledTimes(1);
  });

  it("'Back' link has href pointing to forum listing", () => {
    render(<ActionButtons {...defaultProps} />);
    const backLink = screen.getByText("Back").closest("a");
    expect(backLink).toBeInTheDocument();
    expect(backLink?.getAttribute("href")).toContain("/forum/scoops1");
  });
});
