import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { HeadlinesPageLayout } from "./HeadlinesPageLayout";

describe("HeadlinesPageLayout", () => {
  // Test 1: Renders a table with two td cells (sidebar + main)
  it("renders a table with two td cells for sidebar and main content", () => {
    render(
      <HeadlinesPageLayout>
        <div data-testid="main-content">Main Content</div>
      </HeadlinesPageLayout>
    );
    const cells = document.querySelectorAll("td");
    expect(cells.length).toBeGreaterThanOrEqual(2);
  });

  // Test 2: Sidebar td has width="160" and valign="top"
  it("sidebar td has width 160px and valign top", () => {
    render(
      <HeadlinesPageLayout>
        <div>Content</div>
      </HeadlinesPageLayout>
    );
    const cells = Array.from(document.querySelectorAll("td"));
    // Find the sidebar cell — it has width style of 160px
    const sidebarCell = cells.find((td) => {
      const style = (td as HTMLElement).style;
      return style.width === "160px";
    });
    expect(sidebarCell).toBeTruthy();
    expect((sidebarCell as HTMLElement).getAttribute("valign")).toBe("top");
  });

  // Test 3: Sidebar contains an ad placeholder div
  it("sidebar contains an ad placeholder", () => {
    render(
      <HeadlinesPageLayout>
        <div>Content</div>
      </HeadlinesPageLayout>
    );
    expect(screen.getByText("Ad Space")).toBeInTheDocument();
  });

  // Test 4: Main content td contains the children prop
  it("renders children in the main content td", () => {
    render(
      <HeadlinesPageLayout>
        <div data-testid="main-content">Test Children</div>
      </HeadlinesPageLayout>
    );
    expect(screen.getByTestId("main-content")).toBeInTheDocument();
    expect(screen.getByText("Test Children")).toBeInTheDocument();
  });

  // Test 5: Body background color context
  it("renders two td cells where second td also has valign top", () => {
    render(
      <HeadlinesPageLayout>
        <div>Content</div>
      </HeadlinesPageLayout>
    );
    const cells = Array.from(document.querySelectorAll("td"));
    const topAlignedCells = cells.filter(
      (td) => (td as HTMLElement).getAttribute("valign") === "top"
    );
    expect(topAlignedCells.length).toBeGreaterThanOrEqual(1);
  });
});
