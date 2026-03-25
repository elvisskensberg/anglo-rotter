/**
 * AdSlot test stub (HOME-05)
 * Tests will initially FAIL (red) until AdSlot component is built in Task 1b.
 */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { AdSlot } from "@/components/homepage";

describe("AdSlot (HOME-05)", () => {
  test("renders with correct width and height", () => {
    const { container } = render(<AdSlot width={300} height={250} label="Test" />);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveStyle({ width: "300px", height: "250px" });
  });

  test("displays label text", () => {
    render(<AdSlot width={300} height={250} label="Test" />);
    expect(screen.getByText("Ad: Test (300x250)")).toBeInTheDocument();
  });

  test("has gray border", () => {
    const { container } = render(<AdSlot width={300} height={250} label="Test" />);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveStyle({ border: "1px solid #cccccc" });
  });
});
