import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { DropdownMenu } from "@/components/layout/DropdownMenu";

describe("DropdownMenu Component (LYOT-04)", () => {
  const items = [
    { label: "Item 1", href: "/item1" },
    { label: "Item 2", href: "/item2" },
  ];

  test("renders trigger label", () => {
    render(<DropdownMenu label="Test Menu" items={items} />);
    expect(screen.getByText("Test Menu")).toBeInTheDocument();
  });

  test("renders menu items as links", () => {
    render(<DropdownMenu label="Test Menu" items={items} />);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });
});
