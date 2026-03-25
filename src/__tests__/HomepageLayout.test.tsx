/**
 * HomepageLayout test stub (HOME-01)
 * Tests define the acceptance contract for the 3-column table layout.
 */
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { HomepageLayout } from "@/components/homepage";

// Mock next/navigation so useRouter works in jsdom
jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}));

describe("HomepageLayout (HOME-01)", () => {
  test("renders 3-column table with correct widths", () => {
    const { container } = render(<HomepageLayout />);
    const table = container.querySelector("table");
    expect(table).toBeInTheDocument();
    const tds = container.querySelectorAll("table > tbody > tr > td");
    expect(tds).toHaveLength(3);
    const leftTd = tds[0] as HTMLTableCellElement;
    const centerTd = tds[1] as HTMLTableCellElement;
    expect(leftTd).toHaveStyle({ width: "300px" });
    expect(centerTd).toHaveStyle({ width: "450px" });
  });

  test("left td has bgcolor white", () => {
    const { container } = render(<HomepageLayout />);
    const tds = container.querySelectorAll("table > tbody > tr > td");
    const leftTd = tds[0] as HTMLTableCellElement;
    expect(leftTd).toHaveStyle({ backgroundColor: "#ffffff" });
  });

  test("outer table has width 1012px and table-layout fixed", () => {
    const { container } = render(<HomepageLayout />);
    const table = container.querySelector("table") as HTMLTableElement;
    expect(table).toHaveStyle({ width: "1012px", tableLayout: "fixed" });
  });
});
