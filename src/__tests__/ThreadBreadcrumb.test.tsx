/**
 * ThreadBreadcrumb tests (THRD-08)
 * Wave 0 — RED state. Components do not exist yet.
 * Tests will fail with "Cannot find module" until Plan 04-02.
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { ThreadBreadcrumb } from "@/components/thread/ThreadBreadcrumb";

describe("ThreadBreadcrumb (THRD-08)", () => {
  const defaultProps = {
    forumId: "scoops1",
    sectionName: "Scoops",
    threadId: 940165,
  };

  it("renders Forums link with href='/'", () => {
    render(<ThreadBreadcrumb {...defaultProps} />);
    const forumsLink = screen.getByRole("link", { name: "Forums" });
    expect(forumsLink).toBeInTheDocument();
    expect(forumsLink).toHaveAttribute("href", "/");
  });

  it("renders section name link with href='/forum/scoops1'", () => {
    render(<ThreadBreadcrumb {...defaultProps} />);
    const sectionLink = screen.getByRole("link", { name: "Scoops" });
    expect(sectionLink).toBeInTheDocument();
    expect(sectionLink).toHaveAttribute("href", "/forum/scoops1");
  });

  it("renders 'Thread #940165' text (not a link)", () => {
    render(<ThreadBreadcrumb {...defaultProps} />);
    // Thread number is plain text — not an anchor
    expect(screen.getByText(/Thread #940165/)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Thread #940165/ })).not.toBeInTheDocument();
  });

  it("breadcrumb bar has backgroundColor matching --rotter-subheader-blue", () => {
    const { container } = render(<ThreadBreadcrumb {...defaultProps} />);
    // The breadcrumb row should have inline style with the CSS variable
    const styledRow = container.querySelector(
      "tr[style*='--rotter-subheader-blue'], tr[style*='subheader-blue']"
    );
    expect(styledRow).toBeInTheDocument();
  });
});
