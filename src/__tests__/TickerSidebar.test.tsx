/**
 * TickerSidebar test stub (HOME-03)
 * Tests will initially FAIL (red) until TickerSidebar component is built in Task 1b.
 */
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { TickerSidebar } from "@/components/homepage";

describe("TickerSidebar (HOME-03)", () => {
  test("renders scrollable div with correct dimensions", () => {
    const { container } = render(<TickerSidebar />);
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).toHaveStyle({
      width: "300px",
      height: "430px",
      overflowY: "scroll",
    });
  });

  test("renders ticker items with diegoTitle class", () => {
    const { container } = render(<TickerSidebar />);
    const dateSpans = container.querySelectorAll("span.diegoTitle");
    expect(dateSpans.length).toBeGreaterThan(0);
  });

  test("renders ticker items with diegoContent class", () => {
    const { container } = render(<TickerSidebar />);
    const links = container.querySelectorAll("a.diegoContent");
    expect(links.length).toBeGreaterThan(0);
  });
});
